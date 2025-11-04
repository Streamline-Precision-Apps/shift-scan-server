# Tasco Log API Documentation

## Overview
Complete REST API for Tasco Log management including Tasco Logs, Refuel Logs, and F-Loads.

**Base URL:** `/api/v1/tasco-logs`

---

## Table of Contents
1. [Tasco Log Endpoints](#tasco-log-endpoints)
2. [Refuel Log Endpoints](#refuel-log-endpoints)
3. [F-Loads Endpoints](#f-loads-endpoints)
4. [Error Handling](#error-handling)

---

## Tasco Log Endpoints

### GET `/api/v1/tasco-logs/:id`
**Get a single Tasco Log by ID with all relations**

**Parameters:**
- `id` (path) - UUID of the Tasco Log

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "shiftType": "ABCD Shift",
    "equipmentId": "uuid",
    "laborType": "Operator",
    "materialType": "Lime Rock",
    "LoadQuantity": 5,
    "screenType": null,
    "timeSheetId": 1,
    "Equipment": { /* Equipment object */ },
    "TascoMaterialTypes": { /* Material type object */ },
    "TimeSheet": { /* TimeSheet object */ },
    "RefuelLogs": [],
    "TascoFLoads": []
  }
}
```

**Error Responses:**
- `400` - Tasco Log ID is required
- `404` - Tasco Log not found
- `500` - Failed to fetch Tasco Log

---

### GET `/api/v1/tasco-logs/timesheet/:timesheetId`
**Get all Tasco Logs for a specific timesheet**

**Parameters:**
- `timesheetId` (path) - Integer ID of the timesheet

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "shiftType": "ABCD Shift",
      "laborType": "Operator",
      "LoadQuantity": 5,
      /* ... other fields ... */
    }
  ]
}
```

---

### PUT `/api/v1/tasco-logs/:id/load-quantity`
**Update Tasco Log load quantity**

**Parameters:**
- `id` (path) - UUID of the Tasco Log

**Request Body:**
```json
{
  "loadCount": 10
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "LoadQuantity": 10,
    /* ... other fields ... */
  }
}
```

**Error Responses:**
- `400` - Tasco Log ID or Load count missing
- `500` - Failed to update load quantity

---

### PUT `/api/v1/tasco-logs/:id/comment`
**Update Tasco Log comment (updates associated TimeSheet comment)**

**Parameters:**
- `id` (path) - UUID of the Tasco Log

**Request Body:**
```json
{
  "comment": "Good shift today"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "TimeSheet": {
      "comment": "Good shift today"
    },
    /* ... other fields ... */
  }
}
```

**Error Responses:**
- `400` - Tasco Log ID or comment missing
- `500` - Failed to update comment

---

### GET `/api/v1/tasco-logs/:id/complete`
**Get complete Tasco Log data with all nested relations**

**Parameters:**
- `id` (path) - UUID of the Tasco Log

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "shiftType": "ABCD Shift",
    "laborType": "Operator",
    "LoadQuantity": 5,
    "TimeSheet": { /* Full timesheet */ },
    "Equipment": { /* Full equipment */ },
    "TascoMaterialTypes": { /* Full material type */ },
    "RefuelLogs": [ /* All refuel logs */ ],
    "TascoFLoads": [ /* All f-loads */ ]
  }
}
```

---

### DELETE `/api/v1/tasco-logs/:id`
**Delete a Tasco Log (cascades to all related records)**

**Parameters:**
- `id` (path) - UUID of the Tasco Log

**Response:**
```json
{
  "success": true,
  "message": "Tasco Log deleted."
}
```

**Error Responses:**
- `400` - Tasco Log ID is required
- `500` - Failed to delete Tasco Log

---

## Refuel Log Endpoints

### POST `/api/v1/tasco-logs/:id/refuel-logs`
**Create a new Refuel Log for a Tasco Log**

**Parameters:**
- `id` (path) - UUID of the parent Tasco Log

**Request Body:** (empty or optional)
```json
{}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "tascoLogId": "parent-uuid",
    "gallonsRefueled": 0,
    "milesAtFueling": null
  }
}
```

**Error Responses:**
- `400` - Tasco Log ID is required
- `500` - Failed to create Refuel Log

---

### GET `/api/v1/tasco-logs/:id/refuel-logs`
**Get all Refuel Logs for a Tasco Log**

**Parameters:**
- `id` (path) - UUID of the Tasco Log

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "tascoLogId": "parent-uuid",
      "gallonsRefueled": 25,
      "milesAtFueling": 150
    }
  ]
}
```

