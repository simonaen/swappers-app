import  prisma from '../../../lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, given_name, family_name, secret } = req.body;

  if (req.method !== 'POST') {
      console.log(2);
      
    return res.status(403).json({ message: 'Method not allowed' });
  }

  if (secret !== process.env.AUTH0_HOOK_SECRET) {
      console.log(3);
      
    return res.status(403).json({ message: `You must provide the secret 🤫` });
  }

  if (email) {
    
    await prisma.user.create({
      data: { email, firstName: given_name, lastName: family_name },
    });
    return res.status(200).json({
      message: `User with email: ${email} has been created successfully!`,
    });
  }
};

export default handler;