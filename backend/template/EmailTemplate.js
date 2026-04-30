// Email templates
export const emailTemplates = {
  verification: (data) => ({
    subject: 'Verify Your Email - Car Rental',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: white;
            border-radius: 24px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #2563eb, #1e40af);
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            color: white;
            margin: 0;
            font-size: 28px;
            font-weight: 600;
            letter-spacing: -0.02em;
          }
          .content {
            padding: 40px 30px;
          }
          .button {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #2563eb, #1e40af);
            color: #fff;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 500;
            font-size: 16px;
            margin: 20px 0;
            transition: transform 0.2s;
          }
          .button:hover {
            transform: translateY(-2px);
          }
          .link {
            background: #f3f4f6;
            padding: 16px;
            border-radius: 12px;
            font-family: monospace;
            word-break: break-all;
            color: #2563eb;
            margin: 20px 0;
          }
          .footer {
            padding: 30px;
            text-align: center;
            background: #f9f9f9;
            color: #6b7280;
            font-size: 14px;
          }
          .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #e5e7eb, transparent);
            margin: 30px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to Car Rental, ${data.name}!</h1>
          </div>
          <div class="content">
            <p style="font-size: 18px; color: #374151;">Thanks for signing up! We're excited to have you on board.</p>
            
            <p style="color: #6b7280;">To get started with renting amazing cars, please verify your email address:</p>

            <p>Please verify your email using one of the options below:</p>

      <h3>🔐 Your OTP Code:</h3>
      <div style="font-size:32px; font-weight:bold; letter-spacing:5px; color:#2563eb;">
        ${data.otp}
      </div>

      <hr/>
            
            <div style="text-align: center;">
              <a href="${data.link}" class="button">Verify Email Address</a>
            </div>
            
            <div class="divider"></div>
            
            <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link into your browser:</p>
            <div class="link">${data.link}</div>
            
            <p style="color: #9ca3af; font-size: 14px; margin-top: 30px;">
              This link will expire in 24 hours. If you didn't create an account with us, please ignore this email.
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Car Rental. All rights reserved.</p>
            <p style="font-size: 12px;">123 Luxury Lane, Automotive City, AC 12345</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  welcome: (data) => ({
    subject: 'Welcome to Car Rental!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Car Rental</title>
        <style>
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: white;
            border-radius: 24px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #059669, #047857);
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            color: white;
            margin: 0;
            font-size: 28px;
            font-weight: 600;
            letter-spacing: -0.02em;
          }
          .content {
            padding: 40px 30px;
          }
          .button {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #059669, #047857);
            color: #fff;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 500;
            font-size: 16px;
            margin: 20px 0;
            transition: transform 0.2s;
          }
          .features {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin: 30px 0;
          }
          .feature {
            text-align: center;
            padding: 20px;
            background: #f9f9f9;
            border-radius: 16px;
          }
          .feature-emoji {
            font-size: 32px;
            margin-bottom: 10px;
          }
          .feature-title {
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 5px;
          }
          .feature-desc {
            font-size: 13px;
            color: #6b7280;
          }
          .footer {
            padding: 30px;
            text-align: center;
            background: #f9f9f9;
            color: #6b7280;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚗 Welcome Aboard, ${data.name}!</h1>
          </div>
          <div class="content">
            <p style="font-size: 18px; color: #374151;">Your email has been successfully verified!</p>
            
            <p style="color: #6b7280;">You're now ready to explore our premium fleet of vehicles and start your journey with us.</p>
            
            <div class="features">
              <div class="feature">
                <div class="feature-emoji">🔍</div>
                <div class="feature-title">Browse Cars</div>
                <div class="feature-desc">Explore our diverse fleet</div>
              </div>
              <div class="feature">
                <div class="feature-emoji">📅</div>
                <div class="feature-title">Easy Booking</div>
                <div class="feature-desc">Book in just a few clicks</div>
              </div>
              <div class="feature">
                <div class="feature-emoji">💎</div>
                <div class="feature-title">Premium Service</div>
                <div class="feature-desc">24/7 customer support</div>
              </div>
              <div class="feature">
                <div class="feature-emoji">⭐</div>
                <div class="feature-title">Best Rates</div>
                <div class="feature-desc">Competitive pricing</div>
              </div>
            </div>
            
            <div style="text-align: center;">
              <a href="${data.loginLink}" class="button">Start Your Journey</a>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Car Rental. All rights reserved.</p>
            <p style="font-size: 12px;">Drive your dreams with us! 🌟</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  passwordReset: (data) => ({
    subject: 'Reset Your Password - Car Rental',
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.6;
          color: #1a1a1a;
          margin: 0;
          padding: 0;
          background-color: #f9f9f9;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: white;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          color: white;
          margin: 0;
          font-size: 28px;
          font-weight: 600;
          letter-spacing: -0.02em;
        }
        .content {
          padding: 40px 30px;
        }
        .warning-box {
          background: #fff3cd;
          border: 1px solid #ffeeba;
          color: #856404;
          padding: 16px;
          border-radius: 12px;
          margin: 20px 0;
          font-size: 14px;
        }
        .button {
          display: inline-block;
          padding: 14px 32px;
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          color: white;
          text-decoration: none;
          border-radius: 12px;
          font-weight: 500;
          font-size: 16px;
          margin: 20px 0;
          transition: transform 0.2s;
        }
        .button:hover {
          transform: translateY(-2px);
        }
        .link {
          background: #f3f4f6;
          padding: 16px;
          border-radius: 12px;
          font-family: monospace;
          word-break: break-all;
          color: #dc2626;
          margin: 20px 0;
        }
        .footer {
          padding: 30px;
          text-align: center;
          background: #f9f9f9;
          color: #6b7280;
          font-size: 14px;
        }
        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e5e7eb, transparent);
          margin: 30px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Reset Your Password</h1>
        </div>
        <div class="content">
          <p style="font-size: 18px; color: #374151;">Hello ${data.name},</p>
          
          <p style="color: #6b7280;">We received a request to reset the password for your Car Rental account. Click the button below to set a new password:</p>
          
          <div style="text-align: center;">
            <a href="${data.link}" class="button">Reset Password</a>
          </div>
          
          <div class="warning-box">
            <strong>⚠️ Important:</strong> This password reset link will expire in 10 minutes. If you didn't request a password reset, please ignore this email or contact support if you have concerns.
          </div>
          
          <div class="divider"></div>
          
          <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link into your browser:</p>
          <div class="link">${data.link}</div>
          
          <p style="color: #9ca3af; font-size: 14px; margin-top: 30px;">
            For security reasons, this link can only be used once. If you need to reset your password again, please request a new reset link.
          </p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Car Rental. All rights reserved.</p>
          <p style="font-size: 12px;">123 Luxury Lane, Automotive City, AC 12345</p>
        </div>
      </div>
    </body>
    </html>
  `,
  }),

  passwordResetSuccess: (data) => ({
    subject: 'Your Password Has Been Reset - Car Rental',
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Successful</title>
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.6;
          color: #1a1a1a;
          margin: 0;
          padding: 0;
          background-color: #f9f9f9;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: white;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #059669, #047857);
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          color: white;
          margin: 0;
          font-size: 28px;
          font-weight: 600;
          letter-spacing: -0.02em;
        }
        .content {
          padding: 40px 30px;
        }
        .success-icon {
          font-size: 64px;
          text-align: center;
          margin-bottom: 20px;
        }
        .button {
          display: inline-block;
          padding: 14px 32px;
          background: linear-gradient(135deg, #059669, #047857);
          color: white;
          text-decoration: none;
          border-radius: 12px;
          font-weight: 500;
          font-size: 16px;
          margin: 20px 0;
          transition: transform 0.2s;
        }
        .security-tip {
          background: #e8f5e9;
          padding: 20px;
          border-radius: 12px;
          margin: 20px 0;
        }
        .footer {
          padding: 30px;
          text-align: center;
          background: #f9f9f9;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Password Reset Successful</h1>
        </div>
        <div class="content">
          <div class="success-icon">🔒</div>
          
          <p style="font-size: 18px; color: #374151;">Hello ${data.name},</p>
          
          <p style="color: #6b7280;">Your password has been successfully reset. You can now log in to your account with your new password.</p>
          
          <div style="text-align: center;">
            <a href="${data.loginLink}" class="button">Log In to Your Account</a>
          </div>
          
          <div class="security-tip">
            <strong>🔐 Security Tip:</strong>
            <p style="margin-top: 8px; font-size: 14px;">For your security, remember to:</p>
            <ul style="font-size: 14px; margin-top: 4px;">
              <li>Use a unique password for this account</li>
              <li>Never share your password with anyone</li>
              <li>Enable two-factor authentication if available</li>
            </ul>
          </div>
          
          <p style="color: #9ca3af; font-size: 14px; margin-top: 20px;">
            If you did not perform this password reset, please contact our support team immediately.
          </p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Car Rental. All rights reserved.</p>
          <p style="font-size: 12px;">Drive your dreams with us! 🌟</p>
        </div>
      </div>
    </body>
    </html>
  `,
  }),
};

export default emailTemplates;
