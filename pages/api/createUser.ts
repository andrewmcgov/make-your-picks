import type {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient, User} from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {setCookie} from '../../utilities/cookies';
import {ErrorResponse, CreateUserResponse} from '../../types';

const prisma = new PrismaClient();

function validateEmail(email: string) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<CreateUserResponse | ErrorResponse>
) => {
  const body = JSON.parse(req.body);
  let email: string = body.email;
  let username: string = body.username;
  const password: string = body.password;
  const repeatPassword: string = body.repeatPassword;
  const activationKey: string = body.activationKey;

  if (activationKey !== process.env.ACTIVATION_KEY) {
    res.statusCode = 400;
    return res.json({message: 'Incorrect activation key!'});
  }

  // Throw an error if the passwords do not match
  if (password !== repeatPassword) {
    res.statusCode = 400;
    return res.json({message: 'Passwords do not match!'});
  }

  email = email.trim().toLowerCase();

  if (!validateEmail(email)) {
    res.statusCode = 400;
    return res.json({message: 'Please provide a valid email!'});
  } else if (await prisma.user.findUnique({where: {email}})) {
    res.statusCode = 400;
    return res.json({message: 'An account with this email already exists!'});
  }

  if (!username) {
    res.statusCode = 400;
    return res.json({message: 'Please provide a username!'});
  } else if (await prisma.user.findUnique({where: {username}})) {
    res.statusCode = 400;
    return res.json({message: 'Username already taken!'});
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
  res.json({success: true});
};
