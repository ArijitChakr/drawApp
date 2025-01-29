import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createUser(
  email: string,
  password: string,
  name: string,
  photo: string
) {
  const response = await prisma.user.create({
    data: { email, password, name, photo },
  });

  return response.id;
}

export async function getUser(email: string) {
  const response = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!response) {
    return;
  }
  return response;
}

export async function createRoom(slug: string, adminId: string) {
  const response = await prisma.room.create({
    data: {
      slug,
      adminId,
    },
  });

  return response;
}

export async function getChats(roomId: number) {
  const response = await prisma.chat.findMany({
    where: { roomId },
  });

  return response;
}
