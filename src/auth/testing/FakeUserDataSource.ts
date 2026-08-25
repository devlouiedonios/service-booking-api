import { UserDataSource } from "../data/datasource/UserDataSource";
import { User } from "../domain/User";
import { NewUser } from "../domain/NewUser";
import { TEST_CREATED_AT } from "./TestConstants";

export class FakeUserDataSource implements UserDataSource {
  private users: User[] = [];
  private nextId = 1;

  async create({ name, email, passwordHash }: NewUser): Promise<User> {
    const user: User = {
      id: `user-${this.nextId.toString().padStart(3, "0")}`,
      name: name,
      email: email,
      passwordHash: passwordHash,
      createdAt: TEST_CREATED_AT,
    };
    this.nextId++;
    this.users.push(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((u) => u.email === email) ?? null;
  }

  async findByUserId(userId: string): Promise<User | null> {
    return this.users.find((u) => u.id === userId) ?? null;
  }

  deleteUser(userId: string): void {
    this.users = this.users.filter((u) => u.id !== userId);
  }
}
