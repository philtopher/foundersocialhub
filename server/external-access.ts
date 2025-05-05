import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { storage } from './storage';
import crypto from 'crypto';
import { z } from 'zod';

// This would be stored securely in environment variables
if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET environment variable not set. Using insecure default for development.');
}

const JWT_SECRET = process.env.JWT_SECRET || 'development_secret_do_not_use_in_production';
const JWT_EXPIRY = '1h'; // Token expires after 1 hour

// Define the schema for validating webhook subscription requests
const webhookSubscriptionSchema = z.object({
  callbackUrl: z.string().url('Callback URL must be a valid URL'),
  events: z.array(z.enum(['subscription.upgraded', 'subscription.downgraded', 'subscription.cancelled'])),
  secret: z.string().min(16, 'Webhook secret must be at least 16 characters'),
});

type WebhookSubscription = z.infer<typeof webhookSubscriptionSchema>;

// In-memory store for webhook subscriptions (would be in database in production)
let webhookSubscriptions: WebhookSubscription[] = [];

/**
 * Generate a secure access token for premium users to access external services
 */
export async function generateAccessToken(req: Request, res: Response) {
  try {
    // Ensure the user is authenticated
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = Number(req.user.id);
    const user = await storage.getUser(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has a premium subscription that grants external access
    if (user.subscriptionPlan !== 'standard' && user.subscriptionPlan !== 'founder') {
      return res.status(403).json({
        message: 'Access denied. Premium subscription required for external service access',
      });
    }

    // Generate a JWT token with necessary user info
    const token = jwt.sign(
      {
        sub: user.id.toString(),
        username: user.username,
        email: user.email,
        plan: user.subscriptionPlan,
        // Do not include sensitive information in the token
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRY,
        audience: 'project-management-platform', // The intended recipient
        issuer: 'foundersocials-platform', // This platform
      }
    );

    // Log token generation for audit purposes
    console.log(`Access token generated for user ${user.id} (${user.username})`);

    // Return the token
    return res.status(200).json({
      accessToken: token,
      expiresIn: 3600, // 1 hour in seconds
      tokenType: 'Bearer',
    });
  } catch (error) {
    console.error('Error generating access token:', error);
    return res.status(500).json({ message: 'Failed to generate access token' });
  }
}

/**
 * Verify a token provided by the external application
 */
export async function verifyAccessToken(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization header missing or invalid' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    
    // Get the latest user data to check current subscription status
    const userId = Number(decoded.sub);
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user still has a valid premium subscription
    if (user.subscriptionPlan !== 'standard' && user.subscriptionPlan !== 'founder') {
      return res.status(403).json({
        message: 'Access denied. User no longer has an active premium subscription',
        code: 'subscription_ended'
      });
    }
    
    // Return user information for the external service
    return res.status(200).json({
      userId: user.id,
      username: user.username,
      email: user.email,
      plan: user.subscriptionPlan,
      isValid: true
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token', code: 'invalid_token' });
    } else if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired', code: 'token_expired' });
    }
    
    console.error('Error verifying access token:', error);
    return res.status(500).json({ message: 'Failed to verify access token' });
  }
}

/**
 * Register a webhook subscription from the external application
 */
export async function registerWebhook(req: Request, res: Response) {
  try {
    // Validate the request
    const validatedData = webhookSubscriptionSchema.parse(req.body);
    
    // In production, you would store this in the database
    webhookSubscriptions.push(validatedData);
    
    return res.status(201).json({
      message: 'Webhook subscription registered successfully',
      subscriptionId: crypto.randomUUID(), // Would come from DB in production
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    
    console.error('Error registering webhook:', error);
    return res.status(500).json({ message: 'Failed to register webhook' });
  }
}

/**
 * Trigger webhooks when a user's subscription status changes
 * This would be called from your subscription management code
 */
export async function notifySubscriptionChange(userId: number, event: 'subscription.upgraded' | 'subscription.downgraded' | 'subscription.cancelled') {
  try {
    const user = await storage.getUser(userId);
    
    if (!user) {
      console.error(`Cannot notify subscription change: User ${userId} not found`);
      return;
    }
    
    // For each registered webhook interested in this event
    const relevantWebhooks = webhookSubscriptions.filter(sub => sub.events.includes(event));
    
    for (const webhook of relevantWebhooks) {
      try {
        // Prepare the webhook payload
        const payload = {
          event,
          userId: user.id,
          username: user.username,
          plan: user.subscriptionPlan,
          timestamp: new Date().toISOString(),
        };
        
        // Create a signature for the webhook
        const signature = crypto
          .createHmac('sha256', webhook.secret)
          .update(JSON.stringify(payload))
          .digest('hex');
        
        // Send the webhook notification (would use a proper HTTP client in production)
        const response = await fetch(webhook.callbackUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': signature,
          },
          body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
          console.error(`Failed to deliver webhook to ${webhook.callbackUrl}: ${response.status}`);
        }
      } catch (webhookError) {
        console.error(`Error delivering webhook to ${webhook.callbackUrl}:`, webhookError);
        // In production, you might implement a retry mechanism
      }
    }
  } catch (error) {
    console.error('Error notifying subscription change:', error);
  }
}

/**
 * Generate a single-use link for accessing the external application
 */
export async function generateAccessLink(req: Request, res: Response) {
  try {
    // Ensure the user is authenticated
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const userId = Number(req.user.id);
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user has a premium subscription
    if (user.subscriptionPlan !== 'standard' && user.subscriptionPlan !== 'founder') {
      return res.status(403).json({
        message: 'Access denied. Premium subscription required for external service access',
      });
    }
    
    // Generate a short-lived token for the access link
    const token = jwt.sign(
      { sub: user.id.toString(), purpose: 'single-access' },
      JWT_SECRET,
      { expiresIn: '15m' } // Token expires in 15 minutes
    );
    
    // In production, you would use the actual URL of your external application
    const externalAppUrl = process.env.PROJECT_MANAGEMENT_APP_URL || 'https://project-management-app.example.com';
    const accessLink = `${externalAppUrl}/sso?token=${token}`;
    
    return res.status(200).json({
      accessLink,
      expiresIn: 900, // 15 minutes in seconds
    });
  } catch (error) {
    console.error('Error generating access link:', error);
    return res.status(500).json({ message: 'Failed to generate access link' });
  }
}
