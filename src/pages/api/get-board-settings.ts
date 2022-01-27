import { NextApiRequest, NextApiResponse } from 'next';
import { getBoard } from '../../lib/getBoard';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = await getBoard();
  res.status(200).json(data);
}
