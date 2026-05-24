import { z } from "zod";

export const createUserwithEmailAndPasswordInput = z.object({
  fullName: z.string().describe("Full name of the user"),
  email: z.email().describe("Email address of the user"),
  password: z.string().describe("Password of the user"),
});

export type CreateUserwithEmailAndPasswordInputType = z.infer<
  typeof createUserwithEmailAndPasswordInput
>;

export const generateUserTokenPayload = z.object({
  id: z.string().describe("uuid of the user"),
});

export type GenerateUserTokenPayloadType = z.infer<typeof generateUserTokenPayload>;

export const signInUserWithEmailAndPasswordInput = z.object({
  email: z.email().describe("Email of the user"),
  password: z.string().describe("Password of the user"),
});

export type SignInUserWithEmailAndPasswordInputType = z.infer<
  typeof signInUserWithEmailAndPasswordInput
>;

export const syncClerkUserInput = z.object({
  id: z.string().min(1).describe("Clerk ID of the user"),
  fullName: z.string().min(1).describe("Full name of the user"),
  email: z.string().email().describe("Email address of the user"),
  profileImageUrl: z.string().optional().nullable().describe("Profile image URL of the user"),
});

export type SyncClerkUserInputType = z.infer<typeof syncClerkUserInput>;

