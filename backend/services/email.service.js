const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const emailService = {

  // ================= VERIFY EMAIL =================
  sendVerificationEmail: async (email, token, userName) => {
    try {
      const frontendUrl =
        process.env.FRONTEND_URL || "http://localhost:3000";

      const verificationLink =
        `${frontendUrl}/verify-email?token=${token}`;

      console.log("📧 Generating verification link:", verificationLink);

      const html = `
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
      `;

      const response = await resend.emails.send({
        from: "FinanceIQ <onboarding@resend.dev>",
        to: email,
        subject: "📧 Verify Your FinanceIQ Email",
        html,
      });

      console.log("✅ Verification email sent:", response.id);
      return true;

    } catch (error) {
      console.error("❌ Email Error:", error.message);
      return false;
    }
  },

  // ================= RESET PASSWORD =================
  sendPasswordResetEmail: async (email, token, userName) => {
    try {
      const frontendUrl =
        process.env.FRONTEND_URL || "http://localhost:3000";

      const resetLink =
        `${frontendUrl}/reset-password?token=${token}`;

      console.log("📧 Generating reset link:", resetLink);

      const html = `
        <div style="font-family:sans-serif;padding:20px;border:1px solid #eee;border-radius:10px;">
          <h2>Password Reset Request</h2>
          <p>Hi ${userName},</p>
          <p>Click below to reset your password. Link expires in 1 hour.</p>

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
      `;

      const response = await resend.emails.send({
        from: "FinanceIQ <onboarding@resend.dev>",
        to: email,
        subject: "🔐 Reset Your FinanceIQ Password",
        html,
      });

      console.log("✅ Reset email sent:", response.id);
      return true;

    } catch (error) {
      console.error("❌ Email Error:", error.message);
      return false;
    }
  },
};

module.exports = emailService;