// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

type Data = {
  name: string;
};

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const test = await prisma.post.findMany();

  console.log(test);
  console.log('testtestest');
  res.statusCode = 200;
  res.json({name: 'John Doe'});
};
