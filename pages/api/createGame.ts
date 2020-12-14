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
  const body = JSON.parse(req.body);
  let homeId: string = body.home;
  let awayId: string = body.away;
  const start: string = body.start;
  console.log('creating game');

  if (token) {
    const id = (jwt.verify(token, process.env.APP_SECRET) as {id: string}).id;
    const user = await prisma.user.findUnique({where: {id: Number(id)}});

    if (user.email === 'test@test.com') {
      const game = await prisma.game.create({
        data: {
          home: {connect: {id: Number(homeId)}},
          away: {connect: {id: Number(awayId)}},
          start,
          league: 'NFL',
          week: '15',
          season: '2020',
        },
      });

      console.log(game);

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
