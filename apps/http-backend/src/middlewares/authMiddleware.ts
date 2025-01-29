import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers["authorization"] ?? "";

  const verifiedUser = jwt.verify(token, JWT_SECRET);

  if (verifiedUser) {
    req.userId = (verifiedUser as JwtPayload).userId;
    next();
  } else {
    res.status(403).json({
      message: "You are not signed in",
    });
  }
}
