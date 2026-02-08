import jwt from "jsonwebtoken";
import { config } from "../config.js";

export type JwtPayload = {
  sub: string;
  tenantId: string;
  role: "admin" | "it_staff" | "manager" | "employee";
  email: string;
};

export function signAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, config.accessSecret, { expiresIn: config.accessTtl });
}

export function signRefreshToken(payload: JwtPayload) {
  return jwt.sign(payload, config.refreshSecret, {
    expiresIn: `${config.refreshDays}d`
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, config.accessSecret) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, config.refreshSecret) as JwtPayload;
}
