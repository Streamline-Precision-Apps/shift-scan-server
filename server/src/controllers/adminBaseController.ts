import express from "express";
import {
  fetchNotificationServiceByUserId,
  getDashboardData,
  getUserTopicPreferences,
} from "../services/adminBaseService.js";

export const baseController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { userId, resolvedSince } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId parameter" });
    }

    if (typeof userId !== "string") {
      return res.status(400).json({ error: "userId must be a string" });
    }

    const result = await fetchNotificationServiceByUserId(
      userId,
      resolvedSince as string | undefined
    );
    return res.json(result);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getDashboardDataController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId parameter" });
    }

    if (typeof userId !== "string") {
      return res.status(400).json({ error: "userId must be a string" });
    }

    const result = await getDashboardData(userId);
    return res.json(result);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserTopicPreferencesController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId parameter" });
    }

    if (typeof userId !== "string") {
      return res.status(400).json({ error: "userId must be a string" });
    }

    const result = await getUserTopicPreferences(userId);
    return res.json(result);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
