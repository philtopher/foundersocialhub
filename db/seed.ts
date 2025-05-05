import { db } from "./index";
import * as schema from "@shared/schema";
import { eq, sql } from "drizzle-orm";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seed() {
  try {
    // Check if we already have users
    const userCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.users);
    
    if (userCount[0].count > 0) {
      console.log("Database already has users, skipping seed");
      return;
    }
    
    console.log("Seeding database with initial data...");
    
    // Create default users
    const users = [
      {
        username: "product_builder",
        email: "product@example.com",
        password: await hashPassword("password123"),
        displayName: "Product Builder",
        bio: "Building innovative products for founders",
        avatarUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=150&h=150&q=80"
      },
      {
        username: "startup_guide",
        email: "startup@example.com",
        password: await hashPassword("password123"),
        displayName: "Startup Guide",
        bio: "Helping startups grow and scale",
        avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80"
      },
      {
        username: "growth_hacker",
        email: "growth@example.com",
        password: await hashPassword("password123"),
        displayName: "Growth Hacker",
        bio: "Marketing expert for B2B SaaS",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80"
      },
      {
        username: "saas_metrics",
        email: "saas@example.com",
        password: await hashPassword("password123"),
        displayName: "SaaS Metrics",
        bio: "Data-driven growth for SaaS businesses",
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80"
      }
    ];
    
    const insertedUsers = await db.insert(schema.users).values(users).returning();
    console.log(`Created ${insertedUsers.length} users`);
    
    // Create communities
    const communities = [
      {
        name: "producthunt",
        displayName: "Product Hunt",
        description: "A community for discovering new products and discussing product development",
        iconUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=150&h=150&q=80",
        bannerUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&h=300&q=80",
        visibility: "public",
        creatorId: insertedUsers[0].id,
        memberCount: 124000
      },
      {
        name: "startups",
        displayName: "Startups",
        description: "A community for startup founders, employees, and enthusiasts",
        iconUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=150&h=150&q=80",
        bannerUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&h=300&q=80",
        visibility: "public",
        creatorId: insertedUsers[1].id,
        memberCount: 893000
      },
      {
        name: "SaaS",
        displayName: "SaaS",
        description: "Everything related to Software as a Service businesses",
        iconUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=150&h=150&q=80",
        bannerUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&h=300&q=80",
        visibility: "public",
        creatorId: insertedUsers[3].id,
        memberCount: 76200
      },
      {
        name: "entrepreneur",
        displayName: "Entrepreneur",
        description: "Discussions about entrepreneurship and building businesses",
        iconUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=150&h=150&q=80",
        bannerUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&h=300&q=80",
        visibility: "public",
        creatorId: insertedUsers[1].id,
        memberCount: 521000
      },
      {
        name: "marketing",
        displayName: "Marketing",
        description: "Marketing strategies and tactics for businesses",
        iconUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=150&h=150&q=80",
        bannerUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&h=300&q=80",
        visibility: "public",
        creatorId: insertedUsers[2].id,
        memberCount: 412000
      }
    ];
    
    const insertedCommunities = await db.insert(schema.communities).values(communities).returning();
    console.log(`Created ${insertedCommunities.length} communities`);
    
    // Add creators as community members with admin role
    const communityMemberships = insertedCommunities.map(community => ({
      userId: community.creatorId,
      communityId: community.id,
      role: "admin" as const
    }));
    
    // Also add some cross-memberships
    communityMemberships.push(
      {
        userId: insertedUsers[0].id,
        communityId: insertedCommunities[1].id,
        role: "member" as const
      },
      {
        userId: insertedUsers[0].id,
        communityId: insertedCommunities[2].id,
        role: "member" as const
      },
      {
        userId: insertedUsers[1].id,
        communityId: insertedCommunities[0].id,
        role: "member" as const
      },
      {
        userId: insertedUsers[2].id,
        communityId: insertedCommunities[0].id,
        role: "member" as const
      },
      {
        userId: insertedUsers[3].id,
        communityId: insertedCommunities[1].id,
        role: "member" as const
      }
    );
    
    await db.insert(schema.communityMembers).values(communityMemberships);
    console.log(`Created ${communityMemberships.length} community memberships`);
    
    // Create posts
    const posts = [
      {
        title: "I built a tool that helps founders create product roadmaps in minutes using AI",
        content: "After struggling with roadmap planning for my own startup, I created RoadmapAI. It uses GPT-4 to analyze your product and generate a strategic roadmap with features, timelines, and resource estimates. I've been using it to communicate better with my team and investors.",
        imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&h=600&q=80",
        authorId: insertedUsers[0].id,
        communityId: insertedCommunities[0].id, // producthunt
        upvotes: 248,
        downvotes: 0,
        commentCount: 42,
        slug: "i-built-a-tool-that-helps-founders-create-product-roadmaps-in-minutes-using-ai-" + Date.now()
      },
      {
        title: "My journey from $0 to $50k MRR in 6 months: Lessons for bootstrapped founders",
        content: "I want to share my experience building a SaaS in the productivity space. Key takeaways: 1) Start with a small, specific problem that people are willing to pay for, 2) Get to market quickly with a basic version, 3) Listen closely to early users and iterate rapidly, 4) Focus on a sustainable acquisition channel from day one, 5) Price based on value, not cost, 6) Build in public and share your journey to attract supporters.",
        authorId: insertedUsers[1].id,
        communityId: insertedCommunities[1].id, // startups
        upvotes: 1200,
        downvotes: 0,
        commentCount: 156,
        slug: "my-journey-from-0-to-50k-mrr-in-6-months-lessons-for-bootstrapped-founders-" + Date.now()
      },
      {
        title: "The 7 marketing channels that actually worked for my early-stage B2B SaaS",
        content: "Everyone says \"content marketing\" but it took us 9 months to see meaningful results. Here's what actually moved the needle quickly for us: 1) Targeted cold outreach to ideal customers, 2) Strategic partnerships with complementary tools, 3) Creating interactive tools that demonstrate our expertise, 4) Online communities where our audience already exists, 5) Paid acquisition once we understood our unit economics, 6) Leveraging our existing customers for referrals, 7) Speaking at industry events.",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&h=600&q=80",
        authorId: insertedUsers[2].id,
        communityId: insertedCommunities[4].id, // marketing
        upvotes: 437,
        downvotes: 0,
        commentCount: 89,
        slug: "the-7-marketing-channels-that-actually-worked-for-my-early-stage-b2b-saas-" + Date.now()
      },
      {
        title: "I analyzed 50+ SaaS pricing pages to find what actually works - here's what I learned",
        content: "I spent the last month analyzing pricing pages from top SaaS companies to find patterns that drive conversions. The key findings were surprising: 1) The most effective pricing pages have 3-4 tiers, with the middle option highlighted, 2) Annual discounts of 15-20% convert better than larger discounts, 3) Feature differentiation is more important than price differentiation, 4) Clear, benefit-focused feature descriptions outperform technical descriptions, 5) Including logos of well-known customers increases conversion by avg. 15%, 6) Showing the pricing upfront (vs. hiding behind contact sales) correlates with faster growth for companies below $10M ARR.",
        authorId: insertedUsers[3].id,
        communityId: insertedCommunities[2].id, // SaaS
        upvotes: 724,
        downvotes: 0,
        commentCount: 34,
        slug: "i-analyzed-50-saas-pricing-pages-to-find-what-actually-works-heres-what-i-learned-" + Date.now()
      }
    ];
    
    const insertedPosts = await db.insert(schema.posts).values(posts).returning();
    console.log(`Created ${insertedPosts.length} posts`);
    
    // Create some comments
    const comments = [
      {
        content: "This is really insightful! I've noticed that having a middle option that's slightly more expensive than you want people to pay, but with a few extra features, tends to drive people toward that plan.",
        authorId: insertedUsers[0].id,
        postId: insertedPosts[3].id, // SaaS pricing pages post
        status: "approved" as const,
        upvotes: 42,
        downvotes: 0
      },
      {
        content: "I'd like to add that our conversion rate increased by 23% when we simplified our pricing to just 3 tiers and added the annual discount.",
        authorId: insertedUsers[1].id,
        postId: insertedPosts[3].id, // SaaS pricing pages post
        status: "approved" as const,
        upvotes: 12,
        downvotes: 0
      },
      {
        content: "Would you mind sharing more details about your interactive tools strategy? What kind of tools did you create and how did you promote them?",
        authorId: insertedUsers[3].id,
        postId: insertedPosts[2].id, // marketing channels post
        status: "approved" as const,
        upvotes: 8,
        downvotes: 0
      },
      {
        content: "This is exactly what I needed! I've been struggling with roadmap planning for months. Just signed up for the beta.",
        authorId: insertedUsers[1].id,
        postId: insertedPosts[0].id, // roadmap AI post
        status: "approved" as const,
        upvotes: 15,
        downvotes: 0
      },
      {
        content: "Amazing journey! Would you mind sharing what your customer acquisition cost looked like at different stages?",
        authorId: insertedUsers[3].id,
        postId: insertedPosts[1].id, // 50K MRR journey post
        status: "approved" as const,
        upvotes: 20,
        downvotes: 0
      }
    ];
    
    await db.insert(schema.comments).values(comments);
    console.log(`Created ${comments.length} comments`);
    
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
