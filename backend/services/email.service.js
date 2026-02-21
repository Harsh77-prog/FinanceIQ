require("dotenv").config();
const { MailerSend, EmailParams } = require("mailersend");

// Debug import
console.log("MailerSend:", MailerSend, "EmailParams:", EmailParams);

if (!process.env.MAILERSEND_API_KEY) {
  console.error("❌ MAILERSEND_API_KEY is missing in .env");
}

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});



const emailService = {
  sendVerificationEmail: async (email, token, userName) => {
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    console.log("Sending verification email to:", email);

    const emailParams = new EmailParams()
      .setFrom(process.env.EMAIL_FROM)
      .setTo(email)
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
      const response = await mailerSend.send(emailParams);
      console.log("✅ Verification email sent:", response);
      return true;
    } catch (error) {
      console.error("❌ Email Error:", error);
      return false;
    }
  },

  sendPasswordResetEmail: async (email, token, userName) => {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    console.log("Sending password reset email to:", email);

    const emailParams = new EmailParams()
      .setFrom(process.env.EMAIL_FROM)
      .setTo(email)
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
      const response = await mailerSend.send(emailParams);
      console.log("✅ Reset email sent:", response);
      return true;
    } catch (error) {
      console.error("❌ Email Error:", error);
      return false;
    }
  },
};

module.exports = emailService;