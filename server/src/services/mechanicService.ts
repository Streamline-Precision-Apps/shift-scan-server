import prisma from "../lib/prisma.js";
import type {} from "../../generated/prisma/index.js";

export async function getMechanicLogsService(timesheetId: number) {
  const projects = await prisma.mechanicProjects.findMany({
    where: { timeSheetId: timesheetId },
    select: {
      id: true,
      equipmentId: true,
      description: true,
      hours: true,
      Equipment: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  return projects;
}

export async function createMechanicLogService({
  timeSheetId,
  equipmentId,
  hours,
  description,
}: {
  timeSheetId: number;
  equipmentId: string;
  hours?: number;
  description?: string;
}) {
  return await prisma.mechanicProjects.create({
    data: {
      timeSheetId,
      equipmentId,
      hours: hours || 0,
      description: description || "",
    },
  });
}

export async function updateMechanicLogService(
  projectId: number,
  {
    equipmentId,
    hours,
    description,
  }: {
    equipmentId?: string;
    hours?: number;
    description?: string;
  }
) {
  const updateData: {
    equipmentId?: string;
    hours?: number;
    description?: string;
  } = {};

  if (equipmentId) updateData.equipmentId = equipmentId;
  if (hours !== undefined) updateData.hours = hours;
  if (description !== undefined) updateData.description = description;

  return await prisma.mechanicProjects.update({
    where: { id: projectId },
    data: updateData,
  });
}

export async function deleteMechanicLogService(projectId: number) {
  return await prisma.mechanicProjects.delete({
    where: { id: projectId },
  });
}

export async function getMechanicLogService(id: number) {
  return await prisma.mechanicProjects.findUnique({
    where: { id },
    select: {
      id: true,
      equipmentId: true,
      description: true,
      hours: true,
      Equipment: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}
