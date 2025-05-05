import { db } from "@db";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { Pool } from "@neondatabase/serverless";
import { 
  users, 
  communities, 
  communityMembers, 
  posts, 
  comments, 
  postVotes, 
  commentVotes,
  InsertUser,
  User,
  Community,
  InsertCommunity,
  InsertPost,
  Post,
  Comment,
  communityRoleEnum,
  voteTypeEnum,
  commentStatusEnum
} from "@shared/schema";
import { eq, and, or, desc, asc, gt, lt, sql, isNull, inArray } from "drizzle-orm";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods
  createUser(userData: InsertUser): Promise<User>;
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByStripeCustomerId(customerId: string): Promise<User | undefined>;
  upsertUser(userData: InsertUser): Promise<User>;
  updateUserPaymentStatus(userId: string, status: string): Promise<User>;
  updateUserPremiumStatus(userId: string, isPremium: boolean): Promise<User>;
  updateUserActiveStatus(userId: string, isActive: boolean): Promise<User>;
  updateUserSubscriptionPlan(userId: string, planType: 'standard' | 'founder'): Promise<User>;
  updateUserStripeInfo(userId: string, customerData: { customerId: string, subscriptionId?: string }): Promise<User>;
  updateUserPaypalInfo(userId: string, subscriptionId: string): Promise<User>;
  
  // Community methods
  createCommunity(communityData: InsertCommunity): Promise<Community>;
  getCommunity(id: number): Promise<Community | undefined>;
  getCommunityByName(name: string): Promise<Community | undefined>;
  getAllCommunities(): Promise<Community[]>;
  getTrendingCommunities(limit?: number): Promise<Community[]>;
  updateCommunityMemberCount(communityId: number, change: number): Promise<void>;
  searchCommunities(query: string): Promise<Community[]>;
  
  // Community membership methods
  addCommunityMember(memberData: { userId: number; communityId: number; role: string }): Promise<void>;
  removeCommunityMember(userId: number, communityId: number): Promise<void>;
  getCommunityMembership(userId: number, communityId: number): Promise<{ userId: number; communityId: number; role: string } | undefined>;
  getCommunityAdminCount(communityId: number): Promise<number>;
  getUserCommunities(userId: number): Promise<Community[]>;
  
  // Post methods
  createPost(postData: InsertPost): Promise<Post>;
  getPost(id: number): Promise<Post | undefined>;
  getAllPosts(sort: string, page: number, limit: number): Promise<Post[]>;
  getSubscribedPosts(userId: number, sort: string, page: number, limit: number): Promise<Post[]>;
  getCommunityPosts(communityId: number, sort: string, page: number, limit: number): Promise<Post[]>;
  getUserPosts(userId: number, page: number, limit: number): Promise<Post[]>;
  updatePostVoteCounts(postId: number): Promise<void>;
  incrementPostCommentCount(postId: number): Promise<void>;
  searchPosts(query: string): Promise<Post[]>;
  
  // Post votes methods
  createPostVote(userId: number, postId: number, voteType: "upvote" | "downvote"): Promise<void>;
  getPostVote(userId: number, postId: number): Promise<{ userId: number; postId: number; voteType: string } | undefined>;
  updatePostVote(userId: number, postId: number, voteType: "upvote" | "downvote"): Promise<void>;
  removePostVote(userId: number, postId: number): Promise<void>;
  
  // Comment methods
  createComment(commentData: any): Promise<Comment>;
  getComment(id: number): Promise<Comment | undefined>;
  getPostComments(postId: number, sort: string): Promise<Comment[]>;
  getUserComments(userId: number, page: number, limit: number): Promise<Comment[]>;
  updateComment(id: number, updates: Partial<Comment>): Promise<Comment>;
  updateCommentVoteCounts(commentId: number): Promise<void>;
  
  // Comment votes methods
  createCommentVote(userId: number, commentId: number, voteType: "upvote" | "downvote"): Promise<void>;
  getCommentVote(userId: number, commentId: number): Promise<{ userId: number; commentId: number; voteType: string } | undefined>;
  updateCommentVote(userId: number, commentId: number, voteType: "upvote" | "downvote"): Promise<void>;
  removeCommentVote(userId: number, commentId: number): Promise<void>;
  
  // User search
  searchUsers(query: string): Promise<Omit<User, "password">[]>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool: new Pool({ connectionString: process.env.DATABASE_URL }),
      createTableIfMissing: true
    });
  }
  
  // User methods
  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }
  
  async getUser(id: string): Promise<User | undefined> {
    return await db.query.users.findFirst({
      where: eq(users.id, id)
    });
  }
  
  async upsertUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return await db.query.users.findFirst({
      where: eq(users.username, username)
    });
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return await db.query.users.findFirst({
      where: eq(users.email, email)
    });
  }
  
  async getUserByStripeCustomerId(customerId: string): Promise<User | undefined> {
    return await db.query.users.findFirst({
      where: eq(users.stripeCustomerId, customerId)
    });
  }
  
  async updateUserPremiumStatus(userId: string, isPremium: boolean): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        isPremium,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }
  
  async updateUserActiveStatus(userId: string, isActive: boolean): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        isActive,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }
  
  async updateUserPaymentStatus(userId: string, status: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        paymentStatus: status,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }
  
  async updateUserStripeInfo(userId: string, customerData: { customerId: string, subscriptionId?: string }): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        stripeCustomerId: customerData.customerId,
        stripeSubscriptionId: customerData.subscriptionId,
        isPremium: true,
        isActive: true,
        paymentStatus: "completed",
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }
  
  async updateUserPaypalInfo(userId: string, subscriptionId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        paypalSubscriptionId: subscriptionId,
        isPremium: true,
        isActive: true,
        paymentStatus: "completed",
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }
  
  async updateUserSubscriptionPlan(userId: string, planType: 'standard' | 'founder'): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        subscriptionPlan: planType,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }
  
  // Community methods
  async createCommunity(communityData: InsertCommunity): Promise<Community> {
    const [community] = await db.insert(communities).values(communityData).returning();
    return community;
  }
  
  async getCommunity(id: number): Promise<Community | undefined> {
    return await db.query.communities.findFirst({
      where: eq(communities.id, id)
    });
  }
  
  async getCommunityByName(name: string): Promise<Community | undefined> {
    return await db.query.communities.findFirst({
      where: eq(communities.name, name)
    });
  }
  
  async getAllCommunities(): Promise<Community[]> {
    return await db.query.communities.findMany({
      orderBy: desc(communities.memberCount)
    });
  }
  
  async getTrendingCommunities(limit: number = 5): Promise<Community[]> {
    return await db.query.communities.findMany({
      orderBy: desc(communities.memberCount),
      limit
    });
  }
  
  async updateCommunityMemberCount(communityId: number, change: number): Promise<void> {
    await db.execute(sql`
      UPDATE ${communities}
      SET ${communities.memberCount} = ${communities.memberCount} + ${change}
      WHERE ${communities.id} = ${communityId}
    `);
  }
  
  async searchCommunities(query: string): Promise<Community[]> {
    return await db.query.communities.findMany({
      where: or(
        sql`${communities.name} ILIKE ${'%' + query + '%'}`,
        sql`${communities.displayName} ILIKE ${'%' + query + '%'}`,
        sql`${communities.description} ILIKE ${'%' + query + '%'}`
      ),
      limit: 20
    });
  }
  
  // Community membership methods
  async addCommunityMember(memberData: { userId: number; communityId: number; role: string }): Promise<void> {
    await db.insert(communityMembers).values({
      userId: memberData.userId,
      communityId: memberData.communityId,
      role: memberData.role as any
    });
  }
  
  async removeCommunityMember(userId: number, communityId: number): Promise<void> {
    await db.delete(communityMembers).where(
      and(
        eq(communityMembers.userId, userId),
        eq(communityMembers.communityId, communityId)
      )
    );
  }
  
  async getCommunityMembership(userId: number, communityId: number): Promise<{ userId: number; communityId: number; role: string } | undefined> {
    return await db.query.communityMembers.findFirst({
      where: and(
        eq(communityMembers.userId, userId),
        eq(communityMembers.communityId, communityId)
      )
    });
  }
  
  async getCommunityAdminCount(communityId: number): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(communityMembers)
      .where(
        and(
          eq(communityMembers.communityId, communityId),
          eq(communityMembers.role, "admin")
        )
      );
    
    return result[0].count;
  }
  
  async getUserCommunities(userId: number): Promise<Community[]> {
    const memberships = await db.query.communityMembers.findMany({
      where: eq(communityMembers.userId, userId),
      with: {
        community: true
      }
    });
    
    return memberships.map(membership => membership.community);
  }
  
  // Post methods
  async createPost(postData: InsertPost): Promise<Post> {
    const [post] = await db.insert(posts).values(postData).returning();
    return post;
  }
  
  async getPost(id: number): Promise<Post | undefined> {
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, id),
      with: {
        community: true
      }
    });
    
    if (!post) return undefined;
    
    const author = await db.query.users.findFirst({
      where: eq(users.id, post.authorId)
    });
    
    return {
      ...post,
      author
    };
  }
  
  async getAllPosts(sort: string, page: number, limit: number): Promise<Post[]> {
    const offset = (page - 1) * limit;
    
    let orderBy;
    switch (sort) {
      case "new":
        orderBy = desc(posts.createdAt);
        break;
      case "top":
        orderBy = desc(posts.upvotes);
        break;
      case "hot":
      default:
        // Score combining recency and votes
        orderBy = desc(sql`(${posts.upvotes} - ${posts.downvotes}) + (EXTRACT(EPOCH FROM ${posts.createdAt}) / 45000)`);
        break;
    }
    
    // First get the posts with their IDs
    const postsData = await db.query.posts.findMany({
      orderBy,
      limit,
      offset
    });
    
    // Then get the authors and communities separately
    const postsWithRelations = await Promise.all(
      postsData.map(async (post) => {
        const author = await db.query.users.findFirst({
          where: eq(users.id, post.authorId)
        });
        
        const community = await db.query.communities.findFirst({
          where: eq(communities.id, post.communityId)
        });
        
        return {
          ...post,
          author,
          community
        };
      })
    );
    
    return postsWithRelations;
  }
  
  async getSubscribedPosts(userId: string, sort: string, page: number, limit: number): Promise<Post[]> {
    const offset = (page - 1) * limit;
    
    // Get communities the user is part of
    const memberships = await db.query.communityMembers.findMany({
      where: eq(communityMembers.userId, userId),
      columns: {
        communityId: true
      }
    });
    
    const communityIds = memberships.map(m => m.communityId);
    
    if (communityIds.length === 0) {
      return [];
    }
    
    let orderBy;
    switch (sort) {
      case "new":
        orderBy = desc(posts.createdAt);
        break;
      case "top":
        orderBy = desc(posts.upvotes);
        break;
      case "hot":
      default:
        // Score combining recency and votes
        orderBy = desc(sql`(${posts.upvotes} - ${posts.downvotes}) + (EXTRACT(EPOCH FROM ${posts.createdAt}) / 45000)`);
        break;
    }
    
    // First get the posts with their IDs
    const postsData = await db.query.posts.findMany({
      where: inArray(posts.communityId, communityIds),
      orderBy,
      limit,
      offset,
      with: {
        community: true
      }
    });
    
    // Then get the authors separately
    const postsWithRelations = await Promise.all(
      postsData.map(async (post) => {
        const author = await db.query.users.findFirst({
          where: eq(users.id, post.authorId)
        });
        
        return {
          ...post,
          author
        };
      })
    );
    
    return postsWithRelations;
  }
  
  async getCommunityPosts(communityId: number, sort: string, page: number, limit: number): Promise<Post[]> {
    const offset = (page - 1) * limit;
    
    let orderBy;
    switch (sort) {
      case "new":
        orderBy = desc(posts.createdAt);
        break;
      case "top":
        orderBy = desc(posts.upvotes);
        break;
      case "hot":
      default:
        // Score combining recency and votes
        orderBy = desc(sql`(${posts.upvotes} - ${posts.downvotes}) + (EXTRACT(EPOCH FROM ${posts.createdAt}) / 45000)`);
        break;
    }
    
    // First get the posts with their IDs
    const postsData = await db.query.posts.findMany({
      where: eq(posts.communityId, communityId),
      orderBy,
      limit,
      offset,
      with: {
        community: true
      }
    });
    
    // Then get the authors separately
    const postsWithRelations = await Promise.all(
      postsData.map(async (post) => {
        const author = await db.query.users.findFirst({
          where: eq(users.id, post.authorId)
        });
        
        return {
          ...post,
          author
        };
      })
    );
    
    return postsWithRelations;
  }
  
  async getUserPosts(userId: string, page: number, limit: number): Promise<Post[]> {
    const offset = (page - 1) * limit;
    
    const postsData = await db.query.posts.findMany({
      where: eq(posts.authorId, userId),
      orderBy: desc(posts.createdAt),
      limit,
      offset,
      with: {
        community: true
      }
    });
    
    // Then get the authors separately
    const postsWithRelations = await Promise.all(
      postsData.map(async (post) => {
        const author = await db.query.users.findFirst({
          where: eq(users.id, post.authorId)
        });
        
        return {
          ...post,
          author
        };
      })
    );
    
    return postsWithRelations;
  }
  
  async updatePostVoteCounts(postId: number): Promise<void> {
    // Calculate upvotes
    const upvotesResult = await db.select({ count: sql<number>`count(*)` })
      .from(postVotes)
      .where(
        and(
          eq(postVotes.postId, postId),
          eq(postVotes.voteType, "upvote")
        )
      );
    
    // Calculate downvotes
    const downvotesResult = await db.select({ count: sql<number>`count(*)` })
      .from(postVotes)
      .where(
        and(
          eq(postVotes.postId, postId),
          eq(postVotes.voteType, "downvote")
        )
      );
    
    const upvotes = upvotesResult[0].count;
    const downvotes = downvotesResult[0].count;
    
    // Update post
    await db.update(posts)
      .set({
        upvotes,
        downvotes
      })
      .where(eq(posts.id, postId));
  }
  
  async incrementPostCommentCount(postId: number): Promise<void> {
    await db.update(posts)
      .set({
        commentCount: sql`${posts.commentCount} + 1`
      })
      .where(eq(posts.id, postId));
  }
  
  async searchPosts(query: string): Promise<Post[]> {
    // First get the posts with their IDs
    const postsData = await db.query.posts.findMany({
      where: or(
        sql`${posts.title} ILIKE ${'%' + query + '%'}`,
        sql`${posts.content} ILIKE ${'%' + query + '%'}`
      ),
      limit: 20,
      with: {
        community: true
      }
    });
    
    // Then get the authors separately
    const postsWithRelations = await Promise.all(
      postsData.map(async (post) => {
        const author = await db.query.users.findFirst({
          where: eq(users.id, post.authorId)
        });
        
        return {
          ...post,
          author
        };
      })
    );
    
    return postsWithRelations;
  }
  
  // Post votes methods
  async createPostVote(userId: number, postId: number, voteType: "upvote" | "downvote"): Promise<void> {
    await db.insert(postVotes).values({
      userId,
      postId,
      voteType: voteType as any
    });
  }
  
  async getPostVote(userId: number, postId: number): Promise<{ userId: number; postId: number; voteType: string } | undefined> {
    return await db.query.postVotes.findFirst({
      where: and(
        eq(postVotes.userId, userId),
        eq(postVotes.postId, postId)
      )
    });
  }
  
  async updatePostVote(userId: number, postId: number, voteType: "upvote" | "downvote"): Promise<void> {
    await db.update(postVotes)
      .set({ voteType: voteType as any })
      .where(
        and(
          eq(postVotes.userId, userId),
          eq(postVotes.postId, postId)
        )
      );
  }
  
  async removePostVote(userId: number, postId: number): Promise<void> {
    await db.delete(postVotes).where(
      and(
        eq(postVotes.userId, userId),
        eq(postVotes.postId, postId)
      )
    );
  }
  
  // Comment methods
  async createComment(commentData: any): Promise<Comment> {
    const [comment] = await db.insert(comments).values(commentData).returning();
    return comment;
  }
  
  async getComment(id: number): Promise<Comment | undefined> {
    const comment = await db.query.comments.findFirst({
      where: eq(comments.id, id)
    });
    
    if (!comment) return undefined;
    
    const author = await db.query.users.findFirst({
      where: eq(users.id, comment.authorId)
    });
    
    return {
      ...comment,
      author
    };
  }
  
  async getPostComments(postId: number, sort: string): Promise<Comment[]> {
    let orderBy;
    switch (sort) {
      case "new":
        orderBy = desc(comments.createdAt);
        break;
      case "old":
        orderBy = asc(comments.createdAt);
        break;
      case "top":
      default:
        orderBy = desc(comments.upvotes);
        break;
    }
    
    // Get top-level comments (no parent)
    const topLevelCommentsQuery = await db.query.comments.findMany({
      where: and(
        eq(comments.postId, postId),
        isNull(comments.parentId)
      ),
      orderBy,
      with: {
        replies: {
          orderBy: desc(comments.upvotes)
        }
      }
    });
    
    // Process top level comments and their replies
    const topLevelComments = await Promise.all(
      topLevelCommentsQuery.map(async (comment) => {
        // Get the author of the comment
        const author = await db.query.users.findFirst({
          where: eq(users.id, comment.authorId)
        });
        
        // Process each reply to add its author
        const replies = await Promise.all(
          (comment.replies || []).map(async (reply) => {
            const replyAuthor = await db.query.users.findFirst({
              where: eq(users.id, reply.authorId)
            });
            
            return {
              ...reply,
              author: replyAuthor
            };
          })
        );
        
        return {
          ...comment,
          author,
          replies
        };
      })
    );
    
    return topLevelComments;
  }
  
  async getUserComments(userId: number, page: number, limit: number): Promise<Comment[]> {
    const offset = (page - 1) * limit;
    
    return await db.query.comments.findMany({
      where: eq(comments.authorId, userId),
      orderBy: desc(comments.createdAt),
      limit,
      offset,
      with: {
        post: true
      }
    });
  }
  
  async updateComment(id: number, updates: Partial<Comment>): Promise<Comment> {
    const [updated] = await db.update(comments)
      .set(updates)
      .where(eq(comments.id, id))
      .returning();
    
    return updated;
  }
  
  async updateCommentVoteCounts(commentId: number): Promise<void> {
    // Calculate upvotes
    const upvotesResult = await db.select({ count: sql<number>`count(*)` })
      .from(commentVotes)
      .where(
        and(
          eq(commentVotes.commentId, commentId),
          eq(commentVotes.voteType, "upvote")
        )
      );
    
    // Calculate downvotes
    const downvotesResult = await db.select({ count: sql<number>`count(*)` })
      .from(commentVotes)
      .where(
        and(
          eq(commentVotes.commentId, commentId),
          eq(commentVotes.voteType, "downvote")
        )
      );
    
    const upvotes = upvotesResult[0].count;
    const downvotes = downvotesResult[0].count;
    
    // Update comment
    await db.update(comments)
      .set({
        upvotes,
        downvotes
      })
      .where(eq(comments.id, commentId));
  }
  
  // Comment votes methods
  async createCommentVote(userId: number, commentId: number, voteType: "upvote" | "downvote"): Promise<void> {
    await db.insert(commentVotes).values({
      userId,
      commentId,
      voteType: voteType as any
    });
  }
  
  async getCommentVote(userId: number, commentId: number): Promise<{ userId: number; commentId: number; voteType: string } | undefined> {
    return await db.query.commentVotes.findFirst({
      where: and(
        eq(commentVotes.userId, userId),
        eq(commentVotes.commentId, commentId)
      )
    });
  }
  
  async updateCommentVote(userId: number, commentId: number, voteType: "upvote" | "downvote"): Promise<void> {
    await db.update(commentVotes)
      .set({ voteType: voteType as any })
      .where(
        and(
          eq(commentVotes.userId, userId),
          eq(commentVotes.commentId, commentId)
        )
      );
  }
  
  async removeCommentVote(userId: number, commentId: number): Promise<void> {
    await db.delete(commentVotes).where(
      and(
        eq(commentVotes.userId, userId),
        eq(commentVotes.commentId, commentId)
      )
    );
  }
  
  // User search
  async searchUsers(query: string): Promise<Omit<User, "password">[]> {
    const userResults = await db.query.users.findMany({
      where: or(
        sql`${users.username} ILIKE ${'%' + query + '%'}`,
        sql`${users.firstName} ILIKE ${'%' + query + '%'}`,
        sql`${users.lastName} ILIKE ${'%' + query + '%'}`
      ),
      limit: 20
    });
    
    return userResults;
  }
}

export const storage = new DatabaseStorage();
