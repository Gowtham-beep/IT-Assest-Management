import cors from "cors";
import express from "express";
import { config } from "./config.js";
import { errorHandler } from "./middleware/error.js";
import { tenantFromSubdomain } from "./middleware/tenant.js";
import routes from "./routes/index.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: config.frontendUrl, credentials: true }));
  app.use(express.json());
  app.use(tenantFromSubdomain);

  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.use("/api", routes);
  app.use(errorHandler);

  return app;
}
