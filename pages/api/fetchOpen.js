import dbConnect from '../../utils/dbConnect';
import OpenRepo from '../../models/OpenRepo';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  if (method === 'GET') {
    try {
      const openRepos = await OpenRepo.find({});
      res.status(200).json({ success: true, data: openRepos });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
