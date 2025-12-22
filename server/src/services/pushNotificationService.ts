import prisma from "../lib/prisma.js";

export async function createFCMTokenForUser({
  userId,
  token,
  platform,
  identifier,
}: {
  userId: string;
  token: string;
  platform: string;
  identifier: string;
}) {
  const existingToken = await prisma.fCMToken.findFirst({
    where: { userId, platform, identifier },
    data: {
      token,
      lastUsedAt: new Date(),
      isValid: true,
    },
  });
  if (!existingToken) {
    await prisma.fCMToken.create({
      data: {
        token,
        userId,
        platform,
        lastUsedAt: new Date(),
        isValid: true,
      },
    });
  } else {
    await prisma.fCMToken.update({
      where: { id: existingToken.id },
      data: {
        token,
        lastUsedAt: new Date(),
        isValid: true,
      },
    });
  }
}
