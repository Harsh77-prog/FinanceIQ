require("dotenv").config();
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

// Initialize MailerSend
const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

const emailService = {
  sendVerificationEmail: async (email, token, userName) => {
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    console.log("Sending verification email to:", email);

    // 1. Define the Sender (Required by the SDK)
    const sentFrom = new Sender(process.env.EMAIL_FROM, "FinanceIQ");

    // 2. Define the Recipient as an Array
    const recipients = [new Recipient(email, userName)];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject("📧 Verify Your FinanceIQ Email")
      .setHtml(`
        <div style="font-family:sans-serif;padding:20px;border:1px solid #eee;border-radius:10px;">
          <h2>Welcome ${userName}!</h2>
          <p>Click below to verify your email. Link expires in 24 hours.</p>
          <a href="${verificationLink}" 
             style="background:#3b82f6;color:white;padding:12px 24px;
             text-decoration:none;border-radius:5px;display:inline-block;font-weight:bold;">
             Verify Email
          </a>
          <p style="margin-top:20px;font-size:12px;color:#666;">
            Or copy this link:<br/>
            ${verificationLink}
          </p>
        </div>
      `);

    try {
      // FIX: Use .email.send() instead of .send()
      const response = await mailerSend.email.send(emailParams);
      console.log("✅ Verification email sent");
      return true;
    } catch (error) {
      // Improved error logging to see what MailerSend is complaining about
      console.error("❌ Email Error:", error.body ? error.body : error);
      return false;
    }
  },

  sendPasswordResetEmail: async (email, token, userName) => {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    const sentFrom = new Sender(process.env.EMAIL_FROM, "FinanceIQ");
    const recipients = [new Recipient(email, userName)];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject("🔐 Reset Your FinanceIQ Password")
      .setHtml(`
        <div style="font-family:sans-serif;padding:20px;border:1px solid #eee;border-radius:10px;">
          <h2>Password Reset Request</h2>
          <p>Hi ${userName}, click below to reset your password:</p>
          <a href="${resetLink}" 
             style="background:#3b82f6;color:white;padding:12px 24px;
             text-decoration:none;border-radius:5px;display:inline-block;font-weight:bold;">
             Reset Password
          </a>
          <p style="margin-top:20px;font-size:12px;color:#666;">
            Or copy this link:<br/>
            ${resetLink}
          </p>
        </div>
      `);

    try {
      // FIX: Use .email.send() here as well
      await mailerSend.email.send(emailParams);
      console.log("✅ Reset email sent");
      return true;
    } catch (error) {
      console.error("❌ Email Error:", error.body ? error.body : error);
      return false;
    }
  },
};

module.exports = emailService;