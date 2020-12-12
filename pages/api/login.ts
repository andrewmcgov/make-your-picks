import type {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {setCookie} from '../../utilities/cookies';
import {ErrorResponse} from '../../types';

const prisma = new PrismaClient();

type SuccessResponse = {
  success: true;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) => {
  const body = JSON.parse(req.body);
  let email: string = body.email;
  const password: string = body.password;

  const user = await prisma.user.findUnique({where: {email}});

  if (!user) {
    res.statusCode = 400;
    return res.json({message: 'Incorrect email or password'});
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    res.statusCode = 400;
    return res.json({message: 'Incorrect email or password'});
  }

  const token = jwt.sign({id: user.id}, process.env.APP_SECRET);

  setCookie(res, 'picker_id', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  res.statusCode = 200;
  res.json({success: true});
};
