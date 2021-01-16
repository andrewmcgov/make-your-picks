import * as nodemailer from 'nodemailer';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function sendReminderMail(email: string) {
  try {
    await transport.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: 'The Divisional Round is here',
      html: makeEmail([
        `The divisional round gets underway this Saturday at 4:35pm.`,
        `<a href="https://make-your-picks.vercel.app/">Click here to make your picks!</a>`,
      ]),
    });
  } catch (err) {
    console.error(err);
    throw new Error('Error sending pick reminder email email!');
  }
}

export async function emailUsers() {
  const users = (await prisma.user.findMany()).filter(
    (user) => user.email !== 'test@test.com'
  );

  await Promise.all(
    users.map(async (user) => {
      await sendReminderMail(user.email);
    })
  );
}

export function makeEmail(text: string[]) {
  return `
  <div className="email" style="
  padding: 5px;
  font-family: sans-serif;
  line-height: 2;
  font-size: 16px;
  ">
  ${text
    .map((line) => {
      return `<p>${line}<p>`;
    })
    .join('')}
    <p>🧀, Andrew</p>
    </div>
    `;
}
