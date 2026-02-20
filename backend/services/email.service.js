const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

transporter.verify((error) => {
  if (error) {
    console.log('❌ Email Setup Error:', error.message)
  } else {
    console.log('✅ Email Service Ready')
  }
})
const emailService = {
  sendVerificationEmail: async (email, token, userName) => {
    try {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
      const verificationLink = `${frontendUrl}/verify-email?token=${token}`

      console.log('📧 Generating verification link:', verificationLink)
      const mailOptions = {
      from: `"FinanceIQ Support" <${process.env.EMAIL_USER}>`,
      to: email,
        subject: '📧 Verify Your FinanceIQ Email',
      html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2>Welcome ${userName}!</h2>
            <p>Click the button below to verify your email address. This link expires in 24 hours.</p>
            <a href="${verificationLink}" style="background:#3b82f6; color:white; padding:12px 24px; text-decoration:none; border-radius:5px; display:inline-block; font-weight:bold;">
              Verify Email
            </a>
            <p style="margin-top: 20px; color: #666; font-size: 12px;">
              Or copy and paste this link: <br/>
              ${verificationLink}
            </p>
          </div>
      `,
      }

      await transporter.sendMail(mailOptions)
      console.log('✅ Verification email sent to:', email)
      return true
    } catch (error) {
      console.error('❌ Email Error:', error.message)
      throw error
    }
  },

  sendPasswordResetEmail: async (email, token, userName) => {
    try {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
      const resetLink = `${frontendUrl}/reset-password?token=${token}`

      console.log('📧 Generating reset link:', resetLink)

      const mailOptions = {
      from: `"FinanceIQ Support" <${process.env.EMAIL_USER}>`,
      to: email,
        subject: '🔐 Reset Your FinanceIQ Password',
      html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2>Password Reset Request</h2>
            <p>Hi ${userName},</p>
            <p>Click the button below to reset your password. This link expires in 1 hour.</p>
            <a href="${resetLink}" style="background:#3b82f6; color:white; padding:12px 24px; text-decoration:none; border-radius:5px; display:inline-block; font-weight:bold;">
              Reset Password
            </a>
            <p style="margin-top: 20px; color: #666; font-size: 12px;">
              Or copy and paste: <br/>
              ${resetLink}
            </p>
          </div>
      `,
      }

      await transporter.sendMail(mailOptions)
      console.log('✅ Reset email sent to:', email)
      return true
    } catch (error) {
      console.error('❌ Email Error:', error.message)
      throw error
    }
  }
}
module.exports = emailService
