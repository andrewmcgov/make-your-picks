import type {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async (
  req: NextApiRequest,
  res: NextApiResponse<{success: boolean}>
) => {
  const token = req.cookies.picker_id;
  const body = JSON.parse(req.body);
  const gameId: string = body.id;

  if (token && gameId) {
    const id = (jwt.verify(token, process.env.APP_SECRET) as {id: string}).id;
    const user = await prisma.user.findUnique({where: {id: Number(id)}});

    if (user.id <= 2) {
      await prisma.game.delete({where: {id: Number(gameId)}});

      res.statusCode = 200;
      return res.json({
        success: true,
      });
    }
  }

  res.statusCode = 200;
  res.json({success: false});
};
