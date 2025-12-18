import prisma from "../lib/prisma.js";
import { v4 as uuidv4 } from "uuid";
import { sendPasswordResetEmail } from "../lib/mail.js";
import { success } from "zod";

/**
 * Save or update a user's FCM token
 */
export async function saveUserFCMToken({
  userId,
  token,
}: {
  userId: string;
  token: string;
}) {
  await prisma.fCMToken.deleteMany({ where: { userId } });
  await prisma.fCMToken.create({
    data: {
      token,
      userId,
      platform: "web",
      lastUsedAt: new Date(),
      isValid: true,
    },
  });
}

/**
 * Request password reset service
 */
export async function requestPasswordResetService(email: string) {
  // Check if user exists
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return {
      success: true,
      message:
        "If an account exists with this email, a reset link will be sent.",
    };
  }
  // Delete any existing tokens for this email
  const existingToken = await prisma.passwordResetToken.findFirst({
    where: { email },
  });
  if (existingToken) {
    await prisma.passwordResetToken.delete({ where: { id: existingToken.id } });
  }
  // Generate new reset token
  const resetToken = uuidv4();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  const passwordResetToken = await prisma.passwordResetToken.create({
    data: {
      email,
      token: resetToken,
      expiration: expiresAt,
    },
  });
  // Send reset email
  try {
    await sendPasswordResetEmail(email, resetToken);
  } catch (emailError) {
    // Delete the token if email fails to send
    await prisma.passwordResetToken.delete({
      where: { id: passwordResetToken.id },
    });
    return {
      status: 500,
      error: "Internal server error.",
    };
  }
  return {
    success: true,
    message: "If an account exists with this email, a reset link will be sent.",
  };
}

/**
 * Reset password service
 */
export async function resetPasswordService(token: string, password: string) {
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters", status: 400 };
  }
  // Find and validate token
  const resetTokenRecord = await prisma.passwordResetToken.findUnique({
    where: { token },
  });
  if (!resetTokenRecord) {
    return { error: "Invalid request", status: 400 };
  }
  // Check if token is expired
  if (resetTokenRecord.expiration < new Date()) {
    await prisma.passwordResetToken.delete({
      where: { id: resetTokenRecord.id },
    });
    return { error: "Invalid request", status: 400 };
  }
  // Find user
  const user = await prisma.user.findUnique({
    where: { email: resetTokenRecord.email },
  });
  if (!user) {
    return { error: "Unauthorized request.", status: 401 };
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { password }, // ⚠️ TODO: Hash password before storing
  });
  // Delete used token
  await prisma.passwordResetToken.delete({
    where: { id: resetTokenRecord.id },
  });
  return {
    success: true,
    message:
      "Password reset successfully. Please sign in with your new password.",
  };
}

/**
 * Verify reset token service
 */
export async function verifyResetTokenService(token: string) {
  const resetTokenRecord = await prisma.passwordResetToken.findUnique({
    where: { token },
  });
  if (!resetTokenRecord) {
    return {
      success: false,
      valid: false,
      error: "Invalid request",
      status: 400,
    };
  }
  if (resetTokenRecord.expiration < new Date()) {
    await prisma.passwordResetToken.delete({
      where: { id: resetTokenRecord.id },
    });
    return {
      success: false,
      valid: false,
      error: "Invalid request",
      status: 400,
    };
  }
  return {
    success: true,
    valid: true,
    email: resetTokenRecord.email,
  };
}

/**
 * Delete reset token service
 */
export async function deleteResetTokenService(token: string) {
  // Find the token record
  const resetTokenRecord = await prisma.passwordResetToken.findUnique({
    where: { token },
  });
  if (!resetTokenRecord) {
    return { error: "Invalid request", status: 404 };
  }
  await prisma.passwordResetToken.delete({
    where: { id: resetTokenRecord.id },
  });
  return {
    success: true,
    message: "Token deleted successfully",
  };
}
