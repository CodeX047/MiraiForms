import { httpLink, httpBatchStreamLink } from "@repo/trpc/client";
import { env } from "~/env.js";

interface CreateTRPCHttpBatchClientClientOpts {
  enableStreaming?: boolean;
  getToken?: () => Promise<string | null>;
}

export const createTRPCHttpBatchClientClient = (opts?: CreateTRPCHttpBatchClientClientOpts) => {
  const c = opts?.enableStreaming ? httpBatchStreamLink : httpLink;
  return c({
    url: env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/trpc",
    async fetch(url, options) {
      const token = opts?.getToken ? await opts.getToken() : null;
      return fetch(url, {
        ...options,
        credentials: "omit",
        headers: {
          ...options?.headers,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    },
  });
};
