import dbConnect from '../../utils/dbConnect';
import User from '../../models/User';

export default async function handler(req, res) {
  const { method } = req;
  const { githubId, profileUrl, starCount } = req.body;

  await dbConnect();

  if (method === 'POST') {
    try {
      console.log("Request body:", req.body);

      // Determine the score multiplier based on star count
      let multiplier = 1;
      if (starCount > 1000 && starCount <= 5000) {
        multiplier = 1.5;
      } else if (starCount > 5000 && starCount <= 10000) {
        multiplier = 2;
      } else if (starCount > 10000) {
        multiplier = 3;
      }

      // Check if the user already exists
      let user = await User.findOne({ githubId });

      if (user) {
        // If user exists, increment the attestations and add to the score based on multiplier
        user.attestations += 1;
        user.score += 5 * multiplier;
        await user.save();
      } else {
        // If user does not exist, create a new user with initial values
        user = new User({ githubId, profileUrl, attestations: 1, score: 5 * multiplier });
        await user.save();
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Error adding/updating user:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
