import jwt from "jsonwebtoken"; // npm install jsonwebtoken
import { User } from "@prisma/client";

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET!;

export function generateTokens(user: User) {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string) {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch {
    return null;
  }
} 