---

### PUT `/api/v1/tasco-logs/refuel-logs/:refuelLogId`
**Update a Refuel Log**

**Parameters:**
- `refuelLogId` (path) - UUID of the Refuel Log

**Request Body:**
```json
{
  "gallonsRefueled": 35,
  "milesAtFueling": 200
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "gallonsRefueled": 35,
    "milesAtFueling": 200
  }
}
```

**Error Responses:**
- `400` - Refuel Log ID is required
- `500` - Failed to update Refuel Log

---

### DELETE `/api/v1/tasco-logs/refuel-logs/:refuelLogId`
**Delete a Refuel Log**

**Parameters:**
- `refuelLogId` (path) - UUID of the Refuel Log

**Response:**
```json
{
  "success": true,
  "message": "Refuel Log deleted."
}
```

**Error Responses:**
- `400` - Refuel Log ID is required
- `500` - Failed to delete Refuel Log

---

## F-Loads Endpoints

### POST `/api/v1/tasco-logs/:id/f-loads`
**Create a new F-Load for an F-Shift Tasco Log**

**Parameters:**
- `id` (path) - UUID of the parent Tasco Log

**Request Body:** (empty or optional)
```json
{}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "tascoLogId": "parent-uuid",
    "weight": null,
    "screenType": null
  }
}
```

**Error Responses:**
- `400` - Tasco Log ID is required
- `500` - Failed to create F-Load

---

### GET `/api/v1/tasco-logs/:id/f-loads`
**Get all F-Loads for a Tasco Log**

**Parameters:**
- `id` (path) - UUID of the Tasco Log

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "tascoLogId": "parent-uuid",
      "weight": 22.5,
      "screenType": "SCREENED"
    }
  ]
}
```

---

### PUT `/api/v1/tasco-logs/f-loads/:fLoadId`
**Update an F-Load**

**Parameters:**
- `fLoadId` (path) - Integer ID of the F-Load

**Request Body:**
```json
{
  "weight": 25.5,
  "screenType": "UNSCREENED"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "weight": 25.5,
    "screenType": "UNSCREENED"
  }
}
```

**Error Responses:**
- `400` - F-Load ID is required
- `500` - Failed to update F-Load

---

### DELETE `/api/v1/tasco-logs/f-loads/:fLoadId`
**Delete an F-Load**

**Parameters:**
- `fLoadId` (path) - Integer ID of the F-Load

**Response:**
```json
{
  "success": true,
  "message": "F-Load deleted."
}
```

**Error Responses:**
- `400` - F-Load ID is required
- `500` - Failed to delete F-Load

---

## Error Handling

All errors follow a consistent format:

```json
{
  "error": "Error message",
  "details": "Detailed error information (development only)"
}
```

### Common HTTP Status Codes:
- `200` - Successful GET/PUT/DELETE
- `201` - Successful POST (resource created)
- `400` - Bad Request (missing/invalid parameters)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## Migration from Server Actions

### Old Pattern (Server Actions)
```typescript
export async function createRefuelLog(params: CreateRefuelLogParams) {
  const result = await tx.refuelLog.create({ data });
  return result;
}
```

### New Pattern (Express Backend)
```typescript
// Frontend call
const response = await apiRequest(
  `/api/v1/tasco-logs/${tascoLogId}/refuel-logs`,
  "POST"
);
```

---

## Database Schema

### TascoLog
- `id` (UUID) - Primary key
- `shiftType` - Type of shift (ABCD, E, F)
- `equipmentId` - Foreign key to Equipment
- `laborType` - Type of labor
- `materialType` - Material being handled
- `LoadQuantity` - Number of loads
- `screenType` - SCREENED or UNSCREENED
- `timeSheetId` - Foreign key to TimeSheet

### RefuelLog
- `id` (UUID) - Primary key
- `tascoLogId` - Foreign key to TascoLog
- `gallonsRefueled` - Amount of fuel
- `milesAtFueling` - Odometer reading

### TascoFLoads
- `id` (Integer) - Primary key
- `tascoLogId` - Foreign key to TascoLog
- `weight` - Load weight
- `screenType` - SCREENED or UNSCREENED
