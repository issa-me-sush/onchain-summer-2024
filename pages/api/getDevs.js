import dbConnect from '../../utils/dbConnect';
import User from '../../models/User';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  if (method === 'GET') {
    try {
      const users = await User.find({});
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
