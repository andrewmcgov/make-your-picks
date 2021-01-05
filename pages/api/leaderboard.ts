import type {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';
import {LeaderboardEntryResponse, LeaderboardEntryWithUserInfo} from 'types';

const prisma = new PrismaClient();

export default async (
  req: NextApiRequest,
  res: NextApiResponse<LeaderboardEntryResponse | null>
) => {
  const leaderbaordEntries = ((await prisma.leaderboardEntry.findMany({
    where: {season: '2020'},
    include: {user: {select: {username: true, id: true}}},
  })) as unknown) as LeaderboardEntryWithUserInfo[];

  const leaderboardEntriesWithTotal = leaderbaordEntries.map((entry) => {
    return {
      ...entry,
      total:
        entry.wildcard + entry.division + entry.conference + entry.superbowl,
    };
  });

  const sortedLeaderboardEntries = leaderboardEntriesWithTotal
    .sort((a, b) => a.total - b.total)
    .reverse()
    .filter((entry) => entry.user.id > 1);

  res.statusCode = 200;
  res.json({entries: sortedLeaderboardEntries, success: true});
};
