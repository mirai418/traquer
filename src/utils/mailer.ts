import fs from 'fs/promises';
import { merge, template } from 'lodash-es';
import { getTransporter } from '../config/nodemailer.js';

function getBaseContents() {
  const baseUrl = `${process.env.HOST}${process.env.PORT ? ':' : ''}${process.env.PORT}`;
  return {
    urls: {
      base: baseUrl,
      logo: `${process.env.S3_ADDRESS}/traquer_icons/icon_60pt%403x.png`,
      subscriptions: `${baseUrl}/subscriptions`,
      unsubscribe: `${baseUrl}/unsubscribe`,
    },
  };
}

async function send(to: string, subject: string, templateName: string, contents: object) {
  const templateHtml = await fs.readFile(`./src/utils/mailer-templates/${templateName}.html`, 'utf8');
  const html = template(templateHtml)(merge(getBaseContents(), contents));
  const info = await getTransporter().sendMail({
    from: process.env.EMAIL_FROM,
    to: to,
    subject: subject,
    html: html,
  });

  console.log(`Email sent: ${info.messageId}`);
}

export { send };
