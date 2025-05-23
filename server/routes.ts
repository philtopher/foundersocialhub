import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { generateAccessToken, verifyAccessToken, registerWebhook, generateAccessLink } from "./external-access";
import { 
  insertCommunitySchema, 
  insertPostSchema, 
  insertCommentSchema,
  Community,
  commentStatusEnum,
  voteTypeEnum,
  users,
  communityMembers,
  posts,
  comments,
  postVotes,
  commentVotes
} from "@shared/schema";
import { moderateComment, processCommentResponse, enhanceComment, generateProcessFlows } from "./openai";
import { z } from "zod";
import { eq, and, desc, asc, sql, isNull, or } from "drizzle-orm";
import slugify from "slugify";
import { 
  createStripeSubscription, 
  handleStripeWebhook, 
  createPaypalOrder,
  capturePaypalOrder,
  loadPaypalDefault
} from "./payment-processors";
import { 
  sendPaymentConfirmationEmail, 
  sendPaymentFailedEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail
} from "./email";
import Stripe from "stripe";
import { db } from "@db";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

// Password hashing function
const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Sets up authentication routes
  setupAuth(app);

  // Middleware to check if user is authenticated
  const isAuthenticated = (req: Request, res: Response, next: Function) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // Communities
  app.get("/api/communities", async (req, res) => {
    try {
      const communities = await storage.getAllCommunities();
      res.json(communities);
    } catch (error) {
      console.error("Error fetching communities:", error);
      res.status(500).json({ message: "Failed to fetch communities" });
    }
  });

  app.get("/api/communities/trending", async (req, res) => {
    try {
      const communities = await storage.getTrendingCommunities();
      res.json(communities);
    } catch (error) {
      console.error("Error fetching trending communities:", error);
      res.status(500).json({ message: "Failed to fetch trending communities" });
    }
  });

  app.get("/api/communities/:name", async (req, res) => {
    try {
      const community = await storage.getCommunityByName(req.params.name);
      if (!community) {
        return res.status(404).json({ message: "Community not found" });
      }
      res.json(community);
    } catch (error) {
      console.error("Error fetching community:", error);
      res.status(500).json({ message: "Failed to fetch community" });
    }
  });

  app.post("/api/communities", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertCommunitySchema.parse({
        ...req.body,
        creatorId: req.user!.id
      });
      
      const community = await storage.createCommunity(validatedData);
      
      // Add creator as admin member
      await storage.addCommunityMember({
        userId: req.user!.id,
        communityId: community.id,
        role: "admin"
      });
      
      res.status(201).json(community);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error creating community:", error);
      res.status(500).json({ message: "Failed to create community" });
    }
  });

  app.post("/api/communities/:communityId/join", isAuthenticated, async (req, res) => {
    try {
      const communityId = parseInt(req.params.communityId);
      const userId = req.user!.id;
      
      const community = await storage.getCommunity(communityId);
      if (!community) {
        return res.status(404).json({ message: "Community not found" });
      }
      
      const membership = await storage.getCommunityMembership(userId, communityId);
      if (membership) {
        return res.status(400).json({ message: "Already a member of this community" });
      }
      
      await storage.addCommunityMember({
        userId,
        communityId,
        role: "member"
      });
      
      // Increment member count
      await storage.updateCommunityMemberCount(communityId, 1);
      
      res.status(200).json({ message: "Successfully joined community" });
    } catch (error) {
      console.error("Error joining community:", error);
      res.status(500).json({ message: "Failed to join community" });
    }
  });

  app.post("/api/communities/:communityId/leave", isAuthenticated, async (req, res) => {
    try {
      const communityId = parseInt(req.params.communityId);
      const userId = req.user!.id;
      
      const membership = await storage.getCommunityMembership(userId, communityId);
      if (!membership) {
        return res.status(400).json({ message: "Not a member of this community" });
      }
      
      if (membership.role === "admin") {
        const adminCount = await storage.getCommunityAdminCount(communityId);
        if (adminCount <= 1) {
          return res.status(400).json({ message: "Cannot leave community as the only admin" });
        }
      }
      
      await storage.removeCommunityMember(userId, communityId);
      
      // Decrement member count
      await storage.updateCommunityMemberCount(communityId, -1);
      
      res.status(200).json({ message: "Successfully left community" });
    } catch (error) {
      console.error("Error leaving community:", error);
      res.status(500).json({ message: "Failed to leave community" });
    }
  });

  // Posts
  app.get("/api/posts", async (req, res) => {
    try {
      const sort = (req.query.sort as string) || "hot";
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const userId = req.user?.id ? Number(req.user.id) : undefined;
      
      let posts;
      if (userId && req.query.feed === "subscribed") {
        // Get posts from communities the user is a member of
        posts = await storage.getSubscribedPosts(userId, sort, page, limit);
      } else {
        // Get all posts
        posts = await storage.getAllPosts(sort, page, limit);
      }
      
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get("/api/communities/:communityId/posts", async (req, res) => {
    try {
      const communityId = parseInt(req.params.communityId);
      const sort = (req.query.sort as string) || "hot";
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const posts = await storage.getCommunityPosts(communityId, sort, page, limit);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching community posts:", error);
      res.status(500).json({ message: "Failed to fetch community posts" });
    }
  });

  app.get("/api/posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getPost(id);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      res.json(post);
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  app.post("/api/communities/:communityId/posts", isAuthenticated, async (req, res) => {
    try {
      const communityId = parseInt(req.params.communityId);
      
      // Check if community exists
      const community = await storage.getCommunity(communityId);
      if (!community) {
        return res.status(404).json({ message: "Community not found" });
      }
      
      // Check if user is a member of the community
      const membership = await storage.getCommunityMembership(Number(req.user!.id), communityId);
      if (!membership && community.visibility !== "public") {
        return res.status(403).json({ message: "You must be a member to post in this community" });
      }
      
      // Generate a slug for the post
      const slug = slugify(req.body.title, { lower: true, strict: true });
      
      const validatedData = insertPostSchema.parse({
        ...req.body,
        authorId: Number(req.user!.id),
        communityId,
        slug: `${slug}-${Date.now()}`
      });
      
      const post = await storage.createPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  app.post("/api/posts/:postId/vote", isAuthenticated, async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const userId = Number(req.user!.id);
      const voteType = req.body.voteType as "upvote" | "downvote";
      
      if (voteType !== "upvote" && voteType !== "downvote") {
        return res.status(400).json({ message: "Invalid vote type" });
      }
      
      // Check if post exists
      const post = await storage.getPost(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Check if user has already voted
      const existingVote = await storage.getPostVote(userId, postId);
      
      if (existingVote) {
        if (existingVote.voteType === voteType) {
          // Remove vote if same type
          await storage.removePostVote(userId, postId);
          
          // Update post vote counts
          await storage.updatePostVoteCounts(postId);
          
          return res.status(200).json({ message: "Vote removed" });
        } else {
          // Change vote type
          await storage.updatePostVote(userId, postId, voteType);
        }
      } else {
        // Create new vote
        await storage.createPostVote(userId, postId, voteType);
      }
      
      // Update post vote counts
      await storage.updatePostVoteCounts(postId);
      
      res.status(200).json({ message: "Vote recorded" });
    } catch (error) {
      console.error("Error voting on post:", error);
      res.status(500).json({ message: "Failed to record vote" });
    }
  });

  // Comments
  app.get("/api/posts/:postId/comments", async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const sort = (req.query.sort as string) || "top";
      
      const comments = await storage.getPostComments(postId, sort);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/posts/:postId/comments", isAuthenticated, async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const userId = Number(req.user!.id);
      const parentId = req.body.parentId ? parseInt(req.body.parentId) : null;
      
      // Check if post exists
      const post = await storage.getPost(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Validate comment content
      const validatedData = insertCommentSchema.parse({
        content: req.body.content,
        authorId: userId,
        postId,
        parentId
      });
      
      // Moderate comment using OpenAI
      const moderationResult = await moderateComment(validatedData.content, post.title);
      
      // Create comment with appropriate status
      const comment = await storage.createComment({
        ...validatedData,
        status: moderationResult.isApproved ? "approved" : "pending",
        aiPrompt: moderationResult.aiPrompt,
        aiResponse: moderationResult.isApproved ? null : moderationResult.reason
      });
      
      // Increment post comment count
      await storage.incrementPostCommentCount(postId);
      
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  app.post("/api/comments/:commentId/respond-to-ai", isAuthenticated, async (req, res) => {
    try {
      const commentId = parseInt(req.params.commentId);
      const userId = Number(req.user!.id);
      const response = req.body.response;
      
      // Check if comment exists and belongs to the user
      const comment = await storage.getComment(commentId);
      
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      
      if (comment.authorId !== userId) {
        return res.status(403).json({ message: "Not authorized to respond to this comment" });
      }
      
      if (!comment.aiPrompt) {
        return res.status(400).json({ message: "No AI prompt to respond to" });
      }
      
      // Process the response
      const processResult = await processCommentResponse(comment.content, comment.aiPrompt, response);
      
      // Update the comment
      const updatedComment = await storage.updateComment(commentId, {
        content: processResult.finalComment,
        status: processResult.isApproved ? "approved" : "pending",
        aiResponse: response
      });
      
      res.status(200).json(updatedComment);
    } catch (error) {
      console.error("Error processing AI response:", error);
      res.status(500).json({ message: "Failed to process response" });
    }
  });
  
  // AI-enhance a comment
  app.post("/api/comments/ai-enhance", isAuthenticated, async (req, res) => {
    try {
      const { content, postId } = req.body;
      const user = req.user!;
      
      // Check if user has permission to use AI features
      if (!user.subscriptionPlan || user.subscriptionPlan === "free") {
        return res.status(403).json({ message: "AI features are only available for premium users" });
      }
      
      // For standard plan users, check remaining prompts
      if (user.subscriptionPlan === "standard" && (user.remainingPrompts === undefined || user.remainingPrompts <= 0)) {
        return res.status(403).json({ message: "You have used all your AI prompts for this month" });
      }
      
      // Get post title for context
      const post = await storage.getPost(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Process the comment with AI
      const { enhancedContent, isApproved } = await enhanceComment(content, post.title);
      
      if (!isApproved) {
        return res.status(400).json({ message: "Comment contains inappropriate content" });
      }
      
      // Decrement remaining prompts for standard users
      if (user.subscriptionPlan === "standard" && typeof user.remainingPrompts === "number") {
        await storage.updateUserRemainingPrompts(Number(user.id), user.remainingPrompts - 1);
      }
      
      res.status(200).json({ enhancedContent });
    } catch (error) {
      console.error("Error enhancing comment with AI:", error);
      res.status(500).json({ message: "Failed to enhance comment with AI" });
    }
  });
  
  // Generate process flows from a comment
  app.post("/api/comments/:commentId/process-flows", isAuthenticated, async (req, res) => {
    try {
      const commentId = parseInt(req.params.commentId);
      const user = req.user!;
      
      // Check if user has permission to use AI features
      if (!user.subscriptionPlan || user.subscriptionPlan === "free") {
        return res.status(403).json({ message: "AI features are only available for premium users" });
      }
      
      // For standard plan users, check remaining prompts
      if (user.subscriptionPlan === "standard" && (user.remainingPrompts === undefined || user.remainingPrompts <= 0)) {
        return res.status(403).json({ message: "You have used all your AI prompts for this month" });
      }
      
      // Get the comment
      const comment = await storage.getComment(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      
      // Get post title for context
      const post = await storage.getPost(comment.postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Generate process flows
      const { processFlows, isApproved } = await generateProcessFlows(comment.content, post.title);
      
      if (!isApproved) {
        return res.status(400).json({ message: "Comment is not suitable for process flow generation" });
      }
      
      // Decrement remaining prompts for standard users
      if (user.subscriptionPlan === "standard" && typeof user.remainingPrompts === "number") {
        await storage.updateUserRemainingPrompts(Number(user.id), user.remainingPrompts - 1);
      }
      
      // Update comment with AI processed status
      await storage.updateComment(commentId, {
        status: "ai_processed"
      });
      
      res.status(200).json({ processFlows });
    } catch (error) {
      console.error("Error generating process flows:", error);
      res.status(500).json({ message: "Failed to generate process flows" });
    }
  });

  app.post("/api/comments/:commentId/vote", isAuthenticated, async (req, res) => {
    try {
      const commentId = parseInt(req.params.commentId);
      const userId = Number(req.user!.id);
      const voteType = req.body.voteType as "upvote" | "downvote";
      
      if (voteType !== "upvote" && voteType !== "downvote") {
        return res.status(400).json({ message: "Invalid vote type" });
      }
      
      // Check if comment exists
      const comment = await storage.getComment(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      
      // Check if user has already voted
      const existingVote = await storage.getCommentVote(userId, commentId);
      
      if (existingVote) {
        if (existingVote.voteType === voteType) {
          // Remove vote if same type
          await storage.removeCommentVote(userId, commentId);
          
          // Update comment vote counts
          await storage.updateCommentVoteCounts(commentId);
          
          return res.status(200).json({ message: "Vote removed" });
        } else {
          // Change vote type
          await storage.updateCommentVote(userId, commentId, voteType);
        }
      } else {
        // Create new vote
        await storage.createCommentVote(userId, commentId, voteType);
      }
      
      // Update comment vote counts
      await storage.updateCommentVoteCounts(commentId);
      
      res.status(200).json({ message: "Vote recorded" });
    } catch (error) {
      console.error("Error voting on comment:", error);
      res.status(500).json({ message: "Failed to record vote" });
    }
  });

  // User profile
  app.get("/api/users/:username", async (req, res) => {
    try {
      const user = await storage.getUserByUsername(req.params.username);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't expose sensitive info
      const { password, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.get("/api/users/:username/posts", async (req, res) => {
    try {
      const user = await storage.getUserByUsername(req.params.username);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const posts = await storage.getUserPosts(Number(user.id), page, limit);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      res.status(500).json({ message: "Failed to fetch user posts" });
    }
  });

  app.get("/api/users/:username/comments", async (req, res) => {
    try {
      const user = await storage.getUserByUsername(req.params.username);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const comments = await storage.getUserComments(Number(user.id), page, limit);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching user comments:", error);
      res.status(500).json({ message: "Failed to fetch user comments" });
    }
  });

  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      const type = req.query.type as string || "all";
      
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      let results: any = {};
      
      if (type === "all" || type === "communities") {
        results.communities = await storage.searchCommunities(query);
      }
      
      if (type === "all" || type === "posts") {
        results.posts = await storage.searchPosts(query);
      }
      
      if (type === "all" || type === "users") {
        results.users = await storage.searchUsers(query);
      }
      
      res.json(results);
    } catch (error) {
      console.error("Error searching:", error);
      res.status(500).json({ message: "Search failed" });
    }
  });
  
  // Payment routes
  app.post("/api/payments/stripe/create-subscription", isAuthenticated, createStripeSubscription);
  app.post("/api/payments/stripe/webhook", handleStripeWebhook);
  
  // Subscription management routes
  app.post("/api/payments/cancel-subscription", isAuthenticated, async (req, res) => {
    try {
      const userId = Number(req.user!.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if user has a subscription to cancel
      if (!user.stripeSubscriptionId && !user.paypalSubscriptionId) {
        return res.status(400).json({ message: "No active subscription found" });
      }
      
      // For Stripe subscriptions
      if (user.stripeSubscriptionId) {
        try {
          // Implement Stripe cancellation
          const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: '2023-10-16',
          });
          
          await stripe.subscriptions.cancel(user.stripeSubscriptionId);
          
          // Update user record
          await storage.updateUserSubscriptionPlan(userId, "free");
          await db.update(users).set({
            stripeSubscriptionId: null,
            isPremium: false,
          }).where(eq(users.id, userId));
          
        } catch (stripeError) {
          console.error("Stripe cancellation error:", stripeError);
          return res.status(500).json({ message: "Failed to cancel Stripe subscription" });
        }
      }
      
      // For PayPal subscriptions (if implemented)
      if (user.paypalSubscriptionId) {
        try {
          // Implement PayPal cancellation logic
          // For now, just update the user record
          await storage.updateUserSubscriptionPlan(userId, "free");
          await db.update(users).set({
            paypalSubscriptionId: null,
            isPremium: false,
          }).where(eq(users.id, userId));
          
        } catch (paypalError) {
          console.error("PayPal cancellation error:", paypalError);
          return res.status(500).json({ message: "Failed to cancel PayPal subscription" });
        }
      }
      
      // Send email notification about subscription cancellation
      try {
        if (user.email) {
          // Implement email notification logic
        }
      } catch (emailError) {
        console.error("Failed to send cancellation email:", emailError);
        // Continue with cancellation even if email fails
      }
      
      res.status(200).json({ message: "Subscription cancelled successfully" });
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      res.status(500).json({ message: "Failed to cancel subscription" });
    }
  });
  
  // Account deletion route
  app.post("/api/account/delete", isAuthenticated, async (req, res) => {
    try {
      const userId = Number(req.user!.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Cancel any active subscriptions first
      if (user.stripeSubscriptionId) {
        try {
          const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: '2023-10-16',
          });
          
          await stripe.subscriptions.cancel(user.stripeSubscriptionId);
        } catch (stripeError) {
          console.error("Error cancelling Stripe subscription during account deletion:", stripeError);
          // Continue with account deletion even if subscription cancellation fails
        }
      }
      
      // Delete user data
      // This would typically involve multiple steps to delete related records
      
      // 1. Delete user's comments and comment votes
      await db.delete(commentVotes).where(eq(commentVotes.userId, userId));
      await db.delete(comments).where(eq(comments.authorId, userId));
      
      // 2. Delete user's post votes and posts
      await db.delete(postVotes).where(eq(postVotes.userId, userId));
      await db.delete(posts).where(eq(posts.authorId, userId));
      
      // 3. Remove user from community memberships
      await db.delete(communityMembers).where(eq(communityMembers.userId, userId));
      
      // 4. Finally delete the user account
      await db.delete(users).where(eq(users.id, userId));
      
      // Log the user out
      req.logout(() => {
        res.status(200).json({ message: "Account deleted successfully" });
      });
    } catch (error) {
      console.error("Error deleting account:", error);
      res.status(500).json({ message: "Failed to delete account" });
    }
  });
  
  // PayPal routes - temporarily disabled
  // app.get("/api/payments/paypal/setup", isAuthenticated, loadPaypalDefault);
  // app.post("/api/payments/paypal/order", isAuthenticated, createPaypalOrder);
  // app.post("/api/payments/paypal/order/:orderID/capture", isAuthenticated, capturePaypalOrder);
  
  // Payment status route
  app.get("/api/payments/status", isAuthenticated, async (req, res) => {
    try {
      const userId = Number(req.user!.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({
        paymentStatus: user.paymentStatus || "pending",
        isPremium: user.isPremium || false,
        isActive: user.isActive || false,
        hasStripeSubscription: !!user.stripeSubscriptionId,
        hasPaypalSubscription: !!user.paypalSubscriptionId
      });
    } catch (error) {
      console.error("Error fetching payment status:", error);
      res.status(500).json({ message: "Failed to fetch payment status" });
    }
  });

  // Password reset routes
  app.post("/api/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      // Create password reset token
      const token = await storage.createPasswordResetToken(email);
      
      if (!token) {
        // Don't reveal whether email exists for security
        return res.status(200).json({ message: "If an account with that email exists, a password reset link has been sent." });
      }
      
      // Send password reset email
      await sendPasswordResetEmail(email, token);
      
      return res.status(200).json({ message: "If an account with that email exists, a password reset link has been sent." });
    } catch (error) {
      console.error("Error in forgot password:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/reset-password", async (req, res) => {
    try {
      const { token, password } = req.body;
      
      if (!token || !password) {
        return res.status(400).json({ message: "Token and password are required" });
      }
      
      if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
      }
      
      // Reset password
      const success = await storage.resetPassword(token, password);
      
      if (!success) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
      
      return res.status(200).json({ message: "Password has been reset successfully" });
    } catch (error) {
      console.error("Error in reset password:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // User profile routes
  app.get("/api/profile", isAuthenticated, async (req, res) => {
    try {
      const userId = Number(req.user!.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Exclude sensitive information
      const { password, resetToken, resetTokenExpiry, ...profile } = user;
      
      res.json(profile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });
  
  app.patch("/api/profile", isAuthenticated, async (req, res) => {
    try {
      const userId = Number(req.user!.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Only allow updating specific profile fields
      const { displayName, bio, avatarUrl } = req.body;
      
      const [updatedUser] = await db.update(users)
        .set({
          displayName: displayName === "" ? null : displayName,
          bio: bio === "" ? null : bio,
          avatarUrl: avatarUrl === "" ? null : avatarUrl,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId))
        .returning();
      
      // Exclude sensitive information
      const { password, resetToken, resetTokenExpiry, ...profile } = updatedUser;
      
      res.json(profile);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update user profile" });
    }
  });
  
  // User account routes
  app.patch("/api/account", isAuthenticated, async (req, res) => {
    try {
      const userId = Number(req.user!.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { username, email, password, phone, directCommentsEnabled } = req.body;
      
      // Check if username is being changed and is unique
      if (username && username !== user.username) {
        const existingUser = await storage.getUserByUsername(username);
        if (existingUser && existingUser.id !== userId) {
          return res.status(400).json({ message: "Username already taken" });
        }
      }
      
      // Check if email is being changed and is unique
      if (email && email !== user.email) {
        const existingUser = await storage.getUserByEmail(email);
        if (existingUser && existingUser.id !== userId) {
          return res.status(400).json({ message: "Email already in use" });
        }
      }
      
      // Build update object
      const updateData: any = {
        username: username || user.username,
        email: email || user.email,
        updatedAt: new Date()
      };
      
      // Only include password if it's being changed
      if (password) {
        if (password.length < 8) {
          return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }
        updateData.password = await hashPassword(password);
      }
      
      // Only allow premium users to update phone and directCommentsEnabled
      if (user.isPremium) {
        if (phone !== undefined) {
          updateData.phone = phone === "" ? null : phone;
        }
        
        if (directCommentsEnabled !== undefined) {
          updateData.directCommentsEnabled = directCommentsEnabled;
        }
      }
      
      const [updatedUser] = await db.update(users)
        .set(updateData)
        .where(eq(users.id, userId))
        .returning();
      
      // Exclude sensitive information
      const { password: _, resetToken, resetTokenExpiry, ...account } = updatedUser;
      
      res.json(account);
    } catch (error) {
      console.error("Error updating user account:", error);
      res.status(500).json({ message: "Failed to update user account" });
    }
  });
  
  // User avatar upload route
  app.post("/api/uploads/avatar", isAuthenticated, async (req, res) => {
    // This is a placeholder for file upload functionality
    // In a real implementation, this would handle the file upload
    // and return a URL to the uploaded file
    
    // For now, just return a sample URL
    res.json({ url: "https://avatars.githubusercontent.com/u/1680273?v=4" });
  });

  // Test email endpoints - only for development
  if (process.env.NODE_ENV !== "production") {
    app.post("/api/test/email/payment-confirmation", isAuthenticated, async (req, res) => {
      try {
        const userId = Number(req.user!.id);
        const user = await storage.getUser(userId);
        
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        
        const result = await sendPaymentConfirmationEmail(user);
        res.json({ success: result });
      } catch (error) {
        console.error("Error sending test email:", error);
        res.status(500).json({ message: "Failed to send test email" });
      }
    });
    
    app.post("/api/test/email/welcome", isAuthenticated, async (req, res) => {
      try {
        const userId = Number(req.user!.id);
        const user = await storage.getUser(userId);
        
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        
        const result = await sendWelcomeEmail(user);
        res.json({ success: result });
      } catch (error) {
        console.error("Error sending test email:", error);
        res.status(500).json({ message: "Failed to send test email" });
      }
    });
  }

  // External project management platform integration
  // These routes allow premium users to access the external project management platform
  
  // Route to generate access tokens for the external application
  app.post("/api/external/token", isAuthenticated, generateAccessToken);
  
  // Route to verify tokens from the external application
  app.post("/api/external/verify", verifyAccessToken);
  
  // Route to generate single-use access links to the external application
  app.get("/api/external/access-link", isAuthenticated, generateAccessLink);
  
  // Route for the external application to register webhooks
  app.post("/api/external/webhooks", registerWebhook);
  
  // Documentation route for third-party developers
  app.get("/api/external/docs", (req, res) => {
    res.json({
      name: "FounderSocials External API",
      version: "1.0.0",
      description: "API for integrating with the FounderSocials platform",
      documentation: {
        authentication: {
          description: "JWT-based authentication for premium users",
          endpoints: [
            {
              path: "/api/external/token",
              method: "POST",
              description: "Generate an access token for the external application",
              requires: "Premium subscription (Standard or Founder plan)"
            },
            {
              path: "/api/external/verify",
              method: "POST",
              description: "Verify a token from the external application",
              authorization: "Bearer token in Authorization header"
            },
            {
              path: "/api/external/access-link",
              method: "GET",
              description: "Generate a single-use access link to the external application",
              requires: "Premium subscription (Standard or Founder plan)"
            }
          ]
        },
        webhooks: {
          path: "/api/external/webhooks",
          method: "POST",
          description: "Register a webhook to receive notifications about subscription changes",
          events: ["subscription.upgraded", "subscription.downgraded", "subscription.cancelled"]
        }
      }
    });
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
