import express from "express";
import { logger } from "@repo/logger";
import cors from "cors";
import cookieParse from "cookie-parser";

import * as trpcExpress from "@trpc/server/adapters/express";
import { generateOpenApiDocument, createOpenApiExpressMiddleware } from "trpc-to-openapi";
import { apiReference } from "@scalar/express-api-reference";

import { serverRouter, createContext } from "@repo/trpc/server";

import { env } from "./env";

export const app = express();
app.set("trust proxy", 1);

const openApiDocument = generateOpenApiDocument(serverRouter, {
  title: "Mirai Forms Platform",
  version: "1.0.0",
  baseUrl: env.BASE_URL.concat("/api"),
});

// Manually inject security definitions for Bearer and Cookie authentication
openApiDocument.components = {
  ...openApiDocument.components,
  securitySchemes: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      description: "Enter your Clerk Session Token",
    },
    cookieAuth: {
      type: "apiKey",
      in: "cookie",
      name: "__session",
      description: "Clerk __session cookie value",
    },
  },
};

// Enable testing of protected operations in Scalar interactive client
openApiDocument.security = [{ bearerAuth: [] }, { cookieAuth: [] }];

const allowedOrigins = env.FRONTEND_URL.split(",").map((s) => s.trim()).filter(Boolean);
logger.info(`CORS allowed origins: ${JSON.stringify(allowedOrigins)}`);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (server-to-server, mobile, curl, health checks)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn(`CORS blocked request from origin: ${origin}`);
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
  }),
);

app.use(cookieParse());

app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ message: "Mirai Forms Platform is up and running..." });
});

app.get("/health", (req, res) => {
  return res.json({ message: "Mirai Forms Platform server is healthy", healthy: true });
});

logger.debug(`openapi.json: ${env.BASE_URL}/openapi.json`);
app.get("/openapi.json", (req, res) => {
  return res.json(openApiDocument);
});

logger.debug(`docs: ${env.BASE_URL}/docs`);
app.use("/docs", apiReference({ url: "/openapi.json" }));

app.use(
  "/api",
  createOpenApiExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

export default app;
