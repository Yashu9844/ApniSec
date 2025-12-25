import { Resend } from 'resend';

export class EmailUtil {
  private static resend = new Resend(process.env.RESEND_API_KEY);

  static async sendWelcomeEmail(to: string, name: string): Promise<void> {
    try {
      await this.resend.emails.send({
        from: 'onboarding@resend.dev',
        to,
        subject: 'Welcome to ApniSec!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; padding: 40px; border-radius: 16px;">
            <h1 style="color: #00ff88; margin-bottom: 20px;">Welcome to ApniSec, ${name}! 🛡️</h1>
            <p style="color: #f0f0f0; font-size: 16px; line-height: 1.6;">Thank you for registering with ApniSec. We're excited to have you on board.</p>
            <p style="color: #888; font-size: 14px; margin-top: 30px;">Your security is our priority.</p>
          </div>
        `
      });
      console.log(`Welcome email sent to ${to}`);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }
  }

  static async sendPasswordResetEmail(to: string, name: string, resetToken: string): Promise<void> {
    try {
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
      
      await this.resend.emails.send({
        from: 'onboarding@resend.dev',
        to,
        subject: 'Reset Your ApniSec Password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; padding: 40px; border-radius: 16px;">
            <h1 style="color: #00ff88; margin-bottom: 20px;">Password Reset Request 🔐</h1>
            <p style="color: #f0f0f0; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
            <p style="color: #f0f0f0; font-size: 16px; line-height: 1.6;">We received a request to reset your password. Click the button below to set a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: linear-gradient(135deg, #00ff88, #00d4ff); color: #000; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
            </div>
            <p style="color: #888; font-size: 14px;">This link will expire in 1 hour.</p>
            <p style="color: #888; font-size: 14px;">If you didn't request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;" />
            <p style="color: #666; font-size: 12px;">ApniSec Security Platform</p>
          </div>
        `
      });
      console.log(`Password reset email sent to ${to}`);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  static async testEmailConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const result = await this.resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'delivered@resend.dev', // Resend's test email
        subject: 'ApniSec Email Test',
        html: '<p>This is a test email from ApniSec.</p>'
      });
      
      return { 
        success: true, 
        message: `Email sent successfully. ID: ${result.data?.id || 'unknown'}` 
      };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || 'Failed to send test email' 
      };
    }
  }
}
