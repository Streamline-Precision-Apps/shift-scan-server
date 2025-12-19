import { z } from "zod";

// /send-multicast
export const sendMulticastSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  link: z.string().nullable().optional(),
  referenceId: z.string().optional(),
});

// /topics, /subscribe-to-topic, /unsubscribe-from-topic
export const topicsSchema = z.object({
  action: z.enum(["subscribe", "unsubscribe"]),
  topics: z.array(z.string().min(1)),
  token: z.string().min(1, "Device token is required"),
  userId: z.string().min(1, "User ID is required").optional(),
});

// /mark-read

export const markReadSchema = z.object({
  markAll: z.boolean().nullable().optional(),
  notificationId: z.coerce.number().int().positive().nullable().optional(),
  brokenEquipment: z.boolean().nullable().optional(),
  userId: z.string().min(1, "User ID is required"),
});
