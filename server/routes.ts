import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertCommunitySchema, 
  insertPostSchema, 
  insertCommentSchema,
  Community,
  commentStatusEnum,
  voteTypeEnum
} from "@shared/schema";
import { moderateComment, processCommentResponse } from "./openai";
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
  sendWelcomeEmail 
} from "./email";

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

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
