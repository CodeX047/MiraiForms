import { createHmac, randomBytes } from "node:crypto";
import * as JWT from "jsonwebtoken";
import {
  type CreateUserwithEmailAndPasswordInputType,
  GenerateUserTokenPayloadType,
  SignInUserWithEmailAndPasswordInputType,
  createUserwithEmailAndPasswordInput,
  generateUserTokenPayload,
  signInUserWithEmailAndPasswordInput,
  syncClerkUserInput,
  type SyncClerkUserInputType,
} from "./model";
import { db, eq } from "@repo/database";
import { usersTable } from "@repo/database/models/user";
import { env } from "../env";

class UserService {
  private async getUserByEmail(email: string) {
    const result = await db.select().from(usersTable).where(eq(usersTable.email, email));

    if (!result || result.length === 0) return null;

    return result[0];
  }

  private async generateUserToken(payload: GenerateUserTokenPayloadType) {
    const { id } = await generateUserTokenPayload.parseAsync(payload);

    const token = JWT.sign({ id }, env.JWT_SECRET);
    return {
      token,
    };
  }

  private async verifyUserToken(token: string): Promise<GenerateUserTokenPayloadType> {
    try {
      const verificationResult = JWT.verify(token, env.JWT_SECRET) as GenerateUserTokenPayloadType;

      return verificationResult;
    } catch (error) {
      throw new Error("Invaild Token");
    }
  }

  private async getUserInfoById(id: string) {
    const user = await db
      .select({
        id: usersTable.id,
        fullName: usersTable.fullName,
        email: usersTable.email,
        profileImageUrl: usersTable.profileImageUrl,
      })
      .from(usersTable)
      .where(eq(usersTable.id, id));

    if (!user || user.length === 0) throw new Error(`User with Id: ${id} does not exists`);

    return user[0]!;
  }

  private async generateHash(salt: string, password: string) {
    return createHmac("sha256", salt).update(password).digest("hex");
  }

  public async createUserwithEmailAndPassword(payload: CreateUserwithEmailAndPasswordInputType) {
    const { fullName, email, password } =
      await createUserwithEmailAndPasswordInput.parseAsync(payload);

    const existingUserByEmail = await this.getUserByEmail(email);

    if (existingUserByEmail) throw new Error(`User with email ${email} already exists`);

    const salt = randomBytes(16).toString("hex");
    const hash = await this.generateHash(salt, password);

    const userInsertResult = await db
      .insert(usersTable)
      .values({ email, fullName, password: hash, salt })
      .returning({
        id: usersTable.id,
      });

    if (!userInsertResult || userInsertResult.length === 0 || !userInsertResult[0]?.id)
      throw new Error("Something went wrong while creating a user");
    const userId = userInsertResult[0].id;
    const { token } = await this.generateUserToken({ id: userId });

    return {
      id: userId,
      token,
    };
  }

  public async signInUserWithEmailAndPassword(payload: SignInUserWithEmailAndPasswordInputType) {
    const { email, password } = await signInUserWithEmailAndPasswordInput.parseAsync(payload);

    const existingUser = await this.getUserByEmail(email);

    if (!existingUser) throw new Error(`User with email ${email} does not exists`);

    if (!existingUser.password || !existingUser.salt)
      throw new Error(`Invaild authentication method`);

    const hash = await this.generateHash(existingUser.salt, password);

    if (hash !== existingUser.password) throw new Error("Invalid email address or password");

    const { token } = await this.generateUserToken({ id: existingUser.id });

    return {
      id: existingUser.id,
      token,
    };
  }

  public async verifyAndDecodeUserToken(token: string) {
    const { id } = await this.verifyUserToken(token);

    const userInfo = await this.getUserInfoById(id);

    return { ...userInfo };
  }

  public async syncClerkUser(payload: SyncClerkUserInputType) {
    const { id, fullName, email, profileImageUrl } = await syncClerkUserInput.parseAsync(payload);

    // 1. Try finding by Clerk ID
    const existingById = await db.select().from(usersTable).where(eq(usersTable.id, id));

    if (existingById && existingById.length > 0) {
      const updateResult = await db
        .update(usersTable)
        .set({
          fullName,
          email,
          profileImageUrl: profileImageUrl || null,
        })
        .where(eq(usersTable.id, id))
        .returning({ id: usersTable.id });

      if (!updateResult || updateResult.length === 0) {
        throw new Error("Failed to update synced Clerk user by ID");
      }
      return { id: updateResult[0]!.id, created: false };
    }

    // 2. Not found by Clerk ID. Check if a record exists with the same email
    const existingByEmail = await db.select().from(usersTable).where(eq(usersTable.email, email));

    if (existingByEmail && existingByEmail.length > 0) {
      // Exists by email: Update the ID to the Clerk ID, and update details (merging account)
      const updateResult = await db
        .update(usersTable)
        .set({
          id, // Update primary key to Clerk ID
          fullName,
          profileImageUrl: profileImageUrl || null,
        })
        .where(eq(usersTable.email, email))
        .returning({ id: usersTable.id });

      if (!updateResult || updateResult.length === 0) {
        throw new Error("Failed to update synced Clerk user ID by email");
      }
      return { id: updateResult[0]!.id, created: false };
    }

    // 3. Brand new user (neither ID nor email exists): Insert
    const insertResult = await db
      .insert(usersTable)
      .values({
        id,
        fullName,
        email,
        profileImageUrl: profileImageUrl || null,
      })
      .returning({ id: usersTable.id });

    if (!insertResult || insertResult.length === 0) {
      throw new Error("Failed to insert synced Clerk user");
    }
    return { id: insertResult[0]!.id, created: true };
  }
}

export default UserService;
