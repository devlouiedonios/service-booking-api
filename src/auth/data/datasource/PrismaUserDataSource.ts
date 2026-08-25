import { PrismaClient } from "@prisma/client";
import { NewUser } from "../../domain/NewUser";
import { User } from "../../domain/User";
import { UserDataSource } from "./UserDataSource";

export class PrismaUserDataSource implements UserDataSource {
  constructor(private db: PrismaClient) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.db.user.findUnique({
      where: { email },
    });
  }

  async create(newUser: NewUser): Promise<User> {
    return await this.db.user.create({
      data: {
        name: newUser.name,
        email: newUser.email,
        passwordHash: newUser.passwordHash,
      },
    });
  }

  async findByUserId(userId: string): Promise<User | null> {
    return await this.db.user.findUnique({ where: { id: userId } });
  }
}
