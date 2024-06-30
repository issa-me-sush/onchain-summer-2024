import dbConnect from '../../utils/dbConnect';
import User from '../../models/User';

export default async function handler(req, res) {
  const { method } = req;
  const { githubId, profileUrl } = req.body;

  await dbConnect();

  if (method === 'POST') {
    try {
      // Check if the user already exists
      let user = await User.findOne({ githubId });

      if (user) {
        // If user exists, increment the attestations and add 5 to the score
        user.attestations += 1;
        user.score += 5;
        await user.save();
      } else {
        // If user does not exist, create a new user with initial values
        user = new User({ githubId, profileUrl });
        await user.save();
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
