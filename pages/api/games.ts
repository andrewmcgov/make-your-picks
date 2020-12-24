import type {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';
import jwt from 'jsonwebtoken';
import {GamesResponse} from 'types';

const prisma = new PrismaClient();

export default async (
  req: NextApiRequest,
  res: NextApiResponse<GamesResponse>
) => {
  let games;
  const token = req.cookies.picker_id;
  const userId = token
    ? (jwt.verify(token, process.env.APP_SECRET) as {id: string}).id
    : undefined;

  const body = req.body && JSON.parse(req.body);
  const adminPage: string = body?.adminPage;
  const week = body?.week ? body.week : '16';

  if (!adminPage) {
    games = await prisma.game.findMany({
      where: {
        week,
      },
      include: userId
        ? {
            home: true,
            away: true,
            Pick: {where: {userId: Number(userId)}},
          }
        : {
            home: true,
            away: true,
          },
    });
  } else {
    games = await prisma.game.findMany({include: {home: true, away: true}});
  }

  res.statusCode = 200;
  res.json({games});
};
