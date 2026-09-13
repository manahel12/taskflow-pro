import nodemailer from "nodemailer";

export async function sendResetEmail(to, resetUrl) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return { sent: false, resetUrl };
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "TaskFlow Pro Password Reset",
    text: `Reset your password using this link: ${resetUrl}`
  });

  return { sent: true };
}
