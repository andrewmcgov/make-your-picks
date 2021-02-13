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
  const homeScore: string = body.homeScore;
  const awayScore: string = body.awayScore;
  let winnerId: string = body.winnerId;

  if (token && gameId && winnerId) {
    const id = (jwt.verify(token, process.env.APP_SECRET) as {id: string}).id;
    const user = await prisma.user.findUnique({where: {id: Number(id)}});

    if (user.id <= 2) {
      // Get the game from the database, and include all picks for that game
      const game = await prisma.game.findUnique({
        where: {id: Number(gameId)},
        include: {picks: true},
      });

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

      if (isNaN(Number(homeScore)) || isNaN(Number(awayScore))) {
        res.statusCode = 200;
        return res.json({
          message: `Please provide valid scores`,
        });
      }

      // Save the winnerId of the winning team on the game
      await prisma.game.update({
        where: {id: game.id},
        data: {
          winnerId: Number(winnerId),
          homeScore: Number(homeScore),
          awayScore: Number(awayScore),
        },
      });

      // For all picks of that game, set the correct and closed values based on the winner of the pick
      let updatingPicksError: string | boolean = false;

      await Promise.all(
        game.picks.map(async (pick) => {
          const updatedPick = await prisma.pick.update({
            where: {id: pick.id},
            data: {closed: true, correct: Number(winnerId) === pick.teamId},
          });

          if (!updatedPick.closed) {
            updatingPicksError = 'Error updating picks, try again';
          }
        })
      );

      if (updatingPicksError) {
        res.statusCode = 500;
        return res.json({message: updatingPicksError});
      } else {
        res.statusCode = 200;
        return res.json({success: true});
      }
    }
  } else {
    res.statusCode = 200;
    res.json({message: 'Only admins can close games.'});
  }
};
