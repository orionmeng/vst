import nodemailer from "nodemailer";

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
