import type { Request, Response } from "express";
import {
  getCrewEmployees,
  getAllCrews,
  getEmployeeInfo,
  getCrewByIdAdmin,
  createCrew,
  editCrew,
  deleteCrew,
  createUserAdmin,
  editUserAdmin,
  deleteUser,
  getPersonnelManager,
  getAllActiveEmployees,
} from "../services/adminPersonnelServices.js";

export const getCrewEmployeesController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await getCrewEmployees();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch crew employees",
    });
  }
};

export const getAllCrewsController = async (req: Request, res: Response) => {
  try {
    // Extract query parameters
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageSize = req.query.pageSize
      ? parseInt(req.query.pageSize as string, 10)
      : 25;
    const status = typeof req.query.status === "string" ? req.query.status : "all";
    const search = typeof req.query.search === "string" ? req.query.search : "";

    const result = await getAllCrews({
      page,
      pageSize,
      status,
      search,
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to fetch crews",
    });
  }
};

export const getAllActiveEmployeesController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await getAllActiveEmployees();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to fetch crews",
    });
  }
};

export const getEmployeeInfoController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Employee ID is required" });
    }
    const result = await getEmployeeInfo(id);
    if (!result) return res.status(404).json({ error: "Employee not found" });
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch employee info",
    });
  }
};

export const getCrewByIdAdminController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Crew ID is required" });
    }
    const result = await getCrewByIdAdmin(id);
    if (!result) return res.status(404).json({ error: "Crew not found" });
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error ? error.message : "Failed to fetch crew info",
    });
  }
};

// Placeholder for getCrewManagersController
export const getCrewManagersController = async (
  req: Request,
  res: Response
) => {
  res.status(501).json({ error: "Not implemented" });
};

export const createCrewController = async (req: Request, res: Response) => {
  try {
    const { name, Users, leadId, crewType } = req.body;
    const result = await createCrew(name, Users, leadId, crewType);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Failed to create crew",
    });
  }
};

export const editCrewController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, Users, leadId, crewType } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Crew ID is required" });
    }
    const result = await editCrew(id, name, Users, leadId, crewType);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Failed to edit crew",
    });
  }
};

export const deleteCrewController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Crew ID is required" });
    }
    const result = await deleteCrew(id);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Failed to delete crew",
    });
  }
};

export const createUserAdminController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await createUserAdmin(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Failed to create user",
    });
  }
};

export const editUserAdminController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await editUserAdmin({ ...req.body, id });
    res.json(result);
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Failed to edit user",
    });
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const result = await deleteUser(id);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Failed to delete user",
    });
  }
};

export const getPersonnelManagerController = async (
  req: Request,
  res: Response
) => {
  try {
    // Extract query parameters
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageSize = req.query.pageSize
      ? parseInt(req.query.pageSize as string, 10)
      : 25;
    const status = typeof req.query.status === "string" ? req.query.status : "all";
    const search = typeof req.query.search === "string" ? req.query.search : "";
    
    // Filter parameters
    const roles = typeof req.query.roles === "string" ? req.query.roles : "";
    const accessLevel = typeof req.query.accessLevel === "string" ? req.query.accessLevel : "";
    const accountSetup = typeof req.query.accountSetup === "string" ? req.query.accountSetup : "";
    const crews = typeof req.query.crews === "string" ? req.query.crews : "";

    const result = await getPersonnelManager({
      page,
      pageSize,
      status,
      search,
      roles,
      accessLevel,
      accountSetup,
      crews,
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch crew employees",
    });
  }
};
