import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createUser(
  username: string,
  password: string,
  name: string
) {
  const response = await prisma.user.create({
    data: { username, password, name },
  });

  return response.id;
}

export async function getUser(username: string) {
  const response = await prisma.user.findFirst({
    where: {
      username,
    },
  });

  if (!response) {
    return;
  }
  return response;
}

export async function createRoom(roomname: string) {
  const response = await prisma.room.create({
    data: {
      roomname,
    },
  });

  return response;
}
