const nodemailer = require('nodemailer')

// Create a transporter for sending emails
// For development, you can use Gmail or any SMTP service
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

// For testing without real email service
const isDevelopment = process.env.NODE_ENV === 'development'
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.warn('⚠️  Email credentials not configured. Email features will be in test mode.')
}

const emailService = {
  // Send verification email
  sendVerificationEmail: async (email, token, userName) => {
    try {
      const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`
      
      const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@financeiq.com',
        to: email,
        subject: '📧 Verify Your FinanceIQ Email Address',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3b82f6;">Welcome to FinanceIQ, ${userName}!</h2>
            <p>Thank you for signing up. Please verify your email address to activate your account.</p>
            
            <div style="margin: 30px 0;">
              <a href="${verificationLink}" style="
                background-color: #3b82f6;
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 5px;
                display: inline-block;
              ">Verify Email</a>
            </div>
            
            <p>Or copy this link: <a href="${verificationLink}">${verificationLink}</a></p>
            
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              This link expires in 24 hours. If you didn't sign up for FinanceIQ, please ignore this email.
            </p>
          </div>
        `,
      }

      if (isDevelopment || !process.env.EMAIL_USER) {
        console.log('📧 [TEST MODE] Verification email:', {
          to: email,
          link: verificationLink,
        })
        return true
      }

      await transporter.sendMail(mailOptions)
      console.log('✅ Verification email sent to:', email)
      return true
    } catch (error) {
      console.error('❌ Error sending verification email:', error.message)
      throw error
    }
  },

  // Send password reset email
  sendPasswordResetEmail: async (email, token, userName) => {
    try {
      const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`
      
      const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@financeiq.com',
        to: email,
        subject: '🔐 Reset Your FinanceIQ Password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3b82f6;">Password Reset Request</h2>
            <p>Hi ${userName},</p>
            <p>We received a request to reset your password. Click the link below to create a new password.</p>
            
            <div style="margin: 30px 0;">
              <a href="${resetLink}" style="
                background-color: #3b82f6;
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 5px;
                display: inline-block;
              ">Reset Password</a>
            </div>
            
            <p>Or copy this link: <a href="${resetLink}">${resetLink}</a></p>
            
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              This link expires in 1 hour. If you didn't request a password reset, please ignore this email or contact support.
            </p>
          </div>
        `,
      }

      if (isDevelopment || !process.env.EMAIL_USER) {
        console.log('📧 [TEST MODE] Password reset email:', {
          to: email,
          link: resetLink,
        })
        return true
      }

      await transporter.sendMail(mailOptions)
      console.log('✅ Password reset email sent to:', email)
      return true
    } catch (error) {
      console.error('❌ Error sending password reset email:', error.message)
      throw error
    }
  },
}

module.exports = emailService
