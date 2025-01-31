import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./middlewares/authMiddleware";
import { JWT_SECRET } from "@repo/backend-common/config";
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
  const parsedData = CreateUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "invalid input",
    });
    return;
  }
  const username = parsedData.data.username;
  const password = parsedData.data.password;
  const name = parsedData.data.name;

  try {
    await createUser(username, password, name);
    res.json({
      message: "You are signed up",
    });
  } catch (e) {
    res.status(411).json({
      message: "User already exists",
    });
  }
});

app.post("/signin", async (req: Request, res: Response) => {
  const data = SigninSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      message: "invalid input",
    });
    return;
  }

  try {
    const username = data.data.username;
    const password = data.data.password;

    const response = await getUser(username);
    if (!response) return;

    if (response.password === password) {
      const token = jwt.sign({ userId: response.id }, JWT_SECRET);
      res.json({
        token,
      });
    } else {
      res.status(403).json({
        message: "incorrect password",
      });
    }
  } catch (e) {
    res.status(411).json({
      message: "Incorrect username or password",
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
    try {
      const response = await createRoom(data.data.name, req.userId as string);

      res.json({
        roomId: response.id,
      });
    } catch (e) {
      res.status(411).json({
        message: "An error occured, please try again later",
      });
    }
  }
);

app.get("/chats", authMiddleware, async (req: Request, res: Response) => {
  const roomId = req.params.room;

  try {
    const chats = await getChats(Number(roomId));

    res.json({
      chats,
    });
  } catch (e) {
    res.status(404).json({
      message: "An error occured",
    });
  }
});

app.listen(3001);
