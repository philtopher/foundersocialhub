import Stripe from "stripe";
import { storage } from "./storage";
import type { Request, Response } from "express";
import {
  Client,
  Environment,
  LogLevel,
  OAuthAuthorizationController,
  OrdersController,
} from "@paypal/paypal-server-sdk";

// Stripe setup
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY is not set. Stripe payments will not work.');
}

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    })
  : null;

// PayPal setup
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

let paypalClient: Client | null = null;
let ordersController: OrdersController | null = null;
let oAuthAuthorizationController: OAuthAuthorizationController | null = null;

if (PAYPAL_CLIENT_ID && PAYPAL_CLIENT_SECRET) {
  paypalClient = new Client({
    clientCredentialsAuthCredentials: {
      oAuthClientId: PAYPAL_CLIENT_ID,
      oAuthClientSecret: PAYPAL_CLIENT_SECRET,
    },
    timeout: 0,
    environment:
      process.env.NODE_ENV === "production"
        ? Environment.Production
        : Environment.Sandbox,
    logging: {
      logLevel: LogLevel.Info,
      logRequest: {
        logBody: true,
      },
      logResponse: {
        logHeaders: true,
      },
    },
  });
  
  ordersController = new OrdersController(paypalClient);
  oAuthAuthorizationController = new OAuthAuthorizationController(paypalClient);
} else {
  console.warn('PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET not set. PayPal payments will not work.');
}

// Stripe payment functions
export async function createStripeCustomer(userId: string, email: string, name?: string) {
  if (!stripe) throw new Error("Stripe is not configured");
  
  try {
    const customer = await stripe.customers.create({
      email,
      name,
    });
    
    await storage.updateUserStripeInfo(userId, { customerId: customer.id });
    
    return customer;
  } catch (error) {
    console.error("Error creating Stripe customer:", error);
    throw error;
  }
}

export async function createStripeSubscription(req: Request, res: Response) {
  if (!stripe) return res.status(500).json({ error: "Stripe is not configured" });
  
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const userId = req.user.id;
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    let customerId = user.stripeCustomerId;
    
    if (!customerId) {
      if (!user.email) {
        return res.status(400).json({ error: "User email is required" });
      }
      
      const customer = await createStripeCustomer(userId, user.email, user.displayName || undefined);
      customerId = customer.id;
    }
    
    // Use req.body.priceId or default price ID
    const priceId = req.body.priceId || process.env.STRIPE_PRICE_ID;
    
    if (!priceId) {
      return res.status(400).json({ error: "Price ID is required" });
    }
    
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });
    
    await storage.updateUserStripeInfo(userId, { 
      customerId, 
      subscriptionId: subscription.id 
    });
    
    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;
    
    return res.json({
      subscriptionId: subscription.id,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error("Error creating subscription:", error);
    return res.status(500).json({ 
      error: "Failed to create subscription",
      details: error.message 
    });
  }
}

export async function handleStripeWebhook(req: Request, res: Response) {
  if (!stripe) return res.status(500).json({ error: "Stripe is not configured" });
  
  const sig = req.headers['stripe-signature'];
  
  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(400).json({ error: 'Webhook signature required' });
  }
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Update payment status to completed
      // Find user by customer ID and update
      console.log('Payment succeeded:', paymentIntent.id);
      break;
      
    case 'subscription.created':
      const subscription = event.data.object;
      console.log('Subscription created:', subscription.id);
      break;
      
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const updatedSubscription = event.data.object;
      // Handle subscription status changes
      console.log(`Subscription ${event.type}:`, updatedSubscription.id);
      
      // If subscription is active, update user status
      if (updatedSubscription.status === 'active') {
        // Find user by customer ID and update
        // We would normally do a lookup to find the user with this customer ID
        // and update their subscription status
      }
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  
  // Return a 200 response to acknowledge receipt of the event
  res.send({ received: true });
}

// PayPal payment functions
export async function getPaypalClientToken() {
  if (!paypalClient || !oAuthAuthorizationController) {
    throw new Error("PayPal is not configured");
  }
  
  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`,
  ).toString("base64");

  const { result } = await oAuthAuthorizationController.requestToken(
    {
      authorization: `Basic ${auth}`,
    },
    { intent: "sdk_init", response_type: "client_token" },
  );

  return result.accessToken;
}

export async function createPaypalOrder(req: Request, res: Response) {
  if (!paypalClient || !ordersController) {
    return res.status(500).json({ error: "PayPal is not configured" });
  }
  
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const { amount, currency = "USD" } = req.body;

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res
        .status(400)
        .json({
          error: "Invalid amount. Amount must be a positive number.",
        });
    }

    const collect = {
      body: {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: amount,
            },
          },
        ],
        application_context: {
          return_url: `${req.protocol}://${req.get('host')}/payment-success`,
          cancel_url: `${req.protocol}://${req.get('host')}/payment-cancel`,
        },
      },
      prefer: "return=minimal",
    };

    const { body, ...httpResponse } = await ordersController.createOrder(collect);

    const jsonResponse = JSON.parse(String(body));
    const httpStatusCode = httpResponse.statusCode;

    // Store the order ID with the user for reference
    const userId = req.user.id;
    await storage.updateUserPaymentStatus(userId, "pending");

    res.status(httpStatusCode).json(jsonResponse);
  } catch (error: any) {
    console.error("Failed to create PayPal order:", error);
    res.status(500).json({ error: "Failed to create order.", details: error.message });
  }
}

export async function capturePaypalOrder(req: Request, res: Response) {
  if (!paypalClient || !ordersController) {
    return res.status(500).json({ error: "PayPal is not configured" });
  }
  
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const { orderID } = req.params;
    const collect = {
      id: orderID,
      prefer: "return=minimal",
    };

    const { body, ...httpResponse } = await ordersController.captureOrder(collect);

    const jsonResponse = JSON.parse(String(body));
    const httpStatusCode = httpResponse.statusCode;

    // If capture was successful, update user payment status
    if (httpStatusCode === 201 || httpStatusCode === 200) {
      const userId = req.user.id;
      await storage.updateUserPaypalInfo(userId, orderID);
    }

    res.status(httpStatusCode).json(jsonResponse);
  } catch (error: any) {
    console.error("Failed to capture PayPal order:", error);
    res.status(500).json({ error: "Failed to capture order.", details: error.message });
  }
}

export async function loadPaypalDefault(req: Request, res: Response) {
  if (!paypalClient || !oAuthAuthorizationController) {
    return res.status(500).json({ error: "PayPal is not configured" });
  }
  
  try {
    const clientToken = await getPaypalClientToken();
    res.json({
      clientToken,
    });
  } catch (error: any) {
    console.error("Failed to load PayPal default:", error);
    res.status(500).json({ error: "Failed to initialize PayPal.", details: error.message });
  }
}
