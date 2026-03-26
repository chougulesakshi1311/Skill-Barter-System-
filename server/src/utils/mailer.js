const nodemailer = require("nodemailer");

const buildTransport = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
};

const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = buildTransport();

  if (!transporter) {
    console.warn("SMTP not configured. Email skipped for recipient:", to);
    return { skipped: true };
  }

  try {
    const response = await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
      text,
    });

    return { skipped: false, messageId: response.messageId };
  } catch (error) {
    console.error("SMTP send failed:", error.message);
    return { skipped: true, reason: "smtp-send-failed" };
  }
};

const sendResetPasswordEmail = async ({ to, resetUrl }) => {
  return sendEmail({
    to,
    subject: "Skill Barter - Password Reset",
    text: `You requested a password reset. Reset link: ${resetUrl}`,
    html: `<p>You requested a password reset.</p><p><a href=\"${resetUrl}\">Reset your password</a></p><p>This link expires in 1 hour.</p>`,
  });
};

module.exports = {
  sendEmail,
  sendResetPasswordEmail,
};
