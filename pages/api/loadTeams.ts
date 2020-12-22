import type {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';
import jwt from 'jsonwebtoken';

import {nflTeams} from '../../data/nflTeams';

const prisma = new PrismaClient();

export default async (
  req: NextApiRequest,
  res: NextApiResponse<{success: boolean}>
) => {
  const token = req.cookies.picker_id;

  if (token) {
    const id = (jwt.verify(token, process.env.APP_SECRET) as {id: string}).id;
    const user = await prisma.user.findUnique({where: {id: Number(id)}});

    if (user.id <= 2) {
      nflTeams.forEach(async (team) => {
        await prisma.team.create({data: team});
      });
    }

    res.statusCode = 200;
    return res.json({
      success: true,
    });
  }

  res.statusCode = 200;
  res.json({success: false});
};
