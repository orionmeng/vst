/**
 * Email Service Configuration
 * 
 * Provides test email transporter using Ethereal Email.
 * For development/testing - creates temporary disposable email accounts.
 */

import nodemailer from "nodemailer";

/**
 * Creates test email transporter with Ethereal credentials
 * 
 * Generates temporary SMTP credentials for email testing.
 * Emails can be viewed at ethereal.email without real delivery.
 * 
 * @returns Transporter instance and test account credentials
 */
export async function createTestMailer() {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  return { transporter, testAccount };
}
