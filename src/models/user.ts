import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: {
    type: BigInt,
    required: true,
    index: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: 'default.png'
  },
  banner: {
    type: String,
    default: 'default.png'
  },
  badges: {
    type: [BigInt],
    default: []
  },
  streamTitle: {
    type: String,
    default: 'Untitled Stream'
  },
  streamKeys: {
    type: [
      {
        id: BigInt,
        key: String,
        created_at: {
          type: Date,
          default: Date.now()
        }
      }
    ],
    default: []
  },
  connections: {
    type: [
      {
        id: BigInt,
        url: String,
        created_at: {
          type: Date,
          default: Date.now()
        }
      }
    ],
    default: []
  },
  lastLive: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
});

export default mongoose.model('User', UserSchema);
