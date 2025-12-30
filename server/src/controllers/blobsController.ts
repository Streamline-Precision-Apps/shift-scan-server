import type { Request, Response } from "express";

import { uploadBlob, deleteBlob } from "../services/blobService.js";

export async function blobUpload(req: Request, res: Response) {
  try {
    const { userId, folder = "profileImages" } = req.body;
    const file = req.file;
    if (!userId || !file) {
      return res.status(400).json({ error: "Invalid request." });
    }
    // (Optional: Add authentication/authorization checks here)
    const result = await uploadBlob({ userId, file, folder });
    return res.status(200).json(result);
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function blobDelete(req: Request, res: Response) {
  try {
    const { userId, folder = "profileImages" } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "Invalid request." });
    }
    // (Optional: Add authentication/authorization checks here)
    const result = await deleteBlob({ userId, folder });
    if (result.error === "File not found") {
      return res.status(404).json({ error: "Resource not found." });
    }
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
