import express from "express";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../lib/prisma.js";
import config from "../lib/config.js";
import type { JwtPayload } from "jsonwebtoken";

dotenv.config();

interface JwtUserPayload {
  id: string;
}
interface AuthJwtPayload extends JwtPayload {
  id: string;
}

export const loginUser = async (
  req: express.Request,
  res: express.Response
) => {
  const { username, password } = req.body as {
    username: string;
    password: string;
  };

  // 1. Check for missing credentials
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, error: "Missing credentials" });

  try {
    // 2. Find user by username
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user)
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });

    // 3. Verify password
    const validPassword = await compare(password, user.password);
    if (!validPassword)
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });

    const payload: JwtUserPayload = {
      id: user.id,
    };
    // create JWT token
    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiration, // 30 days
    });

    const isProd = process.env.NODE_ENV === "production";

    // set token in httpOnly cookie so client can send it with requests
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: isProd ? "none" : "lax", // necessary for cross-site cookies with credentials: 'include'
      maxAge: config.jwtExpiration * 1000, // convert seconds -> ms
    } as const;

    // name the cookie `token`; this allows the middleware to read it as a fallback
    res.cookie("session", token, cookieOptions);

    // Return simplified user object with ID (full user will be fetched via /api/v1/init)
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        accountSetup: user.accountSetup,
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

export const signOutUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    // Get all cookies from the request
    const cookies = req.cookies || {};
    // Clear all cookies except 'locale'
    Object.keys(cookies).forEach((cookieName) => {
      if (cookieName !== "locale") {
        res.clearCookie(cookieName, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "none",
        });
      }
    });
    return res.status(200).json({ message: "Sign out successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getSession = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const token = req.cookies.session;
    if (!token) {
      return res.status(200).json({ user: null });
    }
    const decoded = jwt.verify(token, config.jwtSecret);
    if (typeof decoded !== "object" || !("id" in decoded)) {
      return res.status(200).json({ user: null });
    }
    const payload = decoded as AuthJwtPayload;

    return res.status(200).json({
      user: {
        id: payload.id,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
