import { NewUser } from "./NewUser";
import { User } from "./User";

export interface UserRepository {
  create(newUser: NewUser): Promise<User>;
  findByEmail(email: string): Promise<User | undefined>;
  findByUserId(userId: string): Promise<User | undefined>;
}
