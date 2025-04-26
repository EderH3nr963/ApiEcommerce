import nodemailer from "nodemailer";

async function sendEmail(email: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_NODEMAILER,
      pass: process.env.PASS_NODEMAILER,
    },
  });

  const mailOptions = {
    from: `"E-commerce" <${process.env.MAIL_USER}>`,
    to: email,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
}

export default sendEmail;