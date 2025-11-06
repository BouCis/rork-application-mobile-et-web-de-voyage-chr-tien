import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

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

// tRPC monté sur /api/trpc/*
app.use(
  "/api/trpc/*",
  trpcServer({
    router: appRouter,
    createContext,
    endpoint: "/api/trpc", // FIX : Strip le prefix pour mapper "status"
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

// Route de test simple
app.get("/api", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});

export default app;