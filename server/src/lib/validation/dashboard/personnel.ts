import { z } from "zod";

/**
 * Zod schema for creating a user (admin)
 * Used for POST /createUserAdmin
 */
export const createUserAdminSchema = z.object({
  terminationDate: z.union([z.iso.datetime().nullable(), z.null()]).optional(),
  createdById: z.string().min(1, "createdById is required"),
  username: z.string().min(1, "username is required"),
  firstName: z.string().min(1, "firstName is required"),
  middleName: z.string().optional().nullable(),
  lastName: z.string().min(1, "lastName is required"),
  secondLastName: z.string().optional().nullable(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  permission: z.string().min(1, "permission is required"),
  truckView: z.boolean(),
  tascoView: z.boolean(),
  mechanicView: z.boolean(),
  laborView: z.boolean(),
  crews: z.array(z.object({ id: z.string().min(1) })).optional(),
});

/**
 * Zod schema for editing a user (admin)
 * Used for PUT /editUserAdmin/:id
 */
export const editUserAdminSchema = z.object({
  id: z.string().min(1, "id is required"),
  terminationDate: z
    .union([z.string().datetime().nullable(), z.null()])
    .optional(),
  username: z.string().min(1, "username is required"),
  firstName: z.string().min(1, "firstName is required"),
  middleName: z.string().optional().nullable(),
  lastName: z.string().min(1, "lastName is required"),
  secondLastName: z.string().optional().nullable(),
  permission: z.string().min(1, "permission is required"),
  truckView: z.boolean(),
  tascoView: z.boolean(),
  mechanicView: z.boolean(),
  laborView: z.boolean(),
  crews: z.array(z.object({ id: z.string().min(1) })).optional(),
});

/**
 * Zod schema for creating a crew
 * Used for POST /createCrew
 */
export const createCrewSchema = z.object({
  name: z.string().min(1, "Crew name is required"),
  Users: z.string().min(2, "Users (JSON string) is required"),
  leadId: z.string().min(1, "leadId is required"),
  crewType: z.string().min(1, "crewType is required"),
});

/**
 * Zod schema for editing a crew
 * Used for PUT /editCrew/:id
 */
export const editCrewSchema = z.object({
  name: z.string().min(1, "Crew name is required"),
  Users: z.string().min(2, "Users (JSON string) is required"),
  leadId: z.string().min(1, "leadId is required"),
  crewType: z.string().min(1, "crewType is required"),
});
