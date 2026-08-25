export interface NewRefreshToken {
  userId: string;
  hashedToken: string;
  expiresAt: Date;
}
