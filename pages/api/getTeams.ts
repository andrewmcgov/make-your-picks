import type {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';

import {TeamsResponse} from '../../types';

const prisma = new PrismaClient();

export default async (
  req: NextApiRequest,
  res: NextApiResponse<TeamsResponse>
) => {
  const teams = await prisma.team.findMany();

  res.statusCode = 200;
  res.json({teams});
};
