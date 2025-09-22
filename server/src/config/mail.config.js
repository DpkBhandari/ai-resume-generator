import nodemailer from "nodemailer";
import config from "./config.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: config.email,
    pass: config.pass_email,
  },
});

async function sendMailWithRetry(mailOptions, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`📧 Email sent: ${info.messageId}`);
      return info;
    } catch (err) {
      console.error(
        `⚠️ Email send failed (attempt ${i + 1}):`,
        err.message || err
      );
      if (i < retries - 1) await new Promise((r) => setTimeout(r, delay));
      else throw err;
    }
  }
}

/**
 * Send OTP / Verification Emails
 */
export const sendOtpMail = async (
  toEmail,
  verificationCode,
  purpose = "register",
  name = ""
) => {
  let subject = "";
  let html = "";

  switch (purpose) {
    case "register":
      subject = "Confirm Your Email to Complete Registration";
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto; padding: 20px; border:1px solid #eee; border-radius: 8px;">
          <h2 style="color:#1a73e8; text-align:center;">Welcome to AI Resume Builder!</h2>
          <p>Your verification code is:</p>
          <h3 style="text-align:center; letter-spacing: 2px;">${verificationCode}</h3>
          <p>Valid for 15 minutes. Do not share with anyone.</p>
        </div>
      `;
      break;

    case "forgotPassword":
      subject = "Reset Your Password";
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto; padding:20px; border:1px solid #eee; border-radius: 8px;">
          <h2 style="color:#d9534f; text-align:center;">Password Reset Request</h2>
          <p>Your password reset code is:</p>
          <h3 style="text-align:center; letter-spacing: 2px;">${verificationCode}</h3>
          <p>Valid for 15 minutes. Do not share with anyone.</p>
        </div>
      `;
      break;

    case "resendOtp":
      subject = "Your OTP Code";
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto; padding:20px; border:1px solid #eee; border-radius: 8px;">
          <h2 style="color:#f0ad4e; text-align:center;">Resend OTP Request</h2>
          <p>Your new OTP is:</p>
          <h3 style="text-align:center; letter-spacing: 2px;">${verificationCode}</h3>
          <p>Valid for 15 minutes. Do not share with anyone.</p>
        </div>
      `;
      break;

    case "updatePassword":
      subject = "Your Password Has Been Updated 🔒";
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto; padding:20px; border:1px solid #eee; border-radius:8px;">
          <h2 style="text-align:center; color:#5cb85c;">✅ Password Updated Successfully</h2>
          <p>Hello ${name},</p>
          <p>Your account password has been updated successfully. If you did not perform this action, please reset your password immediately.</p>
          <p style="text-align:center; margin-top:20px; font-size:14px; color:#777;">AI Resume Builder Team</p>
        </div>
      `;
      break;

    default:
      subject = "Your OTP Code";
      html = `<p>Your OTP is: ${verificationCode}</p>`;
  }

  const mailOptions = {
    from: `"AI Resume Builder" <${config.email}>`,
    to: toEmail,
    subject,
    html,
  };

  return await sendMailWithRetry(mailOptions);
};

/**
 * Send Welcome Mail (After successful registration)
 */
export const sendWelcomeMail = async (toEmail, name) => {
  const mailOptions = {
    from: `"AI Resume Builder" <${config.email}>`,
    to: toEmail,
    subject: "Welcome to AI Resume Builder 🚀",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto; padding:20px; border:1px solid #eee; border-radius:8px;">
        <h2 style="text-align:center; color:#1a73e8;">🎉 Welcome ${name}!</h2>
        <p>Thanks for joining AI Resume Builder! Start creating professional resumes effortlessly.</p>
      </div>
    `,
  };

  return await sendMailWithRetry(mailOptions);
};

/**
 * Send Welcome Back Mail (Returning Users)
 */
export const sendWelcomeBackMail = async (toEmail, name) => {
  const mailOptions = {
    from: `"AI Resume Builder" <${config.email}>`,
    to: toEmail,
    subject: "Welcome Back to AI Resume Builder 👋",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto; padding:20px; border:1px solid #eee; border-radius:8px;">
        <h2 style="text-align:center; color:#1a73e8;">👋 Welcome Back ${name}!</h2>
        <p>We’re glad to see you again! Continue building amazing resumes with AI Resume Builder.</p>
      </div>
    `,
  };

  return await sendMailWithRetry(mailOptions);
};
