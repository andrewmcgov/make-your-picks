import type {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';
import jwt from 'jsonwebtoken';
import {ErrorResponse} from 'types';

import {wait} from 'utilities/wait';

const prisma = new PrismaClient();

export default async (
  req: NextApiRequest,
  res: NextApiResponse<{success: true} | ErrorResponse>
) => {
  const token = req.cookies.picker_id;
  const body = JSON.parse(req.body);
  let value: string = body.value;

  if (!value) {
    res.statusCode = 400;
    return res.json({message: 'You must provide a tiebreaker value.'});
  }

  await wait(2000);

  if (token) {
    const id = (jwt.verify(token, process.env.APP_SECRET) as {id: string}).id;

    const [user, game, existingTieBreaker] = await Promise.all([
      await prisma.user.findUnique({where: {id: Number(id)}}),
      await prisma.game.findFirst({where: {season: '2020', week: 'SB'}}),
      await prisma.tieBreaker.findFirst({
        where: {userId: Number(id), season: '2020'},
      }),
    ]);

    if (!user) {
      res.statusCode = 400;
      return res.json({
        message: 'You must be logged in to save your tiebreaker',
      });
    }

    if (!game) {
      res.statusCode = 400;
      return res.json({message: 'Could not find a superbowl game.'});
    }

    // Prisma types the start date as a js Date, but it returns a date string
    if (Date.parse((game.start as unknown) as string) < Date.now()) {
      res.statusCode = 400;
      return res.json({message: 'This superbowl has already started!'});
    }

    if (existingTieBreaker) {
      const updatedTieBreaker = await prisma.tieBreaker.update({
        where: {id: existingTieBreaker.id},
        data: {value: Number(value)},
      });

      if (updatedTieBreaker.id) {
        return res.json({success: true});
      } else {
        res.statusCode = 500;
        return res.json({message: 'Error saving tiebreaker.'});
      }
    } else {
      const newTieBreaker = await prisma.tieBreaker.create({
        data: {
          userId: Number(id),
          season: '2020',
          value: Number(value),
        },
      });

      if (newTieBreaker.id) {
        return res.json({success: true});
      } else {
        res.statusCode = 500;
        return res.json({message: 'Error saving tiebreaker.'});
      }
    }
  }

  res.statusCode = 400;
  return res.json({message: 'You must be logged in to make a pick'});
};
