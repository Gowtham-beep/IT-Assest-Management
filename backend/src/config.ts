import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

type Config = {
  port: number;
  databaseUrl: string;
  redisUrl: string;
  accessSecret: string;
  refreshSecret: string;
  accessTtl: string;
  refreshDays: number;
  frontendUrl: string;
};

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

export const config: Config = {
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: required("DATABASE_URL", "postgresql://inventory:inventory@localhost:5432/inventory"),
  redisUrl: required("REDIS_URL", "redis://localhost:6379"),
  accessSecret: required("JWT_ACCESS_SECRET", "dev-access-secret"),
  refreshSecret: required("JWT_REFRESH_SECRET", "dev-refresh-secret"),
  accessTtl: required("JWT_ACCESS_TTL", "15m"),
  refreshDays: Number(process.env.JWT_REFRESH_TTL_DAYS ?? 7),
  frontendUrl: required("FRONTEND_URL", "http://localhost:3000")
};
