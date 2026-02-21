require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

// OAuth2 client setup
const oAuth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oAuth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });

// Function to create Nodemailer transporter
async function createTransporter() {
  const accessToken = await oAuth2Client.getAccessToken();

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_FROM,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      accessToken: accessToken.token,
    },
  });
}

const emailService = {
  // ================= VERIFY EMAIL =================
  sendVerificationEmail: async (email, token, userName) => {
    try {
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      const verificationLink = `${frontendUrl}/verify-email?token=${token}`;

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

      const transporter = await createTransporter();
      const result = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "📧 Verify Your FinanceIQ Email",
        html,
      });

      console.log("✅ Verification email sent:", result.messageId);
      return true;
    } catch (error) {
      console.error("❌ Email Error:", error);
      return false;
    }
  },

  // ================= RESET PASSWORD =================
  sendPasswordResetEmail: async (email, token, userName) => {
    try {
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      const resetLink = `${frontendUrl}/reset-password?token=${token}`;

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

      const transporter = await createTransporter();
      const result = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "🔐 Reset Your FinanceIQ Password",
        html,
      });

      console.log("✅ Reset email sent:", result.messageId);
      return true;
    } catch (error) {
      console.error("❌ Email Error:", error);
      return false;
    }
  },
};

module.exports = emailService;