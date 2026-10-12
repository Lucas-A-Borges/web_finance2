import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-c1153085/health", (c) => {
  return c.json({ status: "ok" });
});

app.post("/make-server-c1153085/finance-data", async (c) => {
  try {
    const payload = await c.req.json();
    await kv.set("finance:lucas", {
      ...payload,
      updatedAt: new Date().toISOString(),
    });
    return c.json({ success: true });
  } catch (error) {
    console.log("Erro ao salvar dados financeiros:", error);
    return c.json({ success: false, error: "Não foi possível salvar os dados." }, 500);
  }
});

Deno.serve(app.fetch);
