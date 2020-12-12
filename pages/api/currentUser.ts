import type {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';
import jwt from 'jsonwebtoken';

import {ClientUserResponse} from '../../types';

const prisma = new PrismaClient();

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ClientUserResponse | null>
) => {
  const token = req.cookies.picker_id;

  if (token) {
    const id = (jwt.verify(token, process.env.APP_SECRET) as {id: string}).id;
    const user = await prisma.user.findUnique({where: {id: Number(id)}});
    res.statusCode = 200;
    res.json({
      currentUser: {id: user.id, email: user.email, username: user.username},
    });
  }

  res.statusCode = 200;
  res.json({currentUser: null});
};
