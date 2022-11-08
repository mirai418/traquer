import nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';

let transporter: nodemailer.Transporter<SentMessageInfo>;

function createTransporter() {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  return transporter;
}

function getTransporter() {
  return transporter || createTransporter();
}

export { createTransporter, getTransporter };
