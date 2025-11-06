import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";
import "dotenv/config";

const app = new Hono();

// CORS global
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 86400,
    credentials: false,
  })
);

// tRPC sur /api/*
app.use(
  "/api/*",
  trpcServer({
    router: appRouter,
    createContext,
    onError(opts) {
      const { error, type, path } = opts;
      console.error("[tRPC Error]", {
        type,
        path,
        error: error.message,
        code: error.code,
      });
    },
  })
);

// Test simple
app.get("/api", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});

// Port Render
const port = process.env.PORT || 3000;
Bun.serve({
  port: Number(port),
  fetch: app.fetch,
});
console.log(`Server running on http://localhost:${port}`);

export default app;