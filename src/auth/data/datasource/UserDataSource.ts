import { NewUser } from "../../domain/NewUser";
import { User } from "../../domain/User";

export interface UserDataSource {
  findByEmail(email: string): Promise<User | null>;
  create(newUser: NewUser): Promise<User>;
  findByUserId(userId: string): Promise<User | null>;
}
