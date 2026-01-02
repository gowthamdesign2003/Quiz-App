// import jwt from "jsonwebtoken";

// export const generateToken = (userId: number) => {
//   return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "7d" });
// };

// export const verifyToken = (token: string) => {
//   return jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
// };
import jwt from "jsonwebtoken";

export function getUserFromToken(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];
  if (!token) return null;

  return jwt.verify(token, process.env.JWT_SECRET!) as {
    userId: number;
  };
}
