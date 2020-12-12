import type {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient, User} from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {setCookie} from '../../utilities/cookies';
import {ErrorResponse} from '../../types';

const prisma = new PrismaClient();

function validateEmail(email: string) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<User | ErrorResponse>
) => {
  const body = JSON.parse(req.body);
  let email: string = body.email;
  const username: string = body.username;
  const password: string = body.password;
  const repeatPassword: string = body.repeatPassword;

  // Throw an error if the passwords do not match
  if (password !== repeatPassword) {
    res.statusCode = 400;
    return res.json({message: 'Passwords do not match!'});
  }

  email = email.trim().toLowerCase();

  if (!validateEmail(email)) {
    res.statusCode = 400;
    return res.json({message: 'Please provide a valid email!'});
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {email, password: hash, username},
  });

  if (!user) {
    res.statusCode = 500;
    res.json({message: 'Internal server error.'});
  }

  const token = jwt.sign({id: user.id}, process.env.APP_SECRET);

  setCookie(res, 'picker_id', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  res.statusCode = 200;
  res.json(user);
};
