import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./middlewares/authMiddleware";
import { JWT_SECRET } from "@repo/backend-common/config";
import bcrypt from "bcrypt";
import {
  CreateRoomSchema,
  CreateUserSchema,
  SigninSchema,
} from "@repo/common/types";
import { createUser, getUser, createRoom, getChats } from "@repo/db/client";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const app = express();

app.use(express.json());

app.post("/signup", async (req: Request, res: Response) => {
  const data = CreateUserSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      message: "invalid input",
    });
    return;
  }
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const photo = req.body.photo;

  const hashedPass = await bcrypt.hash(password, 10);

  const userId = await createUser(username, hashedPass, name, photo);
  res.json({
    userId,
  });
});

app.post("/signin", async (req: Request, res: Response) => {
  const data = SigninSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      message: "invalid input",
    });
    return;
  }

  const username = req.body.username;
  const password = req.body.password;

  const response = await getUser(username);
  if (!response) return;
  const isPasswordCorrect = await bcrypt.compare(password, response?.password);

  if (isPasswordCorrect) {
    const token = jwt.sign({ userId: response.id }, JWT_SECRET);
    res.json({
      token,
    });
  } else {
    res.status(403).json({
      message: "incorrect password",
    });
  }
});

app.post(
  "/create-room",
  authMiddleware,
  async (req: Request, res: Response) => {
    const data = CreateRoomSchema.safeParse(req.body);
    if (!data.success) {
      res.json({
        message: "invalid input",
      });
      return;
    }
    const response = await createRoom(req.body.name, req.userId as string);

    res.json({
      roomId: response.id,
    });
  }
);

app.get("/chats", authMiddleware, async (req: Request, res: Response) => {
  const roomId = req.params.room;

  const chats = await getChats(Number(roomId));

  res.json({
    chats,
  });
});

app.listen(3001);
