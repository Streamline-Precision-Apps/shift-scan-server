
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="94ddb610-56b2-5f98-a836-a5a38f2b55c7")}catch(e){}}();
import prisma from "../lib/prisma.js";
import { v4 as uuidv4 } from "uuid";
import { sendPasswordResetEmail } from "../lib/mail.js";
export async function saveFCMToken(req, res) {
    const userId = req.user?.id; // assuming verifyToken middleware sets req.user
    const { token } = req.body;
    if (!userId) {
        return res
            .status(401)
            .json({ success: false, error: "No authenticated user" });
    }
    if (!token) {
        return res.status(400).json({ success: false, error: "No token provided" });
    }
    try {
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
        return res.json({ success: true });
    }
    catch (error) {
        console.error("Error saving FCM token:", error);
        return res
            .status(500)
            .json({ success: false, error: "Failed to save FCM token" });
    }
}
/**
 * POST /api/tokens/password-reset
 * Request password reset email by providing an email address
 */
export async function requestPasswordReset(req, res) {
    try {
        const { email } = req.body;
        if (!email) {
            console.warn("❌ Password reset request: Missing email");
            return res.status(400).json({ error: "Email is required" });
        }
        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            console.warn(`❌ Password reset request: User not found for email: ${email}`);
            // Don't reveal if email exists or not (security best practice)
            return res.status(200).json({
                success: true,
                message: "If an account exists with this email, a reset link will be sent.",
            });
        }
        // Delete any existing tokens for this email
        const existingToken = await prisma.passwordResetToken.findFirst({
            where: { email },
        });
        if (existingToken) {
            await prisma.passwordResetToken.delete({
                where: { id: existingToken.id },
            });
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
        }
        catch (emailError) {
            console.error(`❌ Failed to send password reset email to ${email}:`, emailError);
            // Delete the token if email fails to send
            await prisma.passwordResetToken.delete({
                where: { id: passwordResetToken.id },
            });
            return res.status(500).json({
                error: "Failed to send reset email. Please try again.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "If an account exists with this email, a reset link will be sent.",
        });
    }
    catch (error) {
        console.error("❌ Error in requestPasswordReset:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
/**
 * POST /api/tokens/reset-password
 * Reset user password using the reset token
 */
export async function resetPassword(req, res) {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            console.warn("❌ Reset password: Missing token or password");
            return res.status(400).json({ error: "Token and password are required" });
        }
        if (password.length < 6) {
            return res
                .status(400)
                .json({ error: "Password must be at least 6 characters" });
        }
        // Find and validate token
        const resetTokenRecord = await prisma.passwordResetToken.findUnique({
            where: { token },
        });
        if (!resetTokenRecord) {
            console.warn(`❌ Invalid password reset token: ${token}`);
            return res.status(400).json({ error: "Invalid or expired reset token" });
        }
        // Check if token is expired
        if (resetTokenRecord.expiration < new Date()) {
            console.warn(`❌ Password reset token expired for: ${resetTokenRecord.email}`);
            // Delete expired token
            await prisma.passwordResetToken.delete({
                where: { id: resetTokenRecord.id },
            });
            return res.status(400).json({ error: "Reset token has expired" });
        }
        // Find user
        const user = await prisma.user.findUnique({
            where: { email: resetTokenRecord.email },
        });
        if (!user) {
            console.warn(`❌ User not found for email: ${resetTokenRecord.email}`);
            return res.status(400).json({ error: "User not found" });
        }
        await prisma.user.update({
            where: { id: user.id },
            data: { password }, // ⚠️ TODO: Hash password before storing
        });
        // Delete used token
        await prisma.passwordResetToken.delete({
            where: { id: resetTokenRecord.id },
        });
        return res.status(200).json({
            success: true,
            message: "Password reset successfully. Please sign in with your new password.",
        });
    }
    catch (error) {
        console.error("❌ Error in resetPassword:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
/**
 * GET /api/tokens/verify-reset-token/:token
 * Verify if a reset token is valid
 */
export async function verifyResetToken(req, res) {
    try {
        const { token } = req.params;
        if (!token) {
            return res.status(400).json({ error: "Token is required" });
        }
        const resetTokenRecord = await prisma.passwordResetToken.findUnique({
            where: { token },
        });
        if (!resetTokenRecord) {
            console.warn(`❌ Invalid token: ${token}`);
            return res.status(400).json({ valid: false, error: "Invalid token" });
        }
        if (resetTokenRecord.expiration < new Date()) {
            console.warn(`❌ Token expired: ${token}`);
            await prisma.passwordResetToken.delete({
                where: { id: resetTokenRecord.id },
            });
            return res.status(400).json({ valid: false, error: "Token expired" });
        }
        return res.status(200).json({
            valid: true,
            email: resetTokenRecord.email,
        });
    }
    catch (error) {
        console.error("❌ Error verifying reset token:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
/**
 * DELETE /api/tokens/reset/:token
 * Delete a password reset token by token
 */
export async function deleteResetToken(req, res) {
    try {
        const { token } = req.params;
        if (!token) {
            console.warn("❌ Delete reset token: Missing token");
            return res.status(400).json({ error: "Token is required" });
        }
        // Find the token record
        const resetTokenRecord = await prisma.passwordResetToken.findUnique({
            where: { token },
        });
        if (!resetTokenRecord) {
            console.warn(`❌ Reset token not found: ${token}`);
            return res.status(404).json({ error: "Token not found" });
        }
        // Delete the token
        await prisma.passwordResetToken.delete({
            where: { id: resetTokenRecord.id },
        });
        return res.status(200).json({
            success: true,
            message: "Token deleted successfully",
        });
    }
    catch (error) {
        console.error("❌ Error deleting reset token:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
//# sourceMappingURL=tokenController.js.map
//# debugId=94ddb610-56b2-5f98-a836-a5a38f2b55c7
