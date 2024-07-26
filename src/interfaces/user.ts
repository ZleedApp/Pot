export interface UserRespose {
  jwt: string;
  user: User;
}

export interface User {
  id: BigInt;
  username: string;
  displayName: string;
  email: string;
  avatar: string;
  banner: string;
  badges: bigint[];
  streamTitle: string;
  streamKeys: StreamKey[];
  connections: Connection[];
  lastLive: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface StreamKey {
  id: BigInt;
  key: string;
  created_at: Date;
}

export interface Connection {
  id: BigInt;
  url: string;
  created_at: Date;
}
