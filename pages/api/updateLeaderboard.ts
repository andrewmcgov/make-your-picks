import type {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient, Pick, Game} from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface PickWithGame extends Pick {
  game: Game;
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<{success: boolean} | null>
) => {
  const token = req.cookies.picker_id;

  if (!token) {
    res.statusCode = 400;
    res.json({success: false});
  }

  const id = (jwt.verify(token, process.env.APP_SECRET) as {id: string})?.id;

  if (!id) {
    res.statusCode = 400;
    res.json({success: false});
  }

  const user = await prisma.user.findUnique({where: {id: Number(id)}});

  if (!user || user.id > 2) {
    res.statusCode = 400;
    res.json({success: false});
  }

  const allUsers = await prisma.user.findMany();

  await Promise.all(
    allUsers.map(async (user) => {
      const existingEntry =
        (await prisma.leaderboardEntry.findFirst({
          where: {userId: user.id, season: '2020-BETA'},
        })) ||
        (await prisma.leaderboardEntry.create({
          data: {
            user: {connect: {id: user.id}},
            season: '2020-BETA',
            wildcard: 0,
            division: 0,
            conference: 0,
            superbowl: 0,
          },
        }));

      const picks = ((await prisma.pick.findMany({
        where: {userId: user.id},
        include: {game: true},
      })) as unknown) as PickWithGame[];

      const wildcardCorrectPicks = picks.filter(
        (pick) =>
          pick.game.season === '2020' && pick.game.week === '16' && pick.correct
      );

      const divisionCorrectPicks = picks.filter(
        (pick) =>
          pick.game.season === '2020' && pick.game.week === '17' && pick.correct
      );

      const conferenceCorrectPicks = picks.filter(
        (pick) =>
          pick.game.season === '2020' && pick.game.week === 'CC' && pick.correct
      );

      const superBowlCorrectPicks = picks.filter(
        (pick) =>
          pick.game.season === '2020' && pick.game.week === 'SB' && pick.correct
      );

      await prisma.leaderboardEntry.update({
        where: {id: existingEntry.id},
        data: {
          wildcard: wildcardCorrectPicks.length * 2,
          division: divisionCorrectPicks.length * 2,
          conference: conferenceCorrectPicks.length * 4,
          superbowl: superBowlCorrectPicks.length * 5,
        },
      });
    })
  );

  res.statusCode = 200;
  res.json({success: true});
};
