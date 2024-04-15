import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "notefynotes@gmail.com",
      pass: process.env.PASSKEY,
    }
  });

export default async function sendMail(verificationCode, receiver) {
    // send mail with defined transport object
    await transporter.sendMail({
      from: 'notefynotes@gmail.com',
      to: receiver, 
      subject: "Your verification code!",
      html: `
      <div style="font-family: Arial, sans-serif;">
        <h2 style="color: #333;">Password Reset Verification</h2>
        <p>We have received a request to reset the password for your account associated with Notefy.</p>
        <p>To ensure the security of your account, please use the following verification code to proceed with the password reset process:</p>
        <h3 style="color: #007bff;">Verification Code: ${verificationCode}</h3>
        <p>Once you receive this email, please enter the verification code on our password reset page. If you did not initiate this password reset request, please disregard this email and ensure the security of your account.</p>
        <p>Thank you!</p>
      </div>
    `
    });
}