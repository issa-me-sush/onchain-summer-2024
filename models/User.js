import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  githubId: {
    type: String,
    unique: true,
    required: true,
  },
  profileUrl: {
    type: String,
 
  },
  score: {
    type: Number,
    default: 5,
  },
  attestations: {
    type: Number,
    default: 1,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
