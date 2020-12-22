import type {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async (
  req: NextApiRequest,
  res: NextApiResponse<{success: boolean}>
) => {
  const token = req.cookies.picker_id;
  const body = JSON.parse(req.body);
  let homeId: string = body.home;
  let awayId: string = body.away;
  const start: string = body.start;
  const week: string = body.week;
  const gameId: string = body.id;

  if (token) {
    const id = (jwt.verify(token, process.env.APP_SECRET) as {id: string}).id;
    const user = await prisma.user.findUnique({where: {id: Number(id)}});

    if (user.id <= 2) {
      const game = await prisma.game.update({
        where: {id: Number(gameId)},
        data: {
          home: {connect: {id: Number(homeId)}},
          away: {connect: {id: Number(awayId)}},
          start,
          league: 'NFL',
          week: week,
          season: '2020',
        },
      });

      if (game.id) {
        res.statusCode = 200;
        return res.json({
          success: true,
        });
      }
    }
  }

  res.statusCode = 200;
  res.json({success: false});
};
