import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
  },
  taskTitle: {
    type: String,
    required: true,
  },
  taskDescription: {
    type: String,
    required: true,
  },
  followFarcasterId: {
    type: String,
    required: true,
  },
  totalParticipants: {
    type: Number,
    required: true,
  },
  totalPool: {
    type: Number,
    required: true,
  },
  remainingSlots: {
    type: Number,
    required: true,
  },
});

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);
