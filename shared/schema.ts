import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: text("sid").primaryKey(),
    sess: text("sess").notNull(),
    expire: timestamp("expire").notNull(),
  }
);

// Users
// Subscription plan types
export const subscriptionPlanEnum = pgEnum("subscription_plan", [
  "free",
  "standard",
  "founder",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey().notNull(),
  username: text("username").notNull().unique(),
  email: text("email").unique(),
  displayName: text("display_name"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  bio: text("bio"),
  location: text("location"),
  website: text("website"),
  company: text("company"),
  jobTitle: text("job_title"),
  avatarUrl: text("avatar_url"),
  profileImageUrl: text("profile_image_url"),
  coverImageUrl: text("cover_image_url"),
  phone: text("phone"),
  privacy: text("privacy").default("public"), // public, friends, private
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isPremium: boolean("is_premium").default(false),
  paymentStatus: text("payment_status").default("pending"), // pending, completed, failed
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  paypalSubscriptionId: text("paypal_subscription_id"),
  subscriptionPlan: subscriptionPlanEnum("subscription_plan").default("free"),
  isActive: boolean("is_active").default(false),
  directCommentsEnabled: boolean("direct_comments_enabled").default(false), // Skip AI workflow if true
  remainingPrompts: integer("remaining_prompts").default(3), // For non-founder users
  password: text("password"), // Existing password field in db
  resetToken: text("reset_token"),
  resetTokenExpiry: timestamp("reset_token_expiry"),
});


export const insertUserSchema = createInsertSchema(users, {
  username: (schema) => schema.min(3, "Username must be at least 3 characters"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Communities
export const communityVisibilityEnum = pgEnum("community_visibility", [
  "public",
  "restricted",
  "private",
]);

export const communities = pgTable("communities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  displayName: text("display_name").notNull(),
  description: text("description"),
  iconUrl: text("icon_url"),
  bannerUrl: text("banner_url"),
  visibility: communityVisibilityEnum("visibility").default("public").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  creatorId: integer("creator_id").references(() => users.id).notNull(),
  memberCount: integer("member_count").default(1).notNull(),
});

export const insertCommunitySchema = createInsertSchema(communities, {
  name: (schema) => schema.min(3, "Community name must be at least 3 characters").regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores are allowed"),
  displayName: (schema) => schema.min(3, "Display name must be at least 3 characters"),
  description: (schema) => schema.min(10, "Description must be at least 10 characters"),
});

export type InsertCommunity = z.infer<typeof insertCommunitySchema>;
export type Community = typeof communities.$inferSelect;

// Community Members
export const communityRoleEnum = pgEnum("community_role", [
  "member",
  "moderator",
  "admin",
]);

export const communityMembers = pgTable("community_members", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  communityId: integer("community_id").references(() => communities.id).notNull(),
  role: communityRoleEnum("role").default("member").notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

// Posts
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  authorId: integer("author_id").references(() => users.id).notNull(),
  communityId: integer("community_id").references(() => communities.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  upvotes: integer("upvotes").default(0).notNull(),
  downvotes: integer("downvotes").default(0).notNull(),
  commentCount: integer("comment_count").default(0).notNull(),
  slug: text("slug"),
});

export const insertPostSchema = createInsertSchema(posts, {
  title: (schema) => schema.min(5, "Title must be at least 5 characters"),
  content: (schema) => schema.min(10, "Content must be at least 10 characters"),
});

export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;

// Comments
export const commentStatusEnum = pgEnum("comment_status", [
  "pending",
  "approved",
  "rejected",
  "ai_processed",
]);

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  authorId: integer("author_id").references(() => users.id).notNull(),
  postId: integer("post_id").references(() => posts.id).notNull(),
  parentId: integer("parent_id").references(() => comments.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  upvotes: integer("upvotes").default(0).notNull(),
  downvotes: integer("downvotes").default(0).notNull(),
  replyCount: integer("reply_count").default(0).notNull(),
  status: commentStatusEnum("status").default("pending").notNull(),
  aiPrompt: text("ai_prompt"),
  aiResponse: text("ai_response"),
  // Advanced AI workflow fields
  hasCollaborationEnvironment: boolean("has_collaboration_environment").default(false),
  collaborationEnvironmentId: integer("collaboration_environment_id"),
  processFlowsGenerated: boolean("process_flows_generated").default(false),
  selectedProcessFlowId: integer("selected_process_flow_id"),
});

export const insertCommentSchema = createInsertSchema(comments, {
  content: (schema) => schema.min(1, "Comment cannot be empty"),
});

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;

// Votes
export const voteTypeEnum = pgEnum("vote_type", ["upvote", "downvote"]);

export const postVotes = pgTable("post_votes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  postId: integer("post_id").references(() => posts.id).notNull(),
  voteType: voteTypeEnum("vote_type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const commentVotes = pgTable("comment_votes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  commentId: integer("comment_id").references(() => comments.id).notNull(),
  voteType: voteTypeEnum("vote_type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
  communityMemberships: many(communityMembers),
  ownedCommunities: many(communities, { relationName: "communityCreator" }),
}));

export const communitiesRelations = relations(communities, ({ one, many }) => ({
  creator: one(users, {
    fields: [communities.creatorId],
    references: [users.id],
    relationName: "communityCreator",
  }),
  members: many(communityMembers),
  posts: many(posts),
}));

export const communityMembersRelations = relations(communityMembers, ({ one }) => ({
  user: one(users, {
    fields: [communityMembers.userId],
    references: [users.id],
  }),
  community: one(communities, {
    fields: [communityMembers.communityId],
    references: [communities.id],
  }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  community: one(communities, {
    fields: [posts.communityId],
    references: [communities.id],
  }),
  comments: many(comments),
  votes: many(postVotes),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: "parentChildComments",
  }),
  replies: many(comments, { relationName: "parentChildComments" }),
  votes: many(commentVotes),
  // Collaboration environment relation
  collaborationEnvironment: one(collaborationEnvironments, {
    fields: [comments.collaborationEnvironmentId],
    references: [collaborationEnvironments.id],
  }),
}));

export const postVotesRelations = relations(postVotes, ({ one }) => ({
  user: one(users, {
    fields: [postVotes.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [postVotes.postId],
    references: [posts.id],
  }),
}));

export const commentVotesRelations = relations(commentVotes, ({ one }) => ({
  user: one(users, {
    fields: [commentVotes.userId],
    references: [users.id],
  }),
  comment: one(comments, {
    fields: [commentVotes.commentId],
    references: [comments.id],
  }),
}));

// Advanced AI Workflow

// ProcessFlow status types
export const processFlowStatusEnum = pgEnum("process_flow_status", [
  "draft",
  "active",
  "completed",
  "archived",
]);

// Collaboration environment
export const collaborationEnvironments = pgTable("collaboration_environments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => posts.id).notNull(),
  commentId: integer("comment_id").references(() => comments.id).notNull(),
  creatorId: integer("creator_id").references(() => users.id).notNull(),
  postAuthorId: integer("post_author_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(), // Auto-expires after 3 days
  isPermanent: boolean("is_permanent").default(false), // For founder users who want to keep it
});

// Process flows generated by AI
export const processFlows = pgTable("process_flows", {
  id: serial("id").primaryKey(),
  environmentId: integer("environment_id").references(() => collaborationEnvironments.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(), // JSON stringified process flow
  status: processFlowStatusEnum("status").default("draft").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  selectedAt: timestamp("selected_at"),
});

// Collaboration messages in the environment
export const collaborationMessages = pgTable("collaboration_messages", {
  id: serial("id").primaryKey(),
  environmentId: integer("environment_id").references(() => collaborationEnvironments.id).notNull(),
  authorId: integer("author_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isAiGenerated: boolean("is_ai_generated").default(false),
  processFlowId: integer("process_flow_id").references(() => processFlows.id),
});

// Define relation types
export type CollaborationEnvironment = typeof collaborationEnvironments.$inferSelect;
export type InsertCollaborationEnvironment = typeof collaborationEnvironments.$inferInsert;

export type ProcessFlow = typeof processFlows.$inferSelect;
export type InsertProcessFlow = typeof processFlows.$inferInsert;

export type CollaborationMessage = typeof collaborationMessages.$inferSelect;
export type InsertCollaborationMessage = typeof collaborationMessages.$inferInsert;

// Relations
export const collaborationEnvironmentsRelations = relations(collaborationEnvironments, ({ one, many }) => ({
  post: one(posts, {
    fields: [collaborationEnvironments.postId],
    references: [posts.id],
  }),
  comment: one(comments, {
    fields: [collaborationEnvironments.commentId],
    references: [comments.id],
  }),
  creator: one(users, {
    fields: [collaborationEnvironments.creatorId],
    references: [users.id],
  }),
  postAuthor: one(users, {
    fields: [collaborationEnvironments.postAuthorId],
    references: [users.id],
  }),
  processFlows: many(processFlows),
  messages: many(collaborationMessages),
}));

export const processFlowsRelations = relations(processFlows, ({ one, many }) => ({
  environment: one(collaborationEnvironments, {
    fields: [processFlows.environmentId],
    references: [collaborationEnvironments.id],
  }),
  messages: many(collaborationMessages),
}));

export const collaborationMessagesRelations = relations(collaborationMessages, ({ one }) => ({
  environment: one(collaborationEnvironments, {
    fields: [collaborationMessages.environmentId],
    references: [collaborationEnvironments.id],
  }),
  author: one(users, {
    fields: [collaborationMessages.authorId],
    references: [users.id],
  }),
  processFlow: one(processFlows, {
    fields: [collaborationMessages.processFlowId],
    references: [processFlows.id],
  }),
}));
