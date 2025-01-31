import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createUser(
  email: string,
  password: string,
  name: string
) {
  try {
    const response = await prisma.user.create({
      data: { email, password, name },
    });

    return response.id;
  } catch (e) {
    console.error(e);
    throw new Error("An error occured");
  }
}

export async function getUser(email: string) {
  try {
    const response = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!response) {
      return;
    }
    return response;
  } catch (e) {
    console.error(e);
    throw new Error("An error occured");
  }
}

export async function createRoom(slug: string, adminId: string) {
  try {
    const response = await prisma.room.create({
      data: {
        slug,
        adminId,
      },
    });

    return response;
  } catch (e) {
    console.error(e);
    throw new Error("An error occured");
  }
}

export async function getChats(roomId: number) {
  try {
    const response = await prisma.chat.findMany({
      where: { roomId },
    });

    return response;
  } catch (e) {
    console.error(e);
    throw new Error("An error occured");
  }
}
