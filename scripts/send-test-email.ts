/**
 * Test Email Sender
 * 
 * Development utility to test email functionality.
 * Run with: npx tsx scripts/send-test-email.ts
 */

import nodemailer from "nodemailer";
import { createTestMailer } from "../lib/mailer.ts";

/**
 * Sends test email using Ethereal credentials
 */
async function main() {
  const { transporter } = await createTestMailer();

  const info = await transporter.sendMail({
    from: '"Valorant Skin Tracker" <no-reply@example.com>',
    to: "test@example.com",
    subject: "Test Email",
    text: "This is a test email",
    html: "<p>This is a <strong>test email</strong></p>",
  });

  console.log("Message sent:", info.messageId);
  console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
}

main().catch(console.error);
