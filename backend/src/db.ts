import { Pool } from "pg";
import { config } from "./config.js";

export const db = new Pool({ connectionString: config.databaseUrl });

export async function query<T>(text: string, params: unknown[] = []): Promise<T[]> {
  const result = await db.query(text, params);
  return result.rows as T[];
}
