import type {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';

import {GameResponse} from '../../types';

const prisma = new PrismaClient();

export default async (
  req: NextApiRequest,
  res: NextApiResponse<GameResponse | {game: null}>
) => {
  const body = JSON.parse(req.body);
  let id: string = body.id;

  if (!id) {
    res.statusCode = 400;
    res.json({game: null});
  }

  const game = await prisma.game.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      home: true,
      away: true,
    },
  });

  res.statusCode = 200;
  res.json({game: game ? game : null});
};
