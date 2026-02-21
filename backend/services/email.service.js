require("dotenv").config();
const MailerSend = require("mailersend").default;

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

const emailService = {
  // ================= VERIFY EMAIL =================
  sendVerificationEmail: async (email, token, userName) => {
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    try {
      await mailerSend.emails.send({
        from: { email: process.env.EMAIL_FROM },
        to: [{ email }],
        subject: "📧 Verify Your FinanceIQ Email",
        html: `
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
        `,
      });

      console.log("✅ Verification email sent");
      return true;
    } catch (error) {
      console.error("❌ Email Error:", error);
      return false;
    }
  },

  // ================= RESET PASSWORD =================
  sendPasswordResetEmail: async (email, token, userName) => {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    try {
      await mailerSend.emails.send({
        from: { email: process.env.EMAIL_FROM },
        to: [{ email }],
        subject: "🔐 Reset Your FinanceIQ Password",
        html: `
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
        `,
      });

      console.log("✅ Reset email sent");
      return true;
    } catch (error) {
      console.error("❌ Email Error:", error);
      return false;
    }
  },
};

module.exports = emailService;