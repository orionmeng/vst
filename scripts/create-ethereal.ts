/**
 * Ethereal Email Account Generator
 * 
 * Development utility to generate test email credentials.
 * Run with: npx tsx scripts/create-ethereal.ts
 */

import nodemailer from "nodemailer";

/**
 * Creates and displays Ethereal test account credentials
 */
async function createEthereal() {
  const testAccount = await nodemailer.createTestAccount();

  console.log("Ethereal Email Credentials");
  console.log("--------------------------");
  console.log("Host:", testAccount.smtp.host);
  console.log("Port:", testAccount.smtp.port);
  console.log("Secure:", testAccount.smtp.secure);
  console.log("User:", testAccount.user);
  console.log("Pass:", testAccount.pass);
}

createEthereal().catch(console.error);
