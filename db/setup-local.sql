-- Create tables for FounderSocials platform
CREATE TABLE IF NOT EXISTS sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions (expire);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR UNIQUE,
  email VARCHAR UNIQUE,
  password TEXT,
  display_name VARCHAR,
  bio TEXT,
  avatar_url VARCHAR,
  phone VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_premium BOOLEAN DEFAULT FALSE,
  payment_status VARCHAR DEFAULT 'pending',
  stripe_customer_id VARCHAR,
  stripe_subscription_id VARCHAR,
  paypal_subscription_id VARCHAR,
  subscription_plan VARCHAR DEFAULT 'free',
  is_active BOOLEAN DEFAULT TRUE,
  direct_comments_enabled BOOLEAN DEFAULT FALSE,
  remaining_prompts INTEGER DEFAULT 3,
  reset_token VARCHAR,
  reset_token_expiry TIMESTAMP
);

CREATE TABLE IF NOT EXISTS communities (
  id SERIAL PRIMARY KEY,
  name VARCHAR UNIQUE NOT NULL,
  display_name VARCHAR NOT NULL,
  description TEXT,
  visibility VARCHAR DEFAULT 'public',
  creator_id INTEGER REFERENCES users(id),
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS community_members (
  user_id INTEGER REFERENCES users(id),
  community_id INTEGER REFERENCES communities(id),
  role VARCHAR DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, community_id)
);

CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  image_url VARCHAR,
  author_id INTEGER REFERENCES users(id),
  community_id INTEGER REFERENCES communities(id),
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  slug VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS post_votes (
  user_id INTEGER REFERENCES users(id),
  post_id INTEGER REFERENCES posts(id),
  vote_type VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);

CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  author_id INTEGER REFERENCES users(id),
  post_id INTEGER REFERENCES posts(id),
  parent_id INTEGER REFERENCES comments(id),
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  status VARCHAR DEFAULT 'approved',
  ai_prompt TEXT,
  ai_response TEXT,
  has_collaboration_environment BOOLEAN DEFAULT FALSE,
  collaboration_environment_id VARCHAR,
  process_flows_generated BOOLEAN DEFAULT FALSE,
  selected_process_flow_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comment_votes (
  user_id INTEGER REFERENCES users(id),
  comment_id INTEGER REFERENCES comments(id),
  vote_type VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, comment_id)
);

-- Insert seed data
INSERT INTO users (id, username, email, password, display_name, subscription_plan, is_premium, remaining_prompts, is_active) 
VALUES 
  (11, 'stanley1', 'stanley1@test.com', 'hashed_password', 'Stanley', 'standard', TRUE, 100, TRUE),
  (5, 'freeway', 'tufort-teams@yahoo.com', 'hashed_password', 'Freeway', 'free', FALSE, 3, TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO communities (id, name, display_name, description, creator_id, member_count)
VALUES 
  (2, 'startups', 'Startups', 'A community for startup founders and entrepreneurs', 11, 50)
ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (id, title, content, author_id, community_id, upvotes, comment_count, slug)
VALUES 
  (2, 'My journey from $0 to $50k MRR', 'Here is my story of building a successful SaaS business...', 11, 2, 15, 8, 'my-journey-from-0-to-50k-mrr'),
  (5, 'How to find cofounders', 'Looking for advice on finding the right cofounders for my startup...', 5, 2, 5, 2, 'how-to-find-cofounders')
ON CONFLICT (id) DO NOTHING;

-- Reset sequences
SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1));
SELECT setval('communities_id_seq', COALESCE((SELECT MAX(id) FROM communities), 1));
SELECT setval('posts_id_seq', COALESCE((SELECT MAX(id) FROM posts), 1));