import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// 1. Enhanced Transporter Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || "eventincharge03@gmail.com", // Fallback
    pass: process.env.EMAIL_PASS || "whnillvuevrpkntl",
  },
  logger: true, // Enable SMTP traffic logging
  debug: true   // Show detailed debug info
});

// 2. Connection Test on Startup
transporter.verify()
  .then(() => console.log("✅ SMTP Connection Verified"))
  .catch(err => console.error("❌ SMTP Connection Failed:", {
    code: err.code,
    response: err.response,
    stack: err.stack
  }));

// 3. Robust Email Sending Function
export const sendConfirmationEmail = async (student, event) => {
  const mailOptions = {
    from: `"Event Team" <${process.env.EMAIL_USER || "eventincharge03@gmail.com"}>`,
    to: student.email,
    subject: `Registration Confirmed: ${event.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2 style="color: #2563eb;">Hello ${student.name},</h2>
        <p>✅ You have successfully registered for:</p>
        
        <div style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem;">
          <h3 style="margin-top: 0;">${event.title}</h3>
          <p>📝 <strong>Description:</strong> ${event.description}</p>
          <p>📅 <strong>Date:</strong> ${event.startDate} to ${event.endDate}</p>
          <p>📍 <strong>Location:</strong> ${event.location}</p>
        </div>

        <p style="margin-top: 1rem;">
          Need help? Reply to this email or contact us at 
          ${process.env.EMAIL_USER || "eventincharge03@gmail.com"}
        </p>
      </div>
    `,
    text: `Hello ${student.name},\n\nYou've registered for ${event.title}\n\nDetails:\n- Description: ${event.description}\n- Date: ${event.startDate} to ${event.endDate}\n- Location: ${event.location}\n\nThank you!`, // Plain text fallback
    priority: 'high'
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("📨 Email Sent Successfully:", {
      to: student.email,
      messageId: info.messageId,
      response: info.response
    });
    return info;
  } catch (error) {
    console.error("❌ Email Failed:", {
      errorCode: error.code,
      command: error.command,
      response: error.response,
      fullError: error
    });
    throw new Error(`Email delivery failed: ${error.response}`);
  }
};