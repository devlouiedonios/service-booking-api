import { UserRepository } from "../../domain/UserRepository";
import { UserDataSource } from "../datasource/UserDataSource";
import { User } from "../../domain/User";
import { NewUser } from "../../domain/NewUser";

export class UserRepositoryImpl implements UserRepository {
  constructor(private dataSource: UserDataSource) {}

  async create(newUser: NewUser): Promise<User> {
    return this.dataSource.create(newUser);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return (await this.dataSource.findByEmail(email)) ?? undefined;
  }

  async findByUserId(userId: string): Promise<User | undefined> {
    return (await this.dataSource.findByUserId(userId)) ?? undefined;
  }
}
