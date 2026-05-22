import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { verifyToken } from "@clerk/backend";
import { createCookieFactory, getCookieFactory, clearCookieFactory } from "./utils/cookie";

export interface TRPCContext {
  createCookie: ReturnType<typeof createCookieFactory>;
  getCookie: ReturnType<typeof getCookieFactory>;
  clearCookie: ReturnType<typeof clearCookieFactory>;
  userId: string | null;
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

  const ctx: TRPCContext = {
    createCookie: createCookieFactory(res),
    getCookie: getCookieFactory(req),
    clearCookie: clearCookieFactory(res),
    userId,
  };
  return ctx;
}

export type Context = Awaited<ReturnType<typeof createContext>>;
