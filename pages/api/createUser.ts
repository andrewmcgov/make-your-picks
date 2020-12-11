// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

type Data = {
  name: string;
};

type RequestData = {
  email: string;
  password: string;
};

type ErrorResponse = {
  message: string;
};

function validateEmail(email: string) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorResponse>
) => {
  const body = JSON.parse(req.body);
  let email: string = body.email;
  const username: string = body.username;
  const password: string = body.password;
  const repeatPassword: string = body.repeatPassword;

  // Throw an error if the passwords do not match
  if (password !== repeatPassword) {
    res.statusCode = 400;
    return res.json({message: 'Passwords do not match!'});
  }

  email = email.trim().toLowerCase();

  if (!validateEmail(email)) {
    res.statusCode = 400;
    return res.json({message: 'Please provide a valid email!'});
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {email, password: hash, username},
  });

  if (!user) {
    res.statusCode = 500;
    res.json({message: 'Internal server error.'});
  }

  // todo set a cookie using JWT?
  // https://nextjs.org/docs/api-routes/api-middlewares#extending-the-reqres-objects-with-typescript
  // const token = jwt.sign({_id: user._id}, process.env.APP_SECRET);

  // todo: respond with new user
  res.statusCode = 200;
  res.json({name: 'Test'});
};
