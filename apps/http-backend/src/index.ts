import express, { Request, Response } from "express";
import { Jwt } from "jsonwebtoken";

const app = express();

app.use(express.json());

app.post("/signup", (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;

  res.json({
    message: "You are signed up",
  });
});

app.post("/signin", (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;

  res.json({
    message: "You are signed in",
  });
});

app.post("/create-room", (req: Request, res: Response) => {});

app.listen(3001);
