import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.token as string;

  const verifiedUser = jwt.verify(token, JWT_SECRET);

  if (verifiedUser) {
    req.body.id = verifiedUser;

    next();
  } else {
    res.status(403).json({
      message: "You are not signed in",
    });
  }
}
