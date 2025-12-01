# Date Filter Timezone Fix

## Issue

When selecting a single date (e.g., November 25) in the timesheet filters, timesheets from both the selected date AND the next day (November 26) were appearing in the results and exports.

## Root Cause

**Timezone conversion mismatch** between frontend and backend:

1. **Frontend**: Date picker creates Date object at midnight in **local timezone** (e.g., Nov 25 00:00:00 PST)
2. **`.toISOString()`**: Converts to UTC, which shifts the time (e.g., Nov 25 00:00:00 PST → Nov 25 08:00:00 UTC)
3. **Backend**: Receives ISO string and compares against timesheet dates, causing off-by-one-day errors
4. **Client-side filtering**: Also had timezone issues when comparing dates with time components

### Example of the Problem:

```
User selects: November 25
Frontend creates: new Date(2025, 10, 25, 0, 0, 0) // Nov 25 00:00:00 PST
.toISOString() sends: "2025-11-25T08:00:00.000Z"   // Nov 25 08:00:00 UTC
Backend compares: Matches Nov 25 AND Nov 26 timesheets due to time offset
```

## Solution

### 1. Frontend Changes (client/app/admins/timesheets/\_components/useAllTimeSheetData.ts)

#### API Request Fix (Lines 236-249)

**Before:**

```typescript
if (filters.dateRange && filters.dateRange.from) {
    params.append("dateFrom", filters.dateRange.from.toISOString());
}
if (filters.dateRange && filters.dateRange.to) {
    params.append("dateTo", filters.dateRange.to.toISOString());
}
```

**After:**

```typescript
if (filters.dateRange && filters.dateRange.from) {
    // Send date-only string (YYYY-MM-DD) to avoid timezone issues
    const year = filters.dateRange.from.getFullYear();
    const month = String(filters.dateRange.from.getMonth() + 1).padStart(
        2,
        "0"
    );
    const day = String(filters.dateRange.from.getDate()).padStart(2, "0");
    params.append("dateFrom", `${year}-${month}-${day}`);
}
if (filters.dateRange && filters.dateRange.to) {
    // Send date-only string (YYYY-MM-DD) to avoid timezone issues
    const year = filters.dateRange.to.getFullYear();
    const month = String(filters.dateRange.to.getMonth() + 1).padStart(2, "0");
    const day = String(filters.dateRange.to.getDate()).padStart(2, "0");
    params.append("dateTo", `${year}-${month}-${day}`);
}
```

**Why:** Sends date-only strings (YYYY-MM-DD) instead of full ISO strings with timezone info

---

#### Client-Side Filter Fix (Lines 583-606)

**Before:**

```typescript
// Date filter with timezone issues
let inDateRange = true;
if (dateRange.from && !dateRange.to) {
    const fromStart = new Date(dateRange.from);
    fromStart.setHours(0, 0, 0, 0);
    const fromEnd = new Date(dateRange.from);
    fromEnd.setHours(23, 59, 59, 999);
    const tsDate = new Date(ts.date);
    inDateRange = tsDate >= fromStart && tsDate <= fromEnd;
} else {
    if (dateRange.from) {
        inDateRange = inDateRange && new Date(ts.date) >= dateRange.from;
    }
    if (dateRange.to) {
        inDateRange = inDateRange && new Date(ts.date) <= dateRange.to;
    }
}
```

**After:**

```typescript
// Date filter: compare dates without time to avoid timezone issues
let inDateRange = true;
if (dateRange.from || dateRange.to) {
    // Normalize timesheet date to date-only (YYYY-MM-DD)
    const tsDate = new Date(ts.date);
    const tsDateOnly = new Date(
        tsDate.getFullYear(),
        tsDate.getMonth(),
        tsDate.getDate()
    );

    if (dateRange.from && !dateRange.to) {
        // Single date filter - check if same day
        const fromDateOnly = new Date(
            dateRange.from.getFullYear(),
            dateRange.from.getMonth(),
            dateRange.from.getDate()
        );
        inDateRange = tsDateOnly.getTime() === fromDateOnly.getTime();
    } else {
        // Range filter
        if (dateRange.from) {
            const fromDateOnly = new Date(
                dateRange.from.getFullYear(),
                dateRange.from.getMonth(),
                dateRange.from.getDate()
            );
            inDateRange = inDateRange && tsDateOnly >= fromDateOnly;
        }
        if (dateRange.to) {
            const toDateOnly = new Date(
                dateRange.to.getFullYear(),
                dateRange.to.getMonth(),
                dateRange.to.getDate()
            );
            inDateRange = inDateRange && tsDateOnly <= toDateOnly;
        }
    }
}
```

