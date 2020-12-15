import type {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient, GameInclude} from '@prisma/client';

import {GamesResponse} from '../../types';

const prisma = new PrismaClient();

export default async (
  req: NextApiRequest,
  res: NextApiResponse<GamesResponse>
) => {
  const games = await prisma.game.findMany({include: {home: true, away: true}});

  // console.log(games);

  res.statusCode = 200;
  res.json({games});
};
