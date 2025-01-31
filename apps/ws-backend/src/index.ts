import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const wss = new WebSocketServer({ port: 8080 });

const users: User[] = [];

function checkUser(token: string): null | string {
  const decoded = jwt.verify(token, JWT_SECRET);

  if (typeof decoded === "string") {
    return null;
  }
  if (!decoded || !decoded.userId) {
    return null;
  }

  return decoded.userId;
}

wss.on("connection", function connection(ws, request) {
  const url = request.url;

  if (!url) {
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") ?? "";
  const userId = checkUser(token);

  if (userId == null) {
    ws.close();
    return;
  }

  users.push({
    userId,
    rooms: [],
    ws,
  });

  ws.on("message", function message(data) {
    ws.send("pong");
  });
});
