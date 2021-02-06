import type {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';
import {LeaderboardEntryResponse, LeaderboardEntryWithUserInfo} from 'types';
import {gameStarted} from 'utilities/gameStarted';

const prisma = new PrismaClient();

export default async (
  req: NextApiRequest,
  res: NextApiResponse<LeaderboardEntryResponse | null>
) => {
  const leaderbaordEntries = ((await prisma.leaderboardEntry.findMany({
    where: {season: '2020'},
    include: {user: {select: {username: true, id: true}}},
  })) as unknown) as LeaderboardEntryWithUserInfo[];

  const tieBreakers = await prisma.tieBreaker.findMany({
    where: {season: '2020'},
  });

  const superbowl = await prisma.game.findFirst({
    where: {season: '2020', week: 'sb'},
  });

  const superbowlClosed = superbowl?.homeScore || superbowl?.awayScore;
  const superbowlStarted = gameStarted(superbowl);

  const leaderboardEntriesWithTotal = leaderbaordEntries.map((entry) => {
    const tieBreaker = superbowlStarted
      ? tieBreakers.find((tieBreaker) => tieBreaker.userId === entry.userId)
          ?.value
      : undefined;

    const diff =
      tieBreaker && superbowlClosed
        ? tieBreaker - (superbowl.homeScore + superbowl.awayScore)
        : undefined;

    return {
      ...entry,
      total:
        entry.wildcard + entry.division + entry.conference + entry.superbowl,
      tieBreaker,
      diff,
    };
  });

  const sortedLeaderboardEntries = leaderboardEntriesWithTotal
    .sort((a, b) => {
      if (superbowlClosed && a.total === b.total) {
        const diffA = a.diff;
        const diffB = b.diff;

        if (diffA === undefined && diffB === undefined) {
          return a.total - b.total;
        }

        if (diffA === undefined) {
          return -1;
        }

        if (diffB === undefined) {
          return 1;
        }

        return Math.abs(diffB) - Math.abs(diffA);
      }

      return a.total - b.total;
    })
    .reverse()
    .filter((entry) => entry.user.id > 1);

  res.statusCode = 200;
  res.json({entries: sortedLeaderboardEntries, success: true});
};
