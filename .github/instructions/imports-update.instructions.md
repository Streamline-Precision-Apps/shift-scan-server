# Import Path Migration Instructions

## Overview

This guide documents the updated import path structure for the ShiftScan application. Use these patterns when updating files to the new folder structure.

---

## Import Path Mapping

### 1. UI Components

**OLD PATTERN:**

```typescript
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
```

**NEW PATTERN:**

```typescript
import { Button } from "@/app/v1/components/ui/button";
import { Input } from "@/app/v1/components/ui/input";
import { Label } from "@/app/v1/components/ui/label";
import { Calendar } from "@/app/v1/components/ui/calendar";
import { Badge } from "@/app/v1/components/ui/badge";
import { Checkbox } from "@/app/v1/components/ui/checkbox";
import { Switch } from "@/app/v1/components/ui/switch";
import { Textarea } from "@/app/v1/components/ui/textarea";
import { Skeleton } from "@/app/v1/components/ui/skeleton";
```

**Rule:** All UI component imports change from `@/components/ui/*` to `@/app/v1/components/ui/*`

---

### 2. Complex UI Components

**OLD PATTERN:**

```typescript
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { SingleCombobox } from "@/components/ui/single-combobox";
import { DateTimePicker } from "@/components/ui/dateTimePicker";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
```

**NEW PATTERN:**

```typescript
import { Combobox, ComboboxOption } from "@/app/v1/components/ui/combobox";
import { SingleCombobox } from "@/app/v1/components/ui/single-combobox";
import { DateTimePicker } from "@/app/v1/components/ui/dateTimePicker";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/app/v1/components/ui/popover";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/app/v1/components/ui/tooltip";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/app/v1/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/v1/components/ui/select";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/app/v1/components/ui/accordion";
```

**Rule:** All complex UI components follow the same pattern: `@/components/ui/*` → `@/app/v1/components/ui/*`

---

### 3. Animation Components

**OLD PATTERN:**

```typescript
import Spinner from "@/components/(animations)/spinner";
```

**NEW PATTERN:**

```typescript
import Spinner from "@/app/v1/components/(animations)/spinner";
```

**Rule:** Animation components change from `@/components/(animations)/*` to `@/app/v1/components/(animations)/*`

---

### 4. Server Actions

**OLD PATTERN:**

```typescript
import { adminCreateTimesheet } from "@/actions/records-timesheets";
import { adminUpdateTimesheetOptimized } from "@/actions/optimized-timesheet-updates";
import {
    deleteJobsite,
    archiveJobsite,
    restoreJobsite,
} from "@/actions/AssetActions";
```

**NEW PATTERN:**

```typescript
import { createTimesheetAdmin } from "@/app/lib/actions/adminActions";
import { updateTimesheetAdmin } from "@/app/lib/actions/adminActions";
import {
    deleteJobsite,
    archiveJobsite,
    restoreJobsite,
} from "@/app/lib/actions/adminActions";
```

**Rule:** All server actions consolidate to `@/app/lib/actions/adminActions` with updated function names following the pattern: `{action}{Resource}Admin`

**Function Name Changes:**

-   `adminCreateTimesheet` → `createTimesheetAdmin`
-   `adminUpdateTimesheetOptimized` → `updateTimesheetAdmin`
-   `adminCreateJobsite` → `createJobsiteAdmin`
-   `adminUpdateJobsite` → `updateJobsiteAdmin`

---

### 5. Data/Utility Imports

**OLD PATTERN:**

```typescript
import { StateOptions } from "@/data/stateValues";
```

**NEW PATTERN:**

```typescript
import { StateOptions } from "@/app/lib/data/stateValues";
```

**Rule:** Data imports change from `@/data/*` to `@/app/lib/data/*`

---

### 6. Utility Functions

**OLD PATTERN:**

```typescript
import { calculateDuration } from "@/utils/calculateDuration";
```

**NEW PATTERN:**

```typescript
import { calculateDuration } from "@/utils/calculateDuration";
```

**Rule:** Root-level utilities (`@/utils/*`) remain unchanged

---

### 7. API Utilities (NEW)

**NEW ADDITION:**

```typescript
import { apiRequest } from "@/app/lib/utils/api-Utils";
```

**Rule:** Always add this import when components need to make API calls

---

### 8. Store/State Management

**OLD PATTERN:**

```typescript
import { useSession } from "next-auth/react";

// Usage:
const { data: session } = useSession();
const userId = session?.user?.id;
```

**NEW PATTERN:**

```typescript
import { useUserStore } from "@/app/lib/store/userStore";

// Usage:
const { user } = useUserStore();
const userId = user?.id;
```

**Rule:** Replace NextAuth `useSession()` with Zustand `useUserStore()`

---

## Complete Migration Checklist

When migrating a file, follow these steps:

### Step 1: Update UI Component Imports

-   [ ] Replace all `@/components/ui/*` with `@/app/v1/components/ui/*`
-   [ ] Replace all `@/components/(animations)/*` with `@/app/v1/components/(animations)/*`

