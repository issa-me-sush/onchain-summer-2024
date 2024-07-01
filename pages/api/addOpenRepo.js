import dbConnect from '../../utils/dbConnect';
import OpenRepo from '../../models/OpenRepo';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  if (method === 'POST') {
    try {
      const { userId, repoName, repoUrl, description,imageUrl } = req.body;
      
  
      const openRepo = new OpenRepo({ userId, repoName, repoUrl, description,imageUrl });
      await openRepo.save();

      res.status(201).json({ success: true, data: openRepo });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
