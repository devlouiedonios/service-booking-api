export interface RefreshToken {
  userId: string;
  hashedToken: string;
  expiresAt: Date;
  createdAt: Date;
}
