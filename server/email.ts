import { MailService } from '@sendgrid/mail';
import { User } from '@shared/schema';

const mailService = new MailService();

if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn('SENDGRID_API_KEY is not set. Email notifications will not be sent.');
}

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

// Base email sender function
export async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('Cannot send email: SENDGRID_API_KEY is not set');
    return false;
  }
  
  try {
    await mailService.send({
      to: params.to,
      from: params.from || 'support@foundersocials.com', // Use your domain email
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

// Payment confirmation email
export async function sendPaymentConfirmationEmail(user: User): Promise<boolean> {
  if (!user.email) {
    console.warn('Cannot send payment confirmation: User has no email');
    return false;
  }
  
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4f46e5;">Payment Confirmation</h1>
      <p>Hello ${user.displayName || user.username},</p>
      <p>Thank you for your payment. Your subscription to FounderSocials has been successfully activated.</p>
      <p>You now have access to all premium features including:</p>
      <ul>
        <li>Create private communities</li>
        <li>Enhanced profile customization</li>
        <li>Advanced analytics</li>
        <li>Priority customer support</li>
      </ul>
      <p>If you have any questions about your subscription, please contact our support team.</p>
      <p style="margin-top: 30px;">Best regards,<br>The FounderSocials Team</p>
    </div>
  `;
  
  return await sendEmail({
    to: user.email,
    from: 'support@foundersocials.com', // Use your domain email
    subject: 'FounderSocials Premium - Payment Confirmation',
    html,
  });
}

// Password reset email
export async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
  if (!email) {
    console.warn('Cannot send password reset email: No email provided');
    return false;
  }

  const resetUrl = `${process.env.NODE_ENV === 'production' ? 'https://' : 'http://'}${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000'}/reset-password?token=${token}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4f46e5;">Reset Your Password</h1>
      <p>You requested a password reset for your FounderSocials account.</p>
      <p>Please click the button below to set a new password. This link will expire in 1 hour.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
      </div>
      <p>If you did not request this password reset, please ignore this email or contact our support team if you have concerns.</p>
      <p style="margin-top: 30px;">Best regards,<br>The FounderSocials Team</p>
    </div>
  `;
  
  return await sendEmail({
    to: email,
    from: 'noreply@foundersocials.com',
    subject: 'FounderSocials - Password Reset Request',
    html,
  });
}

// Welcome email sent after registration
export async function sendWelcomeEmail(user: User): Promise<boolean> {
  if (!user.email) {
    console.warn('Cannot send welcome email: User has no email');
    return false;
  }
  
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4f46e5;">Welcome to FounderSocials!</h1>
      <p>Hello ${user.displayName || user.username},</p>
      <p>Thank you for joining FounderSocials. We're excited to have you as part of our community!</p>
      <p>Here are a few things you can do to get started:</p>
      <ul>
        <li>Complete your profile</li>
        <li>Join communities that interest you</li>
        <li>Create your first post</li>
        <li>Connect with other founders</li>
      </ul>
      <p>If you have any questions, please don't hesitate to reach out to our support team.</p>
      <p style="margin-top: 30px;">Best regards,<br>The FounderSocials Team</p>
    </div>
  `;
  
  return await sendEmail({
    to: user.email,
    from: 'welcome@foundersocials.com', // Use your domain email
    subject: 'Welcome to FounderSocials!',
    html,
  });
}

// Payment failed email
export async function sendPaymentFailedEmail(user: User): Promise<boolean> {
  if (!user.email) {
    console.warn('Cannot send payment failed email: User has no email');
    return false;
  }
  
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #ef4444;">Payment Failed</h1>
      <p>Hello ${user.displayName || user.username},</p>
      <p>We're sorry, but your recent payment attempt for FounderSocials Premium was unsuccessful.</p>
      <p>Please check your payment details and try again. If you continue to experience issues, please contact your payment provider or our support team for assistance.</p>
      <p>If you have any questions, please don't hesitate to reach out to us.</p>
      <p style="margin-top: 30px;">Best regards,<br>The FounderSocials Team</p>
    </div>
  `;
  
  return await sendEmail({
    to: user.email,
    from: 'billing@foundersocials.com', // Use your domain email
    subject: 'FounderSocials Premium - Payment Failed',
    html,
  });
}
