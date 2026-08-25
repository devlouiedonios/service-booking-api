import { UserRepository } from "../domain/UserRepository";
import { NewUser } from "../domain/NewUser";
import { User } from "../domain/User";
import { TEST_CREATED_AT } from "./TestConstants";

export class FakeUserRepository implements UserRepository {
  private users: User[] = [];
  async create({ name, email, passwordHash }: NewUser): Promise<User> {
    const user: User = {
      id: "user-001",
      name,
      email,
      passwordHash,
      createdAt: TEST_CREATED_AT,
    };
    this.users.push(user);
    return user;
  }
  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((u) => u.email === email);
  }
  async findByUserId(userId: string): Promise<User | undefined> {
    return this.users.find((u) => u.id === userId);
  }
}
