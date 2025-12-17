import { z } from "zod";

// Contact information schema
export const ContactUpdateSchema = z.object({
  phoneNumber: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyContactNumber: z.string().optional(),
});

// User settings schema
export const UserSettingsUpdateSchema = z.object({
  language: z.string().optional(),
  cameraAccess: z.boolean().optional(),
  locationAccess: z.boolean().optional(),
  generalReminders: z.boolean().optional(),
  personalReminders: z.boolean().optional(),
  cookiesAccess: z.boolean().optional(),
});

// Main user update schema (only requested fields)
export const updateUserSchema = z.object({
  image: z.string().optional(),
  signature: z.string().optional(),
  password: z.string().min(8).optional(),
  accountSetup: z.boolean().optional(),
  email: z.string().email().optional(),
  DOB: z.string().optional(),
  Contact: ContactUpdateSchema.optional(),
  UserSettings: UserSettingsUpdateSchema.optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const postContact = z.object({
  userId: z.string().min(1, "userId is required"),
});
export type PostContactInput = z.infer<typeof postContact>;

// Schema for user settings update (matches UserSettings type)
export const updateUserSettingsSchema = z.object({
  userId: z.string().min(1, "userId is required"),
  phoneNumber: z.string().optional(),
  email: z.string().email().optional(),
  emergencyContact: z.string().optional(),
  emergencyContactNumber: z.string().optional(),
  language: z.string().optional(),
  personalReminders: z.boolean().optional(),
  generalReminders: z.boolean().optional(),
  cameraAccess: z.boolean().optional(),
  locationAccess: z.boolean().optional(),
  cookiesAccess: z.boolean().optional(),
});

export type UpdateUserSettingsSchemaInput = z.infer<
  typeof updateUserSettingsSchema
>;

export const emptyBodySchema = z.object({}).strict();
export type EmptyBodyInput = z.infer<typeof emptyBodySchema>;
