import type {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient, Game, Pick, Team} from '@prisma/client';
import jwt from 'jsonwebtoken';
import {GamesResponse, GameWithTeamsAndPicks} from 'types';

const prisma = new PrismaClient();

export default async (
  req: NextApiRequest,
  res: NextApiResponse<GamesResponse>
) => {
  let games: GameWithTeamsAndPicks[] | undefined;
  const token = req.cookies.picker_id;
  const userId = token
    ? (jwt.verify(token, process.env.APP_SECRET) as {id: string}).id
    : undefined;

  const body = req.body && JSON.parse(req.body);
  const adminPage: string = body?.adminPage;
  const week = body?.week ? body.week : '16';

  if (!adminPage) {
    games = ((await prisma.game.findMany({
      where: {
        week,
      },
      include: userId
        ? {
            home: true,
            away: true,
            picks: {include: {team: true, user: {select: {username: true}}}},
          }
        : {
            home: true,
            away: true,
          },
    })) as unknown) as GameWithTeamsAndPicks[];

    if (userId) {
      games = games.map((game) => {
        return {
          ...game,
          userPick: game.picks.find((pick) => pick.userId === Number(userId)),
        };
      });
    }
  } else {
    games = ((await prisma.game.findMany({
      where: {week},
      include: {home: true, away: true},
    })) as unknown) as GameWithTeamsAndPicks[];
  }

  res.statusCode = 200;
  res.json({games});
};
