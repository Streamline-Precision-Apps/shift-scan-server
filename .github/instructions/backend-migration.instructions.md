---
applyTo: "**/*.ts"
---

# Backend Migration Guide: Migrating Components to New MVC REST API Architecture

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Migration Strategy](#migration-strategy)
3. [Client-Side Migration](#client-side-migration)
4. [Server-Side Implementation](#server-side-implementation)
5. [Complete Migration Workflow](#complete-migration-workflow)
6. [Reference: Jobsites Migration Example](#reference-jobsites-migration-example)

---

## Architecture Overview

### New Backend Structure (MVC Pattern)

```
Request Flow:
Client Component → apiRequest() → REST API Endpoint → Route → Controller → Service → Prisma → Database

Response Flow:
Database → Prisma → Service → Controller → JSON Response → Client Component
```

### Key Architectural Components

**Server Side (`server/src/`):**

-   **Routes** (`routes/*.ts`): Define endpoints (GET, POST, PUT, DELETE) and map to controllers
-   **Controllers** (`controllers/*.ts`): Handle HTTP req/res, extract parameters, call services
-   **Services** (`services/*.ts`): Business logic, database operations via Prisma
-   **Prisma Client** (`generated/prisma/`): Type-safe database access

**Client Side (`client/app/`):**

-   **Components**: UI components (preserve completely during migration)
-   **Hooks** (`_components/*.ts`): Data fetching and state management
-   **Actions** (`lib/actions/*.tsx`): Server action wrappers calling REST API
-   **Utilities** (`lib/utils/api-Utils.ts`): Centralized API communication

---

## Migration Strategy

### Core Principle: **PRESERVE UI, UPDATE DATA LAYER ONLY**

✅ **What Changes:**

-   Import paths for components and actions
-   Data fetching mechanisms (fetch → apiRequest)
-   API endpoint URLs (custom → RESTful)
-   Type definitions (Prisma imports → local types)
-   Server actions (old location → new location)

❌ **What NEVER Changes:**

-   JSX structure and layout
-   Component props and interfaces
-   Styling and CSS classes
-   User interactions and event handlers
-   Business logic in components

---

## Client-Side Migration

### Phase 1: Update Imports

#### 1. Component Imports

```typescript
// ❌ OLD
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ✅ NEW
import { Button } from "@/app/v1/components/ui/button";
import { Input } from "@/app/v1/components/ui/input";
```

#### 2. Data/Utility Imports

```typescript
// ❌ OLD
import { StateOptions } from "@/data/stateValues";

// ✅ NEW
import { StateOptions } from "@/app/lib/data/stateValues";
```

#### 3. Server Action Imports

```typescript
// ❌ OLD
import {
    deleteJobsite,
    archiveJobsite,
    restoreJobsite,
} from "@/actions/AssetActions";

// ✅ NEW
import {
    archiveJobsite,
    deleteJobsite,
    restoreJobsite,
} from "@/app/lib/actions/adminActions";
```

#### 4. Add API Utility Import

```typescript
// ✅ NEW - Always add this for data hooks
import { apiRequest } from "@/app/lib/utils/api-Utils";
```

### Phase 2: Replace Type Definitions

**Problem:** Client components cannot import Prisma types (server-only)

**Solution:** Define local type aliases

```typescript
// ❌ OLD - Imports from Prisma (causes errors)
import {
    ApprovalStatus,
    FormTemplateStatus,
} from "../../../../../../prisma/generated/prisma/client";

// ✅ NEW - Local type definitions
type ApprovalStatus = "APPROVED" | "DRAFT" | "PENDING" | "REJECTED";
type FormTemplateStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";
```

### Phase 3: Update Data Fetching Hooks

#### Old Pattern (Custom Fetch)

```typescript
// ❌ OLD Pattern
useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            let url = "";
            if (showPendingOnly) {
                url = `/api/jobsiteManager?status=pending`;
            } else {
                url = `/api/jobsiteManager?page=${page}&pageSize=${pageSize}`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }
            const data = await response.json();

            setJobsiteDetails(data.jobsites);
            setTotal(data.total);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Failed to fetch:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
}, [refreshKey, page, pageSize, showPendingOnly]);
```

#### New Pattern (apiRequest)

```typescript
// ✅ NEW Pattern
useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            let url = "";
            if (showPendingOnly) {
                url = `/api/v1/admins/jobsite?status=pending`;
            } else {
                url = `/api/v1/admins/jobsite?page=${page}&pageSize=${pageSize}`;
            }

            const data = await apiRequest(url, "GET");

            setJobsiteDetails(data.jobsiteSummary || []);
            setTotal(data.total);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Failed to fetch:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
}, [refreshKey, page, pageSize, showPendingOnly]);
```

**Key Changes:**

1. URL path: `/api/jobsiteManager` → `/api/v1/admins/jobsite`
2. Method: `fetch()` → `apiRequest(url, "GET")`
3. Response handling: `data.jobsites` → `data.jobsiteSummary`
4. Error handling built into `apiRequest()`

### Phase 4: Update Authentication

#### Old Pattern

```typescript
// ❌ OLD - NextAuth session
import { useSession } from "next-auth/react";

const { data: session } = useSession();
// Use session.user.id
```

#### New Pattern

```typescript
// ✅ NEW - Zustand user store
import { useUserStore } from "@/app/lib/store/userStore";

const { user } = useUserStore();
// Use user.id
```

---

## Server-Side Implementation

### Phase 1: Create Route Definition

**File:** `server/src/routes/admins{Resource}Routes.ts`

```typescript
import { Router } from "express";
import {
    getAllResourcesController,
    getResourceByIdController,
    createResourceController,
    updateResourceController,
    archiveResourceController,
    restoreResourceController,
    deleteResourceController,
} from "../controllers/admin{Resource}Controller.js";

const router = Router();

// GET endpoints
router.get("/:id", getResourceByIdController); // Get single by ID
router.get("/", getAllResourcesController); // Get all with pagination

// POST endpoints
router.post("/", createResourceController); // Create new

// PUT endpoints
router.put("/:id", updateResourceController); // Update by ID
router.put("/:id/archive", archiveResourceController); // Archive
router.put("/:id/restore", restoreResourceController); // Restore

// DELETE endpoints
router.delete("/:id", deleteResourceController); // Delete by ID

export default router;
```

**Register Route:**

```typescript
// server/src/routes/index.ts
import adminsResourceRoutes from "./adminsResourceRoutes.js";

router.use("/v1/admins/resource", adminsResourceRoutes);
```

### Phase 2: Create Controller

**File:** `server/src/controllers/admin{Resource}Controller.ts`

```typescript
import type { Request, Response } from "express";
import {
    getAllResources,
    getResourceById,
    createResource,
    updateResource,
    archiveResource,
    restoreResource,
    deleteResource,
} from "../services/admin{Resource}Service.js";

// GET /api/v1/admins/resource
export async function getAllResourcesController(req: Request, res: Response) {
    try {
        const status =
            typeof req.query.status === "string" ? req.query.status : "";
        const page = req.query.page
            ? parseInt(req.query.page as string, 10)
            : 1;
        const pageSize = req.query.pageSize
            ? parseInt(req.query.pageSize as string, 10)
            : 25;

        let skip = (page - 1) * pageSize;
        let totalPages = 1;
        let total = 0;

        const result = await getAllResources(
            status,
            page,
            pageSize,
            skip,
            totalPages,
            total
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch resources",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}

// GET /api/v1/admins/resource/:id
export async function getResourceByIdController(req: Request, res: Response) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Resource ID is required",
            });
        }

        const resource = await getResourceById(id);
        if (!resource) {
            return res.status(404).json({
                success: false,
                message: "Resource not found",
            });
        }

        res.status(200).json(resource);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch resource",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}

// POST /api/v1/admins/resource
export async function createResourceController(req: Request, res: Response) {
    try {
        const payload = req.body;
        await createResource(payload);
        res.status(201).json({
            success: true,
            message: "Resource created successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create resource",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}

// PUT /api/v1/admins/resource/:id
export async function updateResourceController(req: Request, res: Response) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Resource ID is required",
            });
        }

        const updateData = req.body;
        const updated = await updateResource(id, updateData);

        res.status(200).json({
            success: true,
            message: "Resource updated successfully",
            data: updated,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update resource",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}

// PUT /api/v1/admins/resource/:id/archive
export async function archiveResourceController(req: Request, res: Response) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Resource ID is required",
            });
        }

        await archiveResource(id);
        res.status(200).json({
            success: true,
            message: "Resource archived successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to archive resource",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}

// PUT /api/v1/admins/resource/:id/restore
export async function restoreResourceController(req: Request, res: Response) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Resource ID is required",
            });
        }

        await restoreResource(id);
        res.status(200).json({
            success: true,
            message: "Resource restored successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to restore resource",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}

// DELETE /api/v1/admins/resource/:id
export async function deleteResourceController(req: Request, res: Response) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Resource ID is required",
            });
        }

        await deleteResource(id);
        res.status(200).json({
            success: true,
            message: "Resource deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete resource",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}
```

### Phase 3: Create Service

**File:** `server/src/services/admin{Resource}Service.ts`

```typescript
import prisma from "../lib/prisma.js";
import type {
    ApprovalStatus,
    FormTemplateStatus,
} from "../../generated/prisma/index.js";

export async function getAllResources(
    status: string,
    page: number | undefined,
    pageSize: number | undefined,
    skip: number | undefined,
    totalPages: number | undefined,
    total: number | undefined
) {
    try {
        if (status === "pending") {
            // Special handling for pending items (no pagination)
            page = undefined;
            pageSize = undefined;
            skip = undefined;
            totalPages = 1;

            const resourceSummary = await prisma.resource.findMany({
                where: {
                    approvalStatus: "PENDING",
                },
                select: {
                    id: true,
                    name: true,
                    status: true,
                    approvalStatus: true,
                    createdAt: true,
                    updatedAt: true,
                    // Include relations as needed
                    _count: {
                        select: {
                            // Related counts
                        },
                    },
                },
                orderBy: {
                    name: "asc",
                },
            });

            total = resourceSummary.length;

            return {
                resourceSummary,
                total,
                page,
                pageSize,
                skip,
                totalPages,
            };
        } else {
            // Standard pagination
            page = page || 1;
            pageSize = pageSize || 10;
            skip = (page - 1) * pageSize;

            total = await prisma.resource.count();
            totalPages = Math.ceil(total / pageSize);

            const resourceSummary = await prisma.resource.findMany({
                skip,
                take: pageSize,
                select: {
                    id: true,
                    name: true,
                    status: true,
                    approvalStatus: true,
                    createdAt: true,
                    updatedAt: true,
                    // Include relations as needed
                    _count: {
                        select: {
                            // Related counts
                        },
                    },
                },
                orderBy: {
                    name: "asc",
                },
            });

            return {
                resourceSummary,
                total,
                page,
                pageSize,
                skip,
                totalPages,
            };
        }
    } catch (error) {
        console.error("Error fetching resources:", error);
        throw error;
    }
}

export async function getResourceById(id: string) {
    return await prisma.resource.findUnique({
        where: { id },
        include: {
            // Include necessary relations
        },
    });
}

export async function createResource(payload: any) {
    return await prisma.resource.create({
        data: {
            // Map payload to Prisma create data
        },
    });
}

export async function updateResource(id: string, data: any) {
    return await prisma.resource.update({
        where: { id },
        data: {
            // Map data to Prisma update data
        },
    });
}

export async function archiveResource(id: string) {
    return await prisma.resource.update({
        where: { id },
        data: {
            status: "ARCHIVED",
        },
    });
}

export async function restoreResource(id: string) {
    return await prisma.resource.update({
        where: { id },
        data: {
            status: "ACTIVE",
        },
    });
}

export async function deleteResource(id: string) {
    return await prisma.resource.delete({
        where: { id },
    });
}
```

### Phase 4: Create Client-Side Actions

**File:** `client/app/lib/actions/adminActions.tsx`

```typescript
"use client";
import { apiRequest } from "@/app/lib/utils/api-Utils";

export async function createResourceAdmin({ payload }: { payload: any }) {
    try {
        const result = await apiRequest(
            "/api/v1/admins/resource",
            "POST",
            payload
        );
        return {
            success: true,
            message: "Resource created successfully",
            data: result,
        };
    } catch (error) {
        console.error("Error creating resource:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        };
    }
}

export async function updateResourceAdmin(formData: FormData) {
    try {
        const id = formData.get("id") as string;
        if (!id) {
            throw new Error("Resource ID is required");
        }

        const updateData: Record<string, any> = {};
        // Extract fields from formData
        if (formData.has("name")) {
            updateData.name = (formData.get("name") as string)?.trim();
        }
        // ... extract other fields

        const result = await apiRequest(
            `/api/v1/admins/resource/${id}`,
            "PUT",
            updateData
        );

        return {
            success: true,
            data: result,
            message: "Resource updated successfully",
        };
    } catch (error) {
        console.error("Error updating resource:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        };
    }
}

export async function deleteResource(id: string) {
    try {
        const result = await apiRequest(
            `/api/v1/admins/resource/${id}`,
            "DELETE"
        );
        return {
            success: true,
            message: "Resource deleted successfully",
            data: result,
        };
    } catch (error) {
        console.error("Error deleting resource:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        };
    }
}

export async function archiveResource(id: string) {
    try {
        const result = await apiRequest(
            `/api/v1/admins/resource/${id}/archive`,
            "PUT",
            { status: "ARCHIVED" }
        );
        return {
            success: true,
            message: "Resource archived successfully",
            data: result,
        };
    } catch (error) {
        console.error("Error archiving resource:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        };
    }
}

export async function restoreResource(id: string) {
    try {
        const result = await apiRequest(
            `/api/v1/admins/resource/${id}/restore`,
            "PUT",
            { status: "ACTIVE" }
        );
        return {
            success: true,
            message: "Resource restored successfully",
            data: result,
        };
    } catch (error) {
        console.error("Error restoring resource:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        };
    }
}
```

---

## Complete Migration Workflow

### Step-by-Step Migration Process

#### 1. **Analyze Old Component**

-   [ ] Identify all data fetching operations
-   [ ] List all CRUD operations (Create, Read, Update, Delete)
-   [ ] Note custom API endpoints being used
-   [ ] Document response data structure
-   [ ] Identify Prisma type imports

#### 2. **Create Server-Side Implementation**

-   [ ] Create route file: `server/src/routes/admins{Resource}Routes.ts`
-   [ ] Create controller: `server/src/controllers/admin{Resource}Controller.ts`
-   [ ] Create service: `server/src/services/admin{Resource}Service.ts`
-   [ ] Register routes in `server/src/routes/index.ts`
-   [ ] Test endpoints with Postman/Thunder Client

#### 3. **Create Client-Side Actions**

-   [ ] Add CRUD functions to `client/app/lib/actions/adminActions.tsx`
-   [ ] Use `apiRequest()` for all API calls
-   [ ] Match function signatures from old actions
-   [ ] Return `{ success, message, data/error }` format

#### 4. **Update Data Hook**

-   [ ] Replace Prisma type imports with local types
-   [ ] Update action imports to new location
-   [ ] Add `apiRequest` import
-   [ ] Replace `fetch()` calls with `apiRequest()`
-   [ ] Update API endpoint URLs to `/api/v1/` pattern
-   [ ] Map response keys (e.g., `data.jobsites` → `data.jobsiteSummary`)

#### 5. **Update Component Files**

-   [ ] Update all component imports (`@/components` → `@/app/v1/components`)
-   [ ] Update data imports (`@/data` → `@/app/lib/data`)
-   [ ] Update action imports (`@/actions` → `@/app/lib/actions`)
-   [ ] Replace session/auth logic if needed
-   [ ] **DO NOT change JSX structure**

#### 6. **Test Migration**

-   [ ] Test READ operations (GET endpoints)
-   [ ] Test CREATE operations (POST endpoints)
-   [ ] Test UPDATE operations (PUT endpoints)
-   [ ] Test DELETE operations (DELETE endpoints)
-   [ ] Test special operations (archive, restore, etc.)
-   [ ] Verify pagination works correctly
-   [ ] Verify filtering/search works
-   [ ] Test error handling

---

## Reference: Jobsites Migration Example

### Complete Transformation Map

#### Data Hook Changes (`useJobsiteData.ts`)

| Aspect       | OLD                             | NEW                                                      |
| ------------ | ------------------------------- | -------------------------------------------------------- |
| **Imports**  | `from "@/actions/AssetActions"` | `from "@/app/lib/actions/adminActions"`                  |
|              | `from "prisma/generated/..."`   | Local type definitions                                   |
|              | -                               | `import { apiRequest } from "@/app/lib/utils/api-Utils"` |
| **Types**    | `import { ApprovalStatus }`     | `type ApprovalStatus = "APPROVED" \| ...`                |
| **API Call** | `await fetch(url)`              | `await apiRequest(url, "GET")`                           |
| **URL**      | `/api/jobsiteManager?...`       | `/api/v1/admins/jobsite?...`                             |
| **Response** | `data.jobsites`                 | `data.jobsiteSummary`                                    |

#### Component Changes (`CreateJobsiteModal.tsx`)

| Aspect           | OLD                                 | NEW                                              |
| ---------------- | ----------------------------------- | ------------------------------------------------ |
| **UI Imports**   | `from "@/components/ui/button"`     | `from "@/app/v1/components/ui/button"`           |
| **Data Imports** | `from "@/data/stateValues"`         | `from "@/app/lib/data/stateValues"`              |
| **Actions**      | `from "@/actions/AssetActions"`     | `from "@/app/lib/actions/adminActions"`          |
| **Auth**         | `useSession()` from next-auth       | `useUserStore()`                                 |
| **API Fetch**    | `await fetch("/api/getTagSummary")` | `await apiRequest("/api/v1/admins/tags", "GET")` |
| **Response**     | `data.tags`                         | `data.tagSummary`                                |
| **JSX**          | _No changes_                        | _No changes_                                     |

#### Server Files Created

1. **Route:** `server/src/routes/adminsJobsiteRoutes.ts` - 7 endpoints defined
2. **Controller:** `server/src/controllers/adminJobsiteController.ts` - 7 controller functions
3. **Service:** `server/src/services/adminJobsiteService.ts` - 7 service functions + Prisma queries
4. **Registration:** Added to `server/src/routes/index.ts`

#### Actions Created (`adminActions.tsx`)

1. `createJobsiteAdmin()` - POST to `/api/v1/admins/jobsite`
2. `updateJobsiteAdmin()` - PUT to `/api/v1/admins/jobsite/:id`
3. `deleteJobsite()` - DELETE to `/api/v1/admins/jobsite/:id`
4. `archiveJobsite()` - PUT to `/api/v1/admins/jobsite/:id/archive`
5. `restoreJobsite()` - PUT to `/api/v1/admins/jobsite/:id/restore`

### Key Response Structure Changes

```typescript
// OLD Response Structure
{
  jobsites: JobsiteSummary[],
  total: number,
  totalPages: number
}

// NEW Response Structure
{
  jobsiteSummary: JobsiteSummary[],
  total: number,
  totalPages: number,
  page?: number,
  pageSize?: number,
  skip?: number
}
```

---

## API Request Utility (`apiRequest`)

### Function Signature

```typescript
apiRequest(path: string, method: string, body?: Record<string, unknown> | FormData)
```

### Features

-   ✅ Automatically includes Bearer token from localStorage
-   ✅ Sets `credentials: 'include'` for cookies
-   ✅ Handles FormData and JSON payloads
-   ✅ Returns parsed JSON response
-   ✅ Returns `[]` for 204 No Content responses
-   ✅ Throws errors with descriptive messages

### Usage Examples

**GET Request:**

```typescript
const data = await apiRequest(
    "/api/v1/admins/jobsite?page=1&pageSize=25",
    "GET"
);
```

**POST Request:**

```typescript
const result = await apiRequest("/api/v1/admins/jobsite", "POST", {
    code: "JOB001",
    name: "New Jobsite",
    // ... other fields
});
```

**PUT Request:**

```typescript
const updated = await apiRequest(`/api/v1/admins/jobsite/${id}`, "PUT", {
    name: "Updated Name",
});
```

**DELETE Request:**

```typescript
await apiRequest(`/api/v1/admins/jobsite/${id}`, "DELETE");
```

---

## Common Pitfalls & Solutions

### 1. Wrong Import Paths

❌ **Problem:** `Cannot find module '@/components/ui/button'`
✅ **Solution:** Update to `@/app/v1/components/ui/button`

### 2. Prisma Types in Client

❌ **Problem:** `Module not found: Can't resolve 'fs'` (server-only module)
✅ **Solution:** Replace Prisma imports with local type definitions

### 3. Response Key Mismatch

❌ **Problem:** Data not displaying, console shows undefined
✅ **Solution:** Check response structure - map old keys to new (e.g., `jobsites` → `jobsiteSummary`)

### 4. Missing API Prefix

❌ **Problem:** 404 Not Found errors
✅ **Solution:** Ensure all URLs start with `/api/v1/`

### 5. Direct fetch() Usage

❌ **Problem:** Authentication errors, no error handling
✅ **Solution:** Always use `apiRequest()` utility

### 6. UI Changes During Migration

❌ **Problem:** Layout breaks, styles different
✅ **Solution:** Only change imports and data layer - preserve all JSX

---

## Testing Checklist

After completing migration:

### Client-Side Testing

-   [ ] Component renders without errors
-   [ ] No TypeScript compilation errors
-   [ ] All imports resolve correctly
-   [ ] Data loads on initial render
-   [ ] Loading states display correctly
-   [ ] Error states display correctly

### API Testing

-   [ ] GET requests return correct data structure
-   [ ] POST requests create new records
-   [ ] PUT requests update existing records
-   [ ] DELETE requests remove records
-   [ ] Query parameters work (pagination, filters)
-   [ ] Error responses handled gracefully

### Integration Testing

-   [ ] CRUD workflow complete (Create → Read → Update → Delete)
-   [ ] UI updates after operations
-   [ ] Toast notifications display
-   [ ] Modals open/close correctly
-   [ ] Confirmation dialogs work
-   [ ] Pagination works
-   [ ] Search/filter works

### Production Readiness

-   [ ] No console errors
-   [ ] No console warnings
-   [ ] Network tab shows 200/201/204 responses
-   [ ] Authentication works
-   [ ] Authorization enforced (if applicable)
-   [ ] Loading performance acceptable

---

## Summary

### Migration Checklist (Quick Reference)

**Server-Side (Create New):**

1. ✅ Create route file with 7 standard endpoints
2. ✅ Create controller with request/response handling
3. ✅ Create service with Prisma database operations
4. ✅ Register route in index.ts
5. ✅ Test endpoints individually

**Client-Side (Update Existing):**

1. ✅ Update component imports (UI, data, actions)
2. ✅ Replace Prisma types with local definitions
3. ✅ Update data hook to use `apiRequest()`
4. ✅ Update API URLs to `/api/v1/` pattern
5. ✅ Map response keys if changed
6. ✅ Update authentication (session → userStore)
7. ✅ **Preserve JSX completely**

**Actions (Create/Update):**

1. ✅ Create CRUD functions in `adminActions.tsx`
2. ✅ Use `apiRequest()` for all calls
3. ✅ Return consistent `{ success, message, data }` format

**Testing:**

1. ✅ Test each CRUD operation
2. ✅ Verify pagination and filters
3. ✅ Check error handling
4. ✅ Confirm UI updates correctly

---

**Remember:** The goal is to migrate the data layer while keeping the UI identical. If you find yourself changing JSX, styling, or component structure, you're doing it wrong. Only imports, types, and data fetching mechanisms should change.
