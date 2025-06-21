# FounderSocials - AI-Enhanced Social Platform for Entrepreneurs

## Overview

FounderSocials is a comprehensive social platform designed specifically for founders and entrepreneurs. The platform combines traditional social media features with AI-powered content moderation and engagement tools, premium subscription tiers, and multiple payment processing options. Built with a modern full-stack architecture using React, Express, and PostgreSQL, the application provides a seamless experience for community building and project collaboration.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite for development and production builds
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript throughout the stack
- **Authentication**: Passport.js with OpenID Connect (Replit Auth) and local strategy
- **Session Management**: Express-session with PostgreSQL store
- **Real-time Communication**: Socket.IO for live features
- **API Design**: RESTful endpoints with JSON responses

### Data Storage
- **Primary Database**: PostgreSQL with Neon serverless
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations
- **Session Storage**: PostgreSQL sessions table

## Key Components

### Authentication System
- **Multi-provider Support**: Replit Auth (OpenID Connect) and local username/password
- **Session Management**: Secure session storage with PostgreSQL
- **Password Security**: Scrypt-based password hashing
- **Password Reset**: Email-based reset flow with tokens

### AI Integration
- **Content Moderation**: OpenAI GPT-4o for comment analysis and approval
- **Smart Responses**: AI-generated follow-up questions for approved comments
- **Process Enhancement**: Comment quality improvement suggestions
- **Workflow Generation**: AI-powered project flow recommendations

### Payment Processing
- **Dual Processors**: Stripe and PayPal integration
- **Subscription Tiers**: Free, Standard (£3/month), and Founder (£7/month)
- **Smart Upgrade Logic**: Context-aware upgrade prompts based on current plan
- **Webhook Handling**: Secure payment status updates
- **Customer Management**: Automated subscription lifecycle management

### Community Features
- **Community Management**: Creation, joining, and moderation capabilities
- **Content Creation**: Rich post creation with image support
- **Engagement System**: Voting, commenting, and real-time interactions
- **Moderation Tools**: AI-assisted content moderation workflows

### Real-time Features
- **Live Comments**: Socket.IO-powered real-time comment updates
- **Notifications**: Instant updates for community activities
- **Status Updates**: Real-time payment and subscription status changes

## Data Flow

### User Registration and Authentication
1. User registers via form or OAuth provider
2. Credentials validated and stored securely
3. Session created and managed via PostgreSQL
4. User profile populated with default settings

### Content Creation and Moderation
1. User creates post or comment
2. Content processed through AI moderation pipeline
3. Approved content published with optional AI enhancements
4. Real-time notifications sent to relevant users
5. Community engagement tracked and stored

### Payment Processing
1. User selects subscription tier
2. Payment processor (Stripe/PayPal) handles transaction
3. Webhook confirms payment status
4. User account upgraded with premium features
5. Confirmation email sent via SendGrid

### Community Interaction
1. Users join communities based on interests
2. Posts and comments flow through moderation system
3. Real-time updates maintain engagement
4. Voting and saving features track user preferences

## External Dependencies

### Payment Services
- **Stripe**: Primary payment processor with subscription management
- **PayPal**: Alternative payment option for global accessibility

### AI Services
- **OpenAI**: GPT-4.1 model for content analysis and enhancement

### Email Services
- **SendGrid**: Transactional email delivery for notifications and confirmations

### Database and Infrastructure
- **Neon**: Serverless PostgreSQL hosting
- **Replit**: Development and deployment platform with integrated authentication

### Development Tools
- **Drizzle Kit**: Database schema management and migrations
- **Vite**: Development server and build optimization
- **TypeScript**: Type safety across the entire stack

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20 runtime
- **Database**: PostgreSQL 16 with automatic provisioning
- **Hot Reload**: Vite development server with HMR
- **Port Configuration**: Application runs on port 5000

### Production Build
- **Frontend Build**: Vite production build with asset optimization
- **Backend Build**: ESBuild compilation for Node.js deployment
- **Static Assets**: Served via Express static middleware
- **Environment Variables**: Secure configuration management

### Deployment Configuration
- **Target**: Replit Autoscale deployment
- **Build Command**: npm run build (frontend + backend compilation)
- **Start Command**: NODE_ENV=production node dist/index.js
- **Health Checks**: Automatic port detection and monitoring

### Database Management
- **Schema Deployment**: Drizzle push for schema updates
- **Data Seeding**: Automated seed script for initial data
- **Migrations**: Version-controlled schema changes
- **Backup Strategy**: Automated backups via Neon platform

## Changelog

```
Changelog:
- June 21, 2025. Fixed authentication-based navigation - settings and user-specific links now only visible to logged-in users
- June 21, 2025. Added desktop navigation links (Home, Explore, Guide) for authenticated users on large screens
- June 21, 2025. Updated "How It Works" page with simple AI feature examples for different user types (researchers, experts, newbies, founders)
- June 21, 2025. Implemented comprehensive search functionality across posts, communities, and users with tabbed results page
- June 21, 2025. Added search button beside search field for improved desktop UX and fixed Recent link sorting
- June 21, 2025. Fixed mobile hamburger menu with proper Upgrade and Logout links for authenticated users
- June 21, 2025. Updated subscription pricing to £3/month Standard and £7/month Founder with smart upgrade logic
- June 21, 2025. Implemented context-aware payment page - Standard users see only Founder upgrade, Founder users see no upgrades
- June 20, 2025. Implemented complete Facebook-style social platform features including modal-based post creation, community creation, notifications page, explore page, and enhanced profile functionality
- June 20, 2025. Fixed routing conflicts and navigation issues - added dedicated routes for /profile, /notifications, /explore, and /create-post 
- June 20, 2025. Created Facebook-style post creation modal that works directly from home page without routing conflicts - posts appear instantly in feed
- June 20, 2025. Upgraded OpenAI integration from GPT-4o to GPT-4.1 and enabled test premium user for AI feature testing
- June 20, 2025. Successfully implemented Facebook-style instant comment system with optimistic rendering, real-time Socket.IO updates, and seamless user experience
- June 20, 2025. Fixed user registration form feedback - improved loading states, error handling, and form reset after successful registration
- June 18, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```