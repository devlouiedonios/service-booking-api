import bcrypt from "bcrypt";
import { PasswordHasher } from "../PasswordHasher";

export class BcryptPasswordHasher implements PasswordHasher {
  private static readonly SALT_ROUNDS = 10;
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, BcryptPasswordHasher.SALT_ROUNDS);
  }

  verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
