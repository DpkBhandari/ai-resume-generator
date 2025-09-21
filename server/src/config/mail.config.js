import nodemailer from "nodemailer";
import config from "./config.js";

// Create transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: config.email,
    pass: config.pass_email,
  },
});

// Retry wrapper
async function sendMailWithRetry(mailOptions, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`📧 Email sent: ${info.messageId}`);
      return info;
    } catch (err) {
      console.error(`⚠️ Email send failed (attempt ${i + 1}): ${err.message}`);
      if (i < retries - 1) await new Promise((r) => setTimeout(r, delay));
      else throw err;
    }
  }
}

// Send Verification Code
export const sendMail = async (toEmail, verificationCode) => {
  const mailOptions = {
    from: `"AI Resume Builder" <${config.email}>`,
    to: toEmail,
    subject: "Confirm Your Email to Complete Registration",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto; padding: 20px; border:1px solid #eee; border-radius: 8px;">
        <h2 style="color:#1a73e8; text-align:center;">Welcome to AI Resume Builder !</h2>
        <p>Your verification code is:</p>
        <h3 style="text-align:center; letter-spacing: 2px;">${verificationCode}</h3>
        <p>Valid for 15 minutes. Do not share with anyone.</p>
      </div>
    `,
  };
  return await sendMailWithRetry(mailOptions);
};

// Send Welcome Mail
export const sendWelcomeMail = async (toEmail, name) => {
  const mailOptions = {
    from: `"AI Resume Builder"<${config.email}>`,
    to: toEmail,
    subject: "Welcome to 'AI Resume Builder' 🚀",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto; padding:20px; border:1px solid #eee; border-radius:8px;">
        <h2 style="text-align:center; color:#1a73e8;">🎉 Welcome ${name}!</h2>
        <p>Thanks for joining AI Resume Builder ! You can now shorten URLs effortlessly.</p>
      </div>
    `,
  };
  return await sendMailWithRetry(mailOptions);
};
