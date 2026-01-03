import jwt from "jsonwebtoken";

/**
 * Extracts and verifies the user from the Authorization header.
 * @param req The incoming request
 * @returns The decoded user payload or null/throws if invalid
 */
export function getUserFromToken(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];
  if (!token) return null;

  try {
    const secret = process.env.JWT_SECRET || "mysecretkey";
    return jwt.verify(token, secret) as {
      userId: number;
      email: string;
    };
  } catch (error) {
    // If token is invalid or expired, verify throws
    throw new Error("Invalid token");
  }
}
