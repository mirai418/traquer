import { getTransporter } from '../config/nodemailer.js';

function fillTemplate(to: string, body: string[]) {
  return `
<p>Hello ${to},</p>
<br>
${body.reduce((res, line) => {
  return res + `<p><b>${line}</b></p>`;
}, '')}
<br>
<br>
<p>Cheers,<br>
Tracker</p>

  `;
}

async function send(to: string, subject: string, body: string[]) {
  const info = await getTransporter().sendMail({
    from: process.env.EMAIL_FROM,
    to: to,
    subject: subject,
    html: fillTemplate(to, body),
  });

  console.log(`Message sent: ${info.messageId}`);
}

export { send };
