import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { verifyToken, createClerkClient } from "@clerk/backend";
import { createCookieFactory, getCookieFactory, clearCookieFactory } from "./utils/cookie";
import { db, eq } from "@repo/database";
import { usersTable } from "@repo/database/models/user";
import { userService } from "./services";

export interface TRPCContext {
  createCookie: ReturnType<typeof createCookieFactory>;
  getCookie: ReturnType<typeof getCookieFactory>;
  clearCookie: ReturnType<typeof clearCookieFactory>;
  userId: string | null;
  ip: string;
  userAgent: string;
}

export async function createContext({
  req,
  res,
}: CreateExpressContextOptions): Promise<TRPCContext> {
  let userId: string | null = null;

  const authHeader = req.headers.authorization;
  const sessionToken =
    authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : req.cookies?.["__session"];

  if (sessionToken) {
    try {
      const jwtKey = process.env.CLERK_JWT_KEY;
      const secretKey = process.env.CLERK_SECRET_KEY;

      if (jwtKey) {
        const claims = await verifyToken(sessionToken, { jwtKey });
        userId = claims.sub;
      } else if (secretKey) {
        const claims = await verifyToken(sessionToken, { secretKey });
        userId = claims.sub;
      }
    } catch {
      // Token invalid or expired — leave userId null
    }
  }

  if (userId) {
    try {
      const existingUser = await db.select().from(usersTable).where(eq(usersTable.id, userId));
      
      if (!existingUser || existingUser.length === 0) {
        const secretKey = process.env.CLERK_SECRET_KEY;
        if (secretKey) {
          const clerk = createClerkClient({ secretKey });
          const clerkUser = await clerk.users.getUser(userId);
          
          const email = clerkUser.emailAddresses[0]?.emailAddress;
          const fullName = [clerkUser.firstName, clerkUser.lastName]
            .filter(Boolean)
            .join(" ")
            .trim() || "Clerk User";
          const profileImageUrl = clerkUser.imageUrl;

          if (email) {
            await userService.syncClerkUser({
              id: userId,
              email,
              fullName,
              profileImageUrl: profileImageUrl || null,
            });
          }
        }
      }
    } catch (error) {
      console.error("Error auto-syncing Clerk user in tRPC context:", error);
    }
  }

  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    req.ip ||
    "127.0.0.1";
  const userAgent = req.headers["user-agent"] || "unknown";

  const ctx: TRPCContext = {
    createCookie: createCookieFactory(res),
    getCookie: getCookieFactory(req),
    clearCookie: clearCookieFactory(res),
    userId,
    ip,
    userAgent,
  };
  return ctx;
}

export type Context = Awaited<ReturnType<typeof createContext>>;