### Step 2: Update Server Actions

-   [ ] Replace `@/actions/*` imports with `@/app/lib/actions/adminActions`
-   [ ] Update function names to match new naming convention

### Step 3: Update Data Imports

-   [ ] Replace `@/data/*` with `@/app/lib/data/*`

### Step 4: Add New Utilities

-   [ ] Add `apiRequest` import if component makes API calls
-   [ ] Replace `fetch()` calls with `apiRequest()`

### Step 5: Update Authentication

-   [ ] Replace `useSession()` with `useUserStore()`
-   [ ] Update all references from `session?.user` to `user`

### Step 6: Update API Endpoints

-   [ ] Change API URLs from `/api/*` to `/api/v1/admins/*`

---

## Example: Complete File Migration

**BEFORE:**

```typescript
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminCreateJobsite } from "@/actions/AssetActions";
import { StateOptions } from "@/data/stateValues";
import { useSession } from "next-auth/react";
import Spinner from "@/components/(animations)/spinner";

export default function CreateJobsiteModal() {
    const { data: session } = useSession();

    const handleSubmit = async () => {
        const response = await fetch("/api/jobsiteManager", {
            method: "POST",
            body: JSON.stringify(data),
        });
        // ...
    };

    return (
        <div>
            <Button>Create</Button>
            <Input />
        </div>
    );
}
```

**AFTER:**

```typescript
"use client";
import { Button } from "@/app/v1/components/ui/button";
import { Input } from "@/app/v1/components/ui/input";
import { createJobsiteAdmin } from "@/app/lib/actions/adminActions";
import { StateOptions } from "@/app/lib/data/stateValues";
import { useUserStore } from "@/app/lib/store/userStore";
import Spinner from "@/app/v1/components/(animations)/spinner";
import { apiRequest } from "@/app/lib/utils/api-Utils";

export default function CreateJobsiteModal() {
    const { user } = useUserStore();

    const handleSubmit = async () => {
        const response = await apiRequest(
            "/api/v1/admins/jobsite",
            "POST",
            data
        );
        // ...
    };

    return (
        <div>
            <Button>Create</Button>
            <Input />
        </div>
    );
}
```

---

## Quick Reference Table

| Category          | Old Path                              | New Path                                          |
| ----------------- | ------------------------------------- | ------------------------------------------------- |
| **UI Components** | `@/components/ui/*`                   | `@/app/v1/components/ui/*`                        |
| **Animations**    | `@/components/(animations)/*`         | `@/app/v1/components/(animations)/*`              |
| **Actions**       | `@/actions/*`                         | `@/app/lib/actions/adminActions`                  |
| **Data**          | `@/data/*`                            | `@/app/lib/data/*`                                |
| **Utilities**     | `@/utils/*`                           | `@/utils/*` (unchanged)                           |
| **Auth**          | `useSession()` from `next-auth/react` | `useUserStore()` from `@/app/lib/store/userStore` |
| **API Util**      | N/A                                   | `@/app/lib/utils/api-Utils` (new)                 |

---

## API Request Pattern

### Old Pattern (fetch)

```typescript
const response = await fetch("/api/jobsiteManager", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
});
const result = await response.json();
```

### New Pattern (apiRequest)

```typescript
const result = await apiRequest("/api/v1/admins/jobsite", "POST", data);
```

**Benefits:**

-   Automatic authentication headers
-   Consistent error handling
-   Simplified syntax
-   Type-safe responses

---

## Common Pitfalls

1. **Forgetting to update nested imports**

    - ❌ Update only some imports
    - ✅ Update ALL imports from `@/components` to `@/app/v1/components`

2. **Not updating function names with actions**

    - ❌ Keep old function names like `adminCreateTimesheet`
    - ✅ Use new names like `createTimesheetAdmin`

3. **Missing apiRequest import**

    - ❌ Update URLs but keep using `fetch()`
    - ✅ Import and use `apiRequest()` utility

4. **Not updating session references**

    - ❌ Change import but keep using `session?.user`
    - ✅ Update to use `user` directly from `useUserStore()`

5. **Partial API URL updates**
    - ❌ Update some URLs but miss others
    - ✅ Search entire file for `/api/` and update all occurrences

---

## Validation Checklist

After migration, verify:

-   [ ] No remaining imports from `@/components/ui/*`
-   [ ] No remaining imports from `@/actions/*`
-   [ ] No remaining imports from `@/data/*`
-   [ ] No remaining `useSession` from `next-auth/react`
-   [ ] No remaining direct `fetch()` calls to `/api/*`
-   [ ] All API URLs use `/api/v1/admins/*` pattern
-   [ ] File compiles without import errors
-   [ ] JSX/UI structure remains unchanged

---

## Notes

-   **DO NOT** change JSX structure or component logic
-   **DO NOT** modify styling or CSS classes
-   **ONLY** update import paths and related API calls
-   Preserve all existing functionality
-   Test thoroughly after migration

---

_Last Updated: November 2025_
