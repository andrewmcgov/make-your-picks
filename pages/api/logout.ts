import type {NextApiRequest, NextApiResponse} from 'next';

import {setCookie} from '../../utilities/cookies';
import {ErrorResponse} from '../../types';

type SuccessResponse = {
  success: true;
};

export default async (
  _: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) => {
  setCookie(res, 'picker_id', '', {
    httpOnly: true,
    maxAge: Date.now(),
  });

  res.statusCode = 200;
  res.json({success: true});
};