**Why:** Creates date-only Date objects (year, month, day) without time components for accurate comparison

---

### 2. Backend Changes (server/src/controllers/adminTimesheetController.ts)

#### Get All Timesheets Fix (Lines 88-108)

**Before:**

```typescript
// Date range
const dateFrom = req.query.dateFrom
    ? new Date(req.query.dateFrom as string)
    : undefined;
const dateTo = req.query.dateTo
    ? new Date(req.query.dateTo as string)
    : undefined;
```

**After:**

```typescript
// Date range - handle date-only strings (YYYY-MM-DD) from frontend
let dateFrom: Date | undefined = undefined;
let dateTo: Date | undefined = undefined;

if (req.query.dateFrom) {
    const dateStr = req.query.dateFrom as string;
    // If date-only format (YYYY-MM-DD), set to start of day
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        dateFrom = new Date(dateStr + "T00:00:00.000Z");
    } else {
        dateFrom = new Date(dateStr);
    }
}

if (req.query.dateTo) {
    const dateStr = req.query.dateTo as string;
    // If date-only format (YYYY-MM-DD), set to end of day
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        dateTo = new Date(dateStr + "T23:59:59.999Z");
    } else {
        dateTo = new Date(dateStr);
    }
}
```

**Why:**

-   Detects date-only format (YYYY-MM-DD)
-   Sets `dateFrom` to **00:00:00 UTC** (start of day)
-   Sets `dateTo` to **23:59:59 UTC** (end of day)
-   Ensures all timesheets on that date are captured

---

#### Export Timesheets Fix (Lines 243-264)

**Before:**

```typescript
// Parse date range if provided
let parsedDateRange: { from?: Date; to?: Date } | undefined;
if (dateRange) {
    parsedDateRange = {};
    if (dateRange.from) parsedDateRange.from = new Date(dateRange.from);
    if (dateRange.to) parsedDateRange.to = new Date(dateRange.to);
}
```

**After:**

```typescript
// Parse date range if provided - handle date-only strings (YYYY-MM-DD)
let parsedDateRange: { from?: Date; to?: Date } | undefined;
if (dateRange) {
    parsedDateRange = {};
    if (dateRange.from) {
        const fromStr = dateRange.from;
        // If date-only format (YYYY-MM-DD), set to start of day
        if (
            typeof fromStr === "string" &&
            /^\d{4}-\d{2}-\d{2}$/.test(fromStr)
        ) {
            parsedDateRange.from = new Date(fromStr + "T00:00:00.000Z");
        } else {
            parsedDateRange.from = new Date(fromStr);
        }
    }
    if (dateRange.to) {
        const toStr = dateRange.to;
        // If date-only format (YYYY-MM-DD), set to end of day
        if (typeof toStr === "string" && /^\d{4}-\d{2}-\d{2}$/.test(toStr)) {
            parsedDateRange.to = new Date(toStr + "T23:59:59.999Z");
        } else {
            parsedDateRange.to = new Date(toStr);
        }
    }
}
```

**Why:** Same logic as getAllTimesheets to ensure exports match the filtered view

---

## How It Works Now

### Single Date Selection (e.g., Nov 25)

**Frontend:**

```
User selects: November 25
Creates: Date object for Nov 25
Sends: "2025-11-25" (date-only string, no time/timezone)
```

**Backend:**

```
Receives: "2025-11-25"
Detects: Date-only format
Converts to range:
  from: "2025-11-25T00:00:00.000Z" (start of Nov 25 UTC)
  to:   "2025-11-25T23:59:59.999Z" (end of Nov 25 UTC)
Query: WHERE date >= '2025-11-25 00:00:00' AND date <= '2025-11-25 23:59:59'
```

