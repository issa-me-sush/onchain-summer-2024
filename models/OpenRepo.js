import mongoose from 'mongoose';

const OpenRepoSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  repoName: {
    type: String,
    required: true,
  },
  repoUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,

  },
}, { timestamps: true });

export default mongoose.models.OpenRepo || mongoose.model('OpenRepo', OpenRepoSchema);
