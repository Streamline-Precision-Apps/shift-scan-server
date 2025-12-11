---
applyTo: "**/*table*.{ts,tsx}"
---

# TanStack Table v8 Implementation Guide

This comprehensive guide provides detailed instructions for implementing and working with TanStack Table v8 in React applications, based on official documentation.

---

## Table of Contents

1. [Core Concepts](#core-concepts)
2. [Table Instance Setup](#table-instance-setup)
3. [Column Definitions](#column-definitions)
4. [Table State Management](#table-state-management)
5. [Sorting](#sorting)
6. [Filtering](#filtering)
7. [Pagination](#pagination)
8. [Row Selection](#row-selection)
9. [Column Features](#column-features)
10. [Row Features](#row-features)
11. [Performance Optimization](#performance-optimization)
12. [Advanced Patterns](#advanced-patterns)

---

## Core Concepts

### What is TanStack Table?

TanStack Table is a **headless UI library** - it provides the state management and logic but NOT the UI markup. You are responsible for rendering the table markup.

### Key Principles

1. **Data-driven**: Everything starts with your `data` array and `columns` definitions
2. **Modular**: Only import the features/row models you need
3. **Type-safe**: TypeScript generics ensure type safety across your table
4. **Framework agnostic**: Core logic works with React, Vue, Solid, Svelte, etc.

### Table Architecture Flow

```
Data → Table Instance → Row Models → Rendered UI
  ↓
Column Definitions
  ↓
Table State
  ↓
Features (sorting, filtering, pagination, etc.)
```

---

## Table Instance Setup

### Basic Table Setup

```typescript
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';

// 1. Define your data type
type User = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
};

// 2. Define columns (covered in detail later)
const columns: ColumnDef<User>[] = [
  // column definitions
];

// 3. Prepare your data
const data: User[] = [
  // your data array
];

// 4. Create table instance
function MyTable() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(), // Required for basic functionality
  });

  return (
    // Render UI (covered later)
  );
}
```

### Important Rules

**❌ DON'T**: Define data/columns inside the component without memoization

```typescript
function MyTable() {
  // ❌ BAD - causes infinite re-render loop
  const columns = [...];
  const data = [...];

  const table = useReactTable({ columns, data, ... });
}
```

**✅ DO**: Use stable references

```typescript
// ✅ GOOD - defined outside component
const columns = [...];

function MyTable() {
  // ✅ GOOD - memoized
  const data = useMemo(() => [...], []);

  // ✅ GOOD - from API/state management
  const data = useQuery(...).data;

  const table = useReactTable({ columns, data, ... });
}
```

---

## Column Definitions

### Column Types

There are three types of columns:

1. **Accessor Columns** - Have underlying data model (can be sorted, filtered, grouped)
2. **Display Columns** - For UI elements (buttons, checkboxes, actions)
3. **Grouping Columns** - Parent columns that group other columns

### Accessor Columns

#### Using `accessorKey`

```typescript
const columns: ColumnDef<User>[] = [
    {
        accessorKey: "firstName", // Simple string key access
        header: "First Name",
        id: "firstName", // Auto-derived from accessorKey
    },
    {
        accessorKey: "address.city", // Nested object access
        header: "City",
        id: "address.city",
    },
];
```

#### Using `accessorFn`

```typescript
const columns: ColumnDef<User>[] = [
    {
        accessorFn: (row) => `${row.firstName} ${row.lastName}`, // Custom accessor function
        id: "fullName", // Required when using accessorFn
        header: "Full Name",
    },
    {
        accessorFn: (row) => row.age * 2, // Transform data
        id: "doubleAge",
        header: "Double Age",
    },
];
```

### Display Columns

```typescript
const columns: ColumnDef<User>[] = [
    {
        id: "actions", // Required for display columns
        header: "Actions",
        cell: ({ row }) => (
            <div>
                <button onClick={() => handleEdit(row.original)}>Edit</button>
                <button onClick={() => handleDelete(row.original.id)}>
                    Delete
                </button>
            </div>
        ),
    },
    {
        id: "select",
        header: ({ table }) => (
            <input
                type="checkbox"
                checked={table.getIsAllRowsSelected()}
                onChange={table.getToggleAllRowsSelectedHandler()}
            />
        ),
        cell: ({ row }) => (
            <input
                type="checkbox"
                checked={row.getIsSelected()}
                onChange={row.getToggleSelectedHandler()}
            />
        ),
    },
];
```

### Column Helper Utility

```typescript
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<User>();

const columns = [
    // Accessor column
    columnHelper.accessor("firstName", {
        header: "First Name",
        cell: (info) => info.getValue(),
    }),

    // Accessor function column
    columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
        id: "fullName",
        header: "Full Name",
    }),

    // Display column
    columnHelper.display({
        id: "actions",
        cell: (props) => <button>Edit</button>,
    }),
];
```

### Cell Formatting

```typescript
const columns: ColumnDef<User>[] = [
    {
        accessorKey: "firstName",
        header: "First Name",
        cell: (props) => <span>{props.getValue().toUpperCase()}</span>,
    },
    {
        accessorKey: "age",
        header: "Age",
        cell: ({ row }) => (
            <span>
                {row.original.id} - {row.getValue("age")}
            </span>
        ),
    },
];
```

### Header Formatting

```typescript
const columns: ColumnDef<User>[] = [
    {
        accessorKey: "firstName",
        header: ({ column }) => (
            <button onClick={() => column.toggleSorting()}>
                First Name {column.getIsSorted() === "asc" ? "↑" : "↓"}
            </button>
        ),
    },
];
```

---

## Table State Management

### Three Ways to Manage State

#### 1. Internal State (Default)

```typescript
const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    // Table manages its own state internally
});

// Access state
console.log(table.getState().sorting);
console.log(table.getState().pagination);
```

#### 2. Initial State

```typescript
const table = useReactTable({
    columns,
    data,
    initialState: {
        sorting: [{ id: "age", desc: true }],
        pagination: { pageIndex: 0, pageSize: 25 },
        columnVisibility: { id: false },
        expanded: true,
    },
    getCoreRowModel: getCoreRowModel(),
});
```

#### 3. Controlled State (for server-side features)

```typescript
const [sorting, setSorting] = useState<SortingState>([]);
const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
});

const table = useReactTable({
    columns,
    data,
    state: {
        sorting,
        pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
});
```

---

## Sorting

### Client-Side Sorting Setup

```typescript
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
} from "@tanstack/react-table";

function MyTable() {
    const [sorting, setSorting] = useState<SortingState>([]);

    const table = useReactTable({
        columns,
        data,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(), // Enable client-side sorting
    });
}
```

### Sorting State Shape

```typescript
type SortingState = {
    id: string; // Column ID
    desc: boolean; // true = descending, false = ascending
}[];

// Example
const sorting = [
    { id: "age", desc: true }, // Sort by age descending
    { id: "firstName", desc: false }, // Then by firstName ascending
];
```

### Built-in Sorting Functions

Available sorting functions:

-   `alphanumeric` - Default for string columns
-   `alphanumericCaseSensitive` - Case-sensitive string sorting
-   `text` - Locale-aware string sorting
-   `textCaseSensitive` - Case-sensitive locale-aware sorting
-   `datetime` - For Date objects
-   `basic` - Default for non-string columns

### Custom Sorting Functions

```typescript
// Per-column custom sorting
const columns: ColumnDef<User>[] = [
    {
        accessorKey: "status",
        header: "Status",
        sortingFn: (rowA, rowB, columnId) => {
            const statusOrder = { active: 1, pending: 2, inactive: 3 };
            return (
                statusOrder[rowA.getValue(columnId)] -
                statusOrder[rowB.getValue(columnId)]
            );
        },
    },
];

// Global custom sorting function
const table = useReactTable({
    columns,
    data,
    sortingFns: {
        myCustomSort: (rowA, rowB, columnId) => {
            return rowA.original[columnId] > rowB.original[columnId] ? 1 : -1;
        },
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
});

// Use in column
const columns = [
    {
        accessorKey: "customField",
        sortingFn: "myCustomSort", // Reference by name
    },
];
```

### Disable Sorting

```typescript
// Disable for entire table
const table = useReactTable({
    enableSorting: false,
    // ...
});

// Disable for specific column
const columns = [
    {
        accessorKey: "actions",
        enableSorting: false,
    },
];
```

### Sorting Options

```typescript
const columns: ColumnDef<User>[] = [
    {
        accessorKey: "age",
        header: "Age",
        sortDescFirst: true, // Start with descending on first click
        enableSorting: true, // Enable sorting (default)
        enableMultiSort: true, // Allow multi-column sorting
        invertSorting: true, // Invert sort order (lower is better, like golf scores)
        sortUndefined: "last", // 'first' | 'last' | false | -1 | 1
    },
];

const table = useReactTable({
    enableSorting: true,
    enableSortingRemoval: true, // Allow removing sort (cycle back to none)
    enableMultiSort: true, // Enable multi-column sorting
    enableMultiRemove: true, // Allow removing individual sorts in multi-sort
    maxMultiSortColCount: 3, // Limit number of sorted columns
    isMultiSortEvent: (e) => e.shiftKey, // Customize multi-sort trigger (default: shift key)
    sortDescFirst: false, // Global setting
});
```

### Manual Server-Side Sorting

```typescript
const [sorting, setSorting] = useState<SortingState>([]);

// Fetch data based on sorting state
const { data } = useQuery({
    queryKey: ["users", sorting],
    queryFn: () => fetchUsers({ sorting }),
});

const table = useReactTable({
    columns,
    data: data ?? [],
    state: { sorting },
    onSortingChange: setSorting,
    manualSorting: true, // Disable client-side sorting
    getCoreRowModel: getCoreRowModel(),
    // Don't include getSortedRowModel
});
```

### Sorting UI Examples

```typescript
// Simple sort button
<button onClick={() => column.toggleSorting()}>
  Sort
</button>

// Sort with indicator
<button onClick={() => column.toggleSorting()}>
  {column.id}
  {column.getIsSorted() === 'asc' ? ' ↑' : column.getIsSorted() === 'desc' ? ' ↓' : ''}
</button>

// Cycle through: none → asc → desc → none
<button onClick={() => column.toggleSorting()}>
  {column.id}
  {!column.getIsSorted() && ' ⇅'}
  {column.getIsSorted() === 'asc' && ' ↑'}
  {column.getIsSorted() === 'desc' && ' ↓'}
</button>

// Clear sorting
<button onClick={() => column.clearSorting()}>
  Clear Sort
</button>

// Multi-sort indicator
<span>
  {column.getIsSorted() && (
    <span>
      {column.getIsSorted() === 'desc' ? ' ↓' : ' ↑'}
      {column.getSortIndex() + 1}
    </span>
  )}
</span>
```

---

## Filtering

### Column Filtering

#### Client-Side Column Filtering

```typescript
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    ColumnFiltersState,
} from "@tanstack/react-table";

function MyTable() {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const table = useReactTable({
        columns,
        data,
        state: { columnFilters },
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(), // Enable client-side filtering
    });
}
```

#### Column Filter State Shape

```typescript
type ColumnFiltersState = {
    id: string; // Column ID
    value: unknown; // Filter value (any type)
}[];

// Example
const columnFilters = [
    { id: "firstName", value: "john" },
    { id: "age", value: [18, 65] }, // Range filter
    { id: "status", value: ["active", "pending"] }, // Multi-select
];
```

#### Built-in Filter Functions

-   `includesString` - Case-insensitive string inclusion
-   `includesStringSensitive` - Case-sensitive string inclusion
-   `equalsString` - Case-insensitive string equality
-   `equalsStringSensitive` - Case-sensitive string equality
-   `arrIncludes` - Array includes value
-   `arrIncludesAll` - Array includes all values
-   `arrIncludesSome` - Array includes some values
-   `equals` - Loose equality
-   `weakEquals` - Weak equality
-   `inNumberRange` - Number in range [min, max]

#### Custom Filter Functions

```typescript
// Per-column filter function
const columns: ColumnDef<User>[] = [
    {
        accessorKey: "firstName",
        filterFn: (row, columnId, filterValue) => {
            const value = row.getValue(columnId) as string;
            return value.toLowerCase().includes(filterValue.toLowerCase());
        },
    },
];

// Global filter function
const table = useReactTable({
    filterFns: {
        customFilter: (row, columnId, filterValue) => {
            // Custom filter logic
            return true; // or false
        },
    },
});
```

#### Filter UI

```typescript
// Text filter
<input
  value={(column.getFilterValue() ?? '') as string}
  onChange={(e) => column.setFilterValue(e.target.value)}
  placeholder="Search..."
/>

// Number range filter
<div>
  <input
    type="number"
    value={(column.getFilterValue() as [number, number])?.[0] ?? ''}
    onChange={(e) =>
      column.setFilterValue((old: [number, number]) =>
        [e.target.value, old?.[1]]
      )
    }
    placeholder="Min"
  />
  <input
    type="number"
    value={(column.getFilterValue() as [number, number])?.[1] ?? ''}
    onChange={(e) =>
      column.setFilterValue((old: [number, number]) =>
        [old?.[0], e.target.value]
      )
    }
    placeholder="Max"
  />
</div>

// Multi-select filter
<select
  multiple
  value={(column.getFilterValue() ?? []) as string[]}
  onChange={(e) => {
    const values = Array.from(e.target.selectedOptions, option => option.value);
    column.setFilterValue(values.length ? values : undefined);
  }}
>
  <option value="active">Active</option>
  <option value="pending">Pending</option>
  <option value="inactive">Inactive</option>
</select>

// Clear filter
<button onClick={() => column.setFilterValue(undefined)}>
  Clear Filter
</button>
```

### Global Filtering

#### Setup Global Filter

```typescript
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    GlobalFilterFn,
} from "@tanstack/react-table";

function MyTable() {
    const [globalFilter, setGlobalFilter] = useState("");

    const table = useReactTable({
        columns,
        data,
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: "includesString", // or custom function
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });
}
```

#### Global Filter UI

```typescript
<input
    value={globalFilter ?? ""}
    onChange={(e) => table.setGlobalFilter(e.target.value)}
    placeholder="Search all columns..."
/>
```

#### Fuzzy Filtering (Recommended for Global Search)

```typescript
import { rankItem } from "@tanstack/match-sorter-utils";

// Install: npm install @tanstack/match-sorter-utils

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({ itemRank }); // Store rank for sorting
    return itemRank.passed;
};

const table = useReactTable({
    columns,
    data,
    filterFns: { fuzzy: fuzzyFilter },
    globalFilterFn: "fuzzy",
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
});
```

### Faceted Filters (Autocomplete Values)

```typescript
import {
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFacetedMinMaxValues,
} from "@tanstack/react-table";

const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(), // For unique values
    getFacetedMinMaxValues: getFacetedMinMaxValues(), // For min/max values
});

// Use faceted values in UI
const uniqueValues = Array.from(column.getFacetedUniqueValues().keys())
    .sort()
    .slice(0, 5000);

const [min, max] = column.getFacetedMinMaxValues() ?? [0, 100];
```

### Manual Server-Side Filtering

```typescript
const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

const { data } = useQuery({
    queryKey: ["users", columnFilters],
    queryFn: () => fetchUsers({ filters: columnFilters }),
});

const table = useReactTable({
    columns,
    data: data ?? [],
    state: { columnFilters },
    onColumnFiltersChange: setColumnFilters,
    manualFiltering: true, // Disable client-side filtering
    getCoreRowModel: getCoreRowModel(),
});
```

---

## Pagination

### Client-Side Pagination

```typescript
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    PaginationState,
} from "@tanstack/react-table";

function MyTable() {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 25,
    });

    const table = useReactTable({
        columns,
        data,
        state: { pagination },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(), // Enable pagination
    });
}
```

### Pagination UI

```typescript
<div className="pagination">
    {/* First page */}
    <button
        onClick={() => table.firstPage()}
        disabled={!table.getCanPreviousPage()}
    >
        {"<<"}
    </button>

    {/* Previous page */}
    <button
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
    >
        {"<"}
    </button>

    {/* Current page indicator */}
    <span>
        Page {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount()}
    </span>

    {/* Next page */}
    <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
        {">"}
    </button>

    {/* Last page */}
    <button onClick={() => table.lastPage()} disabled={!table.getCanNextPage()}>
        {">>"}
    </button>

    {/* Page size selector */}
    <select
        value={table.getState().pagination.pageSize}
        onChange={(e) => table.setPageSize(Number(e.target.value))}
    >
        {[10, 25, 50, 100].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
                Show {pageSize}
            </option>
        ))}
    </select>

    {/* Go to page */}
    <input
        type="number"
        min={1}
        max={table.getPageCount()}
        defaultValue={table.getState().pagination.pageIndex + 1}
        onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            table.setPageIndex(page);
        }}
    />
</div>
```

### Manual Server-Side Pagination

```typescript
const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
});

const { data } = useQuery({
    queryKey: ["users", pagination],
    queryFn: () =>
        fetchUsers({
            page: pagination.pageIndex,
            pageSize: pagination.pageSize,
        }),
});

const table = useReactTable({
    columns,
    data: data?.users ?? [],
    pageCount: data?.pageCount ?? -1, // Provide total page count from server
    state: { pagination },
    onPaginationChange: setPagination,
    manualPagination: true, // Disable client-side pagination
    getCoreRowModel: getCoreRowModel(),
});
```

---

## Row Selection

### Setup Row Selection

```typescript
import {
    useReactTable,
    getCoreRowModel,
    RowSelectionState,
} from "@tanstack/react-table";

function MyTable() {
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const table = useReactTable({
        columns,
        data,
        state: { rowSelection },
        onRowSelectionChange: setRowSelection,
        enableRowSelection: true, // Enable for all rows
        // Or conditionally:
        // enableRowSelection: (row) => row.original.age > 18,
        getCoreRowModel: getCoreRowModel(),
    });

    // Get selected rows
    const selectedRows = table.getSelectedRowModel().rows;
    console.log(selectedRows);
}
```

### Row Selection State Shape

```typescript
type RowSelectionState = Record<string, boolean>;

// Example (using row index as ID by default)
const rowSelection = {
    "0": true, // First row selected
    "2": true, // Third row selected
    "5": false, // Fifth row explicitly deselected
};

// Using custom row IDs
const table = useReactTable({
    getRowId: (originalRow) => originalRow.uuid, // Use UUID as row ID
    // ...
});

// Now selection uses UUIDs
const rowSelection = {
    "uuid-123": true,
    "uuid-456": true,
};
```

### Single Row Selection (Radio Buttons)

```typescript
const table = useReactTable({
    columns,
    data,
    enableMultiRowSelection: false, // Only one row at a time
    getCoreRowModel: getCoreRowModel(),
});
```

### Selection Column

```typescript
const columns: ColumnDef<User>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <input
                type="checkbox"
                checked={table.getIsAllRowsSelected()}
                indeterminate={table.getIsSomeRowsSelected()}
                onChange={table.getToggleAllRowsSelectedHandler()}
            />
        ),
        cell: ({ row }) => (
            <input
                type="checkbox"
                checked={row.getIsSelected()}
                disabled={!row.getCanSelect()}
                onChange={row.getToggleSelectedHandler()}
            />
        ),
    },
    // ... other columns
];
```

### Selection APIs

```typescript
// Table-level
table.toggleAllRowsSelected(true); // Select all
table.toggleAllRowsSelected(false); // Deselect all
table.resetRowSelection(); // Reset to initial state
table.getIsAllRowsSelected(); // All rows selected?
table.getIsSomeRowsSelected(); // Some rows selected?
table.getSelectedRowModel(); // Get selected rows
table.getState().rowSelection; // Get selection state

// Row-level
row.toggleSelected(true); // Select row
row.getIsSelected(); // Is row selected?
row.getCanSelect(); // Can row be selected?
```

### Selecting Rows Programmatically

```typescript
// Select specific rows by ID
table.setRowSelection({
    "row-1": true,
    "row-5": true,
    "row-10": true,
});

// Select using index
table.setRowSelection((old) => ({
    ...old,
    "0": true, // Select first row
}));

// Toggle selection
table.setRowSelection((old) => ({
    ...old,
    "3": !old["3"],
}));
```

---

## Column Features

### Column Visibility

#### Setup Column Visibility

```typescript
import { VisibilityState } from "@tanstack/react-table";

const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false, // Hide ID column by default
    email: false, // Hide email column
});

const table = useReactTable({
    columns,
    data,
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
});
```

#### Disable Hiding for Specific Columns

```typescript
const columns: ColumnDef<User>[] = [
    {
        accessorKey: "id",
        header: "ID",
        enableHiding: false, // Cannot be hidden
    },
];
```

#### Column Visibility UI

```typescript
// Toggle menu
<div>
  {table.getAllLeafColumns().map((column) => (
    <div key={column.id}>
      <label>
        <input
          type="checkbox"
          checked={column.getIsVisible()}
          disabled={!column.getCanHide()}
          onChange={column.getToggleVisibilityHandler()}
        />
        {column.id}
      </label>
    </div>
  ))}
</div>

// Toggle all columns
<button onClick={() => table.toggleAllColumnsVisible()}>
  Toggle All
</button>
```

#### Using Visible Columns in Rendering

```typescript
// ❌ DON'T use these (they don't respect visibility)
table.getAllLeafColumns();
row.getAllCells();

// ✅ DO use these (they respect visibility)
table.getVisibleLeafColumns();
row.getVisibleCells();
```

### Column Ordering

```typescript
import { ColumnOrderState } from "@tanstack/react-table";

const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([
    "firstName",
    "lastName",
    "age",
    "email",
]);

const table = useReactTable({
    columns,
    data,
    state: { columnOrder },
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
});

// Reorder columns programmatically
table.setColumnOrder(["age", "firstName", "lastName", "email"]);
```

### Column Pinning

```typescript
import { ColumnPinningState } from "@tanstack/react-table";

const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: ["select", "firstName"], // Pin to left
    right: ["actions"], // Pin to right
});

const table = useReactTable({
    columns,
    data,
    state: { columnPinning },
    onColumnPinningChange: setColumnPinning,
    getCoreRowModel: getCoreRowModel(),
});

// Pin column programmatically
column.pin("left"); // Pin to left
column.pin("right"); // Pin to right
column.pin(false); // Unpin
```

#### Column Pinning with Sticky CSS

```typescript
// Get pinned columns
const leftColumns = table.getLeftLeafColumns();
const centerColumns = table.getCenterLeafColumns();
const rightColumns = table.getRightLeafColumns();

// Render with sticky positioning
<th
    style={{
        position: "sticky",
        left: header.column.getStart("left"), // For left-pinned
        // or
        right: header.column.getAfter("right"), // For right-pinned
    }}
>
    {/* header content */}
</th>;
```

### Column Sizing

```typescript
const columns: ColumnDef<User>[] = [
    {
        accessorKey: "firstName",
        header: "First Name",
        size: 200, // Default size
        minSize: 100, // Minimum size
        maxSize: 400, // Maximum size
    },
];

const table = useReactTable({
    columns,
    data,
    columnResizeMode: "onChange", // 'onChange' | 'onEnd' (default)
    getCoreRowModel: getCoreRowModel(),
});
```

#### Column Resizing UI

```typescript
<th style={{ width: header.getSize() }}>
    {/* header content */}

    {/* Resize handle */}
    <div
        onMouseDown={header.getResizeHandler()}
        onTouchStart={header.getResizeHandler()}
        className={header.column.getIsResizing() ? "resizing" : ""}
        style={{
            position: "absolute",
            right: 0,
            top: 0,
            height: "100%",
            width: "5px",
            cursor: "col-resize",
            userSelect: "none",
            touchAction: "none",
        }}
    />
</th>
```

---

## Row Features

### Row Expansion

```typescript
import {
    useReactTable,
    getCoreRowModel,
    getExpandedRowModel,
    ExpandedState,
} from "@tanstack/react-table";

const [expanded, setExpanded] = useState<ExpandedState>({});

const table = useReactTable({
    columns,
    data, // Data with subRows property for nested data
    state: { expanded },
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.subRows, // Tell table where to find sub-rows
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
});
```

#### Expansion UI

```typescript
{
    row.getCanExpand() && (
        <button onClick={() => row.toggleExpanded()}>
            {row.getIsExpanded() ? "▼" : "▶"}
        </button>
    );
}

{
    row.getIsExpanded() && <div>{/* Render expanded content */}</div>;
}
```

### Row Pinning

```typescript
import { RowPinningState } from "@tanstack/react-table";

const [rowPinning, setRowPinning] = useState<RowPinningState>({
    top: ["row-id-1"], // Pin to top
    bottom: ["row-id-99"], // Pin to bottom
});

const table = useReactTable({
    columns,
    data,
    state: { rowPinning },
    onRowPinningChange: setRowPinning,
    getCoreRowModel: getCoreRowModel(),
});

// Get pinned rows
const topRows = table.getTopRows();
const centerRows = table.getCenterRows();
const bottomRows = table.getBottomRows();
```

### Grouping

```typescript
import {
    useReactTable,
    getCoreRowModel,
    getGroupedRowModel,
    getExpandedRowModel,
    GroupingState,
} from "@tanstack/react-table";

const [grouping, setGrouping] = useState<GroupingState>(["department"]);

const table = useReactTable({
    columns,
    data,
    state: { grouping },
    onGroupingChange: setGrouping,
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    groupedColumnMode: "reorder", // 'reorder' | 'remove' | false
});
```

#### Aggregation Functions

```typescript
const columns: ColumnDef<User>[] = [
    {
        accessorKey: "salary",
        header: "Salary",
        aggregationFn: "sum", // Built-in: sum, min, max, extent, mean, median, unique, uniqueCount, count
        aggregatedCell: ({ getValue }) => getValue(),
    },
    {
        accessorKey: "age",
        header: "Age",
        aggregationFn: "mean",
        aggregatedCell: ({ getValue }) => `Avg: ${getValue()}`,
    },
];
```

---

## Performance Optimization

### Data Memoization

```typescript
// ✅ GOOD - Memoize data
const data = useMemo(() => fetchData(), []);

// ✅ GOOD - Data from stable source
const { data } = useQuery("users", fetchUsers);

// ❌ BAD - Recreated every render
function MyTable() {
    const data = fetchData(); // Creates new array every render
}
```

### Column Memoization

```typescript
// ✅ GOOD - Define outside component
const columns = [
    // column definitions
];

// ✅ GOOD - Memoize if must be inside
const columns = useMemo(
    () => [
        // column definitions
    ],
    []
);

// ❌ BAD - Recreated every render
function MyTable() {
    const columns = [
        /* ... */
    ]; // Creates new array every render
}
```

### Row Models

Only import row models you actually need:

```typescript
import {
    getCoreRowModel, // ✅ Always needed
    getSortedRowModel, // ✅ If using sorting
    getFilteredRowModel, // ✅ If using filtering
    getPaginationRowModel, // ✅ If using pagination
    getGroupedRowModel, // ✅ If using grouping
    getExpandedRowModel, // ✅ If using expansion
    getFacetedRowModel, // ✅ If using faceting
    getFacetedUniqueValues, // ✅ If using faceted unique values
    getFacetedMinMaxValues, // ✅ If using faceted min/max
} from "@tanstack/react-table";

// Only include the ones you need
const table = useReactTable({
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // Don't include others if not used
});
```

### Virtualization

For very large datasets (1000+ rows), use virtualization:

```typescript
import { useVirtualizer } from "@tanstack/react-virtual";

function MyTable() {
    const tableContainerRef = useRef<HTMLDivElement>(null);

    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
    });

    const { rows } = table.getRowModel();

    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => tableContainerRef.current,
        estimateSize: () => 50, // Estimate row height
        overscan: 10,
    });

    return (
        <div
            ref={tableContainerRef}
            style={{ height: "400px", overflow: "auto" }}
        >
            <div style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const row = rows[virtualRow.index];
                    return (
                        <div
                            key={row.id}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: `${virtualRow.size}px`,
                                transform: `translateY(${virtualRow.start}px)`,
                            }}
                        >
                            {/* Render row */}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
```

---

## Advanced Patterns

### Server-Side Everything

```typescript
function ServerSideTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['users', sorting, columnFilters, pagination],
    queryFn: () => fetchUsers({
      sorting,
      filters: columnFilters,
      page: pagination.pageIndex,
      pageSize: pagination.pageSize,
    }),
  });

  const table = useReactTable({
    columns,
    data: data?.users ?? [],
    pageCount: data?.pageCount ?? 0,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    // Render table
  );
}
```

### Render Patterns

#### Complete Table Example

```typescript
import { flexRender } from "@tanstack/react-table";

<table>
    <thead>
        {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                    <th key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : (
                            <div>
                                {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                                {header.column.getCanSort() && (
                                    <button
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        {header.column.getIsSorted() === "asc"
                                            ? " ↑"
                                            : header.column.getIsSorted() ===
                                              "desc"
                                            ? " ↓"
                                            : " ⇅"}
                                    </button>
                                )}
                                {header.column.getCanFilter() && (
                                    <input
                                        value={
                                            (header.column.getFilterValue() ??
                                                "") as string
                                        }
                                        onChange={(e) =>
                                            header.column.setFilterValue(
                                                e.target.value
                                            )
                                        }
                                    />
                                )}
                            </div>
                        )}
                    </th>
                ))}
            </tr>
        ))}
    </thead>
    <tbody>
        {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                        {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                        )}
                    </td>
                ))}
            </tr>
        ))}
    </tbody>
    <tfoot>
        {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                    <th key={header.id}>
                        {header.isPlaceholder
                            ? null
                            : flexRender(
                                  header.column.columnDef.footer,
                                  header.getContext()
                              )}
                    </th>
                ))}
            </tr>
        ))}
    </tfoot>
</table>;
```

### Custom Features

You can create custom features for TanStack Table:

```typescript
import { TableFeature } from "@tanstack/react-table";

// Define custom feature
const MyCustomFeature: TableFeature = {
    getInitialState: (state) => ({
        ...state,
        myCustomState: {},
    }),

    getDefaultOptions: (table) => ({
        enableMyFeature: true,
    }),

    createTable: (table) => ({
        myCustomMethod: () => {
            // Custom table method
        },
    }),

    createRow: (row, table) => ({
        myCustomRowMethod: () => {
            // Custom row method
        },
    }),

    createColumn: (column, table) => ({
        myCustomColumnMethod: () => {
            // Custom column method
        },
    }),
};

// Use custom feature
const table = useReactTable({
    columns,
    data,
    _features: [MyCustomFeature],
    getCoreRowModel: getCoreRowModel(),
});
```

---

## Best Practices Summary

### ✅ DO

1. **Memoize data and columns** to prevent infinite re-renders
2. **Use TypeScript generics** for type safety
3. **Import only needed row models** for better performance
4. **Use `flexRender`** for rendering headers/cells with custom JSX
5. **Use controlled state** for server-side features
6. **Use `getVisibleCells()`** and `getVisibleLeafColumns()`\*\* when column visibility is enabled
7. **Implement proper loading states** for async data
8. **Use fuzzy filtering** for global search
9. **Virtualize large datasets** (1000+ rows)
10. **Follow TanStack Query patterns** for server-side data fetching

### ❌ DON'T

1. **Don't define data/columns inside component** without memoization
2. **Don't import unnecessary row models** (increases bundle size)
3. **Don't mutate table state directly** (use setter functions)
4. **Don't use both `initialState` and `state`** for the same property
5. **Don't forget `manualSorting/Filtering/Pagination`** when doing server-side
6. **Don't use `getAllCells()` when visibility is enabled** (use `getVisibleCells()`)
7. **Don't skip `getCoreRowModel()`** (it's always required)
8. **Don't render all rows** for large datasets (use virtualization)

---

## Quick Reference

### Essential Imports

```typescript
import {
    // Core
    useReactTable,
    getCoreRowModel,
    flexRender,

    // Column Types
    ColumnDef,
    createColumnHelper,

    // Row Models
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getExpandedRowModel,
    getGroupedRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFacetedMinMaxValues,

    // State Types
    SortingState,
    ColumnFiltersState,
    PaginationState,
    RowSelectionState,
    ExpandedState,
    GroupingState,
    ColumnOrderState,
    ColumnSizingState,
    VisibilityState,
    ColumnPinningState,

    // Filter Functions
    FilterFn,

    // Custom Features
    TableFeature,
} from "@tanstack/react-table";
```

### Common Table Options

```typescript
const table = useReactTable({
    // Required
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),

    // State
    state: {
        /* ... */
    },
    initialState: {
        /* ... */
    },

    // Sorting
    enableSorting: true,
    manualSorting: false,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,

    // Filtering
    enableFilters: true,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    globalFilterFn: "includesString",
    manualFiltering: false,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,

    // Pagination
    manualPagination: false,
    pageCount: -1,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,

    // Row Selection
    enableRowSelection: true,
    enableMultiRowSelection: true,
    onRowSelectionChange: setRowSelection,

    // Column Visibility
    enableHiding: true,
    onColumnVisibilityChange: setColumnVisibility,

    // Column Ordering
    onColumnOrderChange: setColumnOrder,

    // Column Pinning
    enablePinning: true,
    onColumnPinningChange: setColumnPinning,

    // Expanding
    getExpandedRowModel: getExpandedRowModel(),
    onExpandedChange: setExpanded,

    // Grouping
    enableGrouping: true,
    getGroupedRowModel: getGroupedRowModel(),
    onGroupingChange: setGrouping,

    // Faceting
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),

    // Misc
    getRowId: (originalRow) => originalRow.id,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    autoResetAll: false,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
});
```

---

## Migration from Previous Versions

If migrating from React Table v7, key changes:

1. **Package name**: `react-table` → `@tanstack/react-table`
2. **Hook name**: `useTable` → `useReactTable`
3. **Plugins**: No more plugins, use row models and table options
4. **Column definitions**: Use `ColumnDef<T>` type
5. **State management**: More explicit (state/onStateChange pattern)
6. **Filter functions**: Now in `filterFns` table option
7. **Custom cell rendering**: Use `cell` property in column def
8. **Header groups**: Use `getHeaderGroups()` instead of `headerGroups`
9. **Pagination**: Use `getPaginationRowModel()` instead of `usePagination` plugin

---

## Resources

-   [Official Documentation](https://tanstack.com/table/latest)
-   [GitHub Repository](https://github.com/TanStack/table)
-   [Examples](https://tanstack.com/table/latest/docs/framework/react/examples)
-   [API Reference](https://tanstack.com/table/latest/docs/api/core/table)

---

**Last Updated**: December 2024  
**TanStack Table Version**: v8.x
