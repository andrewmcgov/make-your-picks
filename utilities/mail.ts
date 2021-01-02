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
      subject: 'Make your picks for this week!',
      html: makeEmail("Don't forget to make your picks!", [
        `It's almost game time, don't forget to make your picks for this week!`,
        `<a href="https://make-your-picks.vercel.app/">Click here to make your picks!</a>`,
        'Or copy the link below into your browser.',
        `https://make-your-picks.vercel.app/`,
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

export function makeEmail(title: string, text: string[]) {
  return `
  <div className="email" style="
  border: 1px solid black;
  padding: 20px;
  font-family: sans-serif;
  line-height: 2;
  font-size: 20px;
  ">
  <h2>${title}</h2>
  ${text
    .map((line) => {
      return `<p>${line}<p>`;
    })
    .join('')}
    <p>🧀, Andrew</p>
    </div>
    `;
}
