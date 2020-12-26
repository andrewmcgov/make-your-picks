import type {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient, Game, Pick} from '@prisma/client';
import jwt from 'jsonwebtoken';

type GameWithPicks = Game & {picks: Pick[]};

const prisma = new PrismaClient();

export default async (
  req: NextApiRequest,
  res: NextApiResponse<{success: boolean} | {message: string}>
) => {
  const token = req.cookies.picker_id;
  const body = JSON.parse(req.body);
  const gameId: string = body.gameId;
  let winnerId: string = body.winnerId;

  console.log({gameId, winnerId});

  if (token && gameId && winnerId) {
    const id = (jwt.verify(token, process.env.APP_SECRET) as {id: string}).id;
    const user = await prisma.user.findUnique({where: {id: Number(id)}});

    console.log({user: user.id});

    if (user.id <= 2) {
      // Get the game from the database, and include all picks for that game
      const game = ((await prisma.game.findUnique({
        where: {id: Number(gameId)},
        include: {picks: true},
      })) as unknown) as GameWithPicks;

      if (!game || ![game.awayId, game.homeId].includes(Number(winnerId))) {
        res.statusCode = 200;
        return res.json({message: `Could not find game with id ${gameId}`});
      }

      if (![game.awayId, game.homeId].includes(Number(winnerId))) {
        res.statusCode = 200;
        return res.json({
          message: `Team with id ${winnerId} is not in this game. Game IDs are: ${game.awayId} and ${game.homeId}`,
        });
      }

      // Save the winnerId of the winning team on the game
      await prisma.game.update({
        where: {id: game.id},
        data: {winnerId: Number(winnerId)},
      });

      // For all picks of that game, set the correct and closed values based on the winner of the pick
      game.picks.forEach(async (pick) => {
        console.log({pick: pick.teamId, winner: winnerId});
        await prisma.pick.update({
          where: {id: pick.id},
          data: {closed: true, correct: Number(winnerId) === pick.teamId},
        });
      });

      res.statusCode = 200;
      return res.json({success: true});
    }
  } else {
    res.statusCode = 200;
    res.json({message: 'Only admins can close games.'});
  }
};