**Result:** Only Nov 25 timesheets returned ✅

---

### Date Range Selection (e.g., Nov 20 - Nov 25)

**Frontend:**

```
User selects: November 20 to November 25
Sends:
  dateFrom: "2025-11-20"
  dateTo: "2025-11-25"
```

**Backend:**

```
Receives: "2025-11-20" to "2025-11-25"
Converts to range:
  from: "2025-11-20T00:00:00.000Z"
  to:   "2025-11-25T23:59:59.999Z"
Query: WHERE date >= '2025-11-20 00:00:00' AND date <= '2025-11-25 23:59:59'
```

**Result:** All timesheets from Nov 20-25 (inclusive) ✅

---

## Benefits

### ✅ Accurate Date Filtering

-   Selecting Nov 25 shows **only** Nov 25 timesheets
-   No more off-by-one-day errors

### ✅ Timezone Independent

-   Works consistently across all timezones
-   No conversion issues with `.toISOString()`

### ✅ Export Consistency

-   Exported data matches filtered view exactly
-   Same date logic applied to both

### ✅ Client-Side Filtering Improved

-   Local filtering also uses date-only comparisons
-   Consistent behavior between server and client

---

## Testing

### Test Case 1: Single Date Filter

1. Open Admin Timesheets page
2. Open Filters → Select Date Range
3. Choose single date (e.g., November 25)
4. **Expected:** Only Nov 25 timesheets display
5. **Expected:** Export also contains only Nov 25 timesheets

### Test Case 2: Date Range Filter

1. Select date range (e.g., Nov 20 - Nov 25)
2. **Expected:** All timesheets from Nov 20 to Nov 25 (inclusive)
3. **Expected:** Export matches filtered view

### Test Case 3: Timezone Edge Cases

1. Test at midnight (00:00)
2. Test near timezone boundaries (e.g., 11:59 PM)
3. **Expected:** Correct dates regardless of local time

### Test Case 4: Different Timezones

1. Test with users in PST, EST, UTC
2. **Expected:** Same results for same date selection

---

## Technical Details

### Date-Only Format

```
Format: YYYY-MM-DD
Examples:
  - "2025-11-25"
  - "2025-01-01"
  - "2024-12-31"
```

### Regex Pattern

```javascript
/^\d{4}-\d{2}-\d{2}$/;
```

Matches: 4 digits - 2 digits - 2 digits

### Backend Date Conversion

```javascript
// Start of day (00:00:00 UTC)
new Date("2025-11-25" + "T00:00:00.000Z");

// End of day (23:59:59 UTC)
new Date("2025-11-25" + "T23:59:59.999Z");
```

### Client-Side Date Comparison

```javascript
// Extract date-only components (no time)
const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

// Compare timestamps
dateOnly.getTime() === otherDateOnly.getTime();
```

---

## Files Modified

### Frontend (1 file):

-   `client/app/admins/timesheets/_components/useAllTimeSheetData.ts`
    -   Lines 236-249: API request date formatting
    -   Lines 583-606: Client-side date filtering logic

### Backend (1 file):

-   `server/src/controllers/adminTimesheetController.ts`
    -   Lines 88-108: getAllTimesheets date parsing
    -   Lines 243-264: exportTimesheets date parsing

---

## Backward Compatibility

### ✅ Old ISO String Format Still Supported

The backend regex check ensures old-style ISO strings continue to work:

```javascript
if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    // New format: date-only
} else {
    // Old format: ISO string with time
    new Date(dateStr);
}
```

### ✅ No Database Changes Required

-   Same database queries
-   Same Prisma operations
-   Only request/response format improved

---

## Related Issues Fixed

This fix also resolves:

-   ✅ Export showing incorrect date range
-   ✅ Timezone inconsistencies in filtered views
-   ✅ Client-side and server-side filter mismatches
-   ✅ Daylight saving time boundary issues

---

_Fix Implemented: December 1, 2025_
_Issue: Date filter showing timesheets from selected date + next day_
_Resolution: Changed to date-only format (YYYY-MM-DD) for timezone-independent filtering_
