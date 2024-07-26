export interface UserRespose {
  jwt: string;
  user: User;
}

export interface User {
  id: bigint;
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
  id: bigint;
  key: string;
  created_at: Date;
}

export interface Connection {
  id: bigint;
  url: string;
  created_at: Date;
}
