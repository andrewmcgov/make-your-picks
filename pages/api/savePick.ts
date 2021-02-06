import type {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';
import jwt from 'jsonwebtoken';
import {ErrorResponse} from 'types';

import {gameStarted} from 'utilities/gameStarted';

const prisma = new PrismaClient();

export default async (
  req: NextApiRequest,
  res: NextApiResponse<{success: true} | ErrorResponse>
) => {
  const token = req.cookies.picker_id;
  const body = JSON.parse(req.body);
  let gameId: string = body.gameId;
  let teamId: string = body.teamId;

  if (!gameId || !teamId) {
    res.statusCode = 400;
    return res.json({message: 'You must provide a game and team.'});
  }

  if (token) {
    const id = (jwt.verify(token, process.env.APP_SECRET) as {id: string}).id;

    const [user, game, team] = await Promise.all([
      await prisma.user.findUnique({where: {id: Number(id)}}),
      await prisma.game.findUnique({where: {id: Number(gameId)}}),
      await prisma.team.findUnique({where: {id: Number(teamId)}}),
    ]);

    if (!user) {
      res.statusCode = 400;
      return res.json({message: 'You must be logged in to make a pick'});
    }

    if (!game) {
      res.statusCode = 400;
      return res.json({message: 'Could not find matching game for this pick'});
    }

    // Prisma types the start date as a js Date, but it returns a date string
    if (gameStarted(game)) {
      res.statusCode = 400;
      return res.json({message: 'This game has already started!'});
    }

    if (!team) {
      res.statusCode = 400;
      return res.json({message: 'Could not find matching game for this pick'});
    }

    if (team.id !== game.homeId && team.id !== game.awayId) {
      res.statusCode = 400;
      return res.json({
        message: 'The team you picked is not playing in this game',
      });
    }

    const existingPick = await prisma.pick.findFirst({
      where: {
        userId: user.id,
        gameId: game.id,
      },
    });

    if (existingPick) {
      const updatedPick = await prisma.pick.update({
        where: {id: existingPick.id},
        data: {
          team: {connect: {id: team.id}},
        },
      });

      if (updatedPick) {
        res.statusCode = 200;
        return res.json({success: true});
      }
    } else {
      const newPick = await prisma.pick.create({
        data: {
          game: {connect: {id: game.id}},
          team: {connect: {id: team.id}},
          user: {connect: {id: user.id}},
        },
      });
      if (newPick) {
        res.statusCode = 200;
        return res.json({success: true});
      }
    }
  }

  res.statusCode = 400;
  return res.json({message: 'You must be logged in to make a pick'});
};
