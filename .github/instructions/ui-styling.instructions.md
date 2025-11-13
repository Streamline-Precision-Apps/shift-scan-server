# UI Styling Instructions

This file contains comprehensive styling guidelines for ensuring visual consistency across the application. Following these guidelines will maintain a uniform look and feel in all UI components.

## Core Design System

### Typography

- **Headers:**
  - Main headers: `text-xl font-bold`
  - Section headers: `font-semibold text-sm mb-2`
  - Form labels: `text-xs font-semibold mb-1`
- **Body Text:**
  - Standard text: `text-sm`
  - Description text: `text-xs text-gray-600`
  - Error messages: `text-xs text-red-600`
  - Disabled/placeholder: `text-gray-500`
  - Emphasized: `font-semibold`

### Colors

- **Backgrounds:**
  - Main application: `bg-white`
  - Log entry containers: `bg-slate-50`
  - Modals overlay: `bg-black bg-opacity-40`
  - Form fields: `bg-white` (for contrast against container backgrounds)
  - Error backgrounds: `bg-red-400 bg-opacity-20`
- **Borders:**
  - Standard borders: `border` (default gray)
  - Focused fields: `border-blue-500`
  - Error states: `border-red-300`
- **Text Colors:**
  - Primary text: default (dark)
  - Secondary text: `text-gray-600`
  - Error text: `text-red-600`
  - Success text: `text-green-800`

## Container Styling

### Modal Containers

```jsx
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
  <div className="bg-white rounded-lg shadow-lg w-[600px] max-h-[80vh] overflow-y-auto no-scrollbar">
    <div className="px-6 py-4">{/* Modal content */}</div>
  </div>
</div>
```

### Section Containers

- **Standard section container:**

  ```jsx
  <div className="bg-slate-50 flex flex-col gap-4 mb-2 border p-2 rounded relative">
    {/* Section content */}
  </div>
  ```

- **Form sections:**
  ```jsx
  <div className="border rounded-lg p-4 bg-gray-50 mt-4">
    <h3 className="font-semibold text-sm mb-2">{sectionTitle}</h3>
    <p className="text-xs text-gray-600 mb-2">{sectionDescription}</p>
    {/* Form content */}
  </div>
  ```

### Spacing Guidelines

- **Vertical spacing:**
  - Between major sections: `mt-4` or `mb-4`
  - Between form groups: `gap-4`
  - Between related elements: `mb-2` or `gap-2`
- **Horizontal spacing:**
  - Between inline elements: `gap-1` or `gap-2`
  - Container padding: `p-2` for log entries, `p-4` for major sections
  - Form padding: `px-6 py-4`

## Form Elements

### Input Fields

```jsx
<div className="flex flex-col">
  <Label htmlFor="fieldName" className="text-xs">
    Field Label
  </Label>
  <Input
    name="fieldName"
    type="text"
    placeholder="Placeholder text"
    value={value}
    onChange={handler}
    className="bg-white w-[350px] text-xs"
  />
</div>
```

### Select Components

```jsx
<div className="flex flex-col">
  <Label htmlFor="selectField" className="text-xs">
    Select Label
  </Label>
  <Select onValueChange={handler} value={value}>
    <SelectTrigger className="bg-white w-[350px] text-xs">
      <SelectValue placeholder="Select an option" />
    </SelectTrigger>
    <SelectContent>
      {options.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>
```

### Combobox

```jsx
<SingleCombobox
  label="Field Label"
  options={optionsArray}
  value={selectedValue}
  onChange={handleChange}
  className="bg-white w-[350px] text-xs"
/>
```

### Form Layout

- **Row arrangement:**

  ```jsx
  <div className="flex flex-row items-end gap-2">{/* Input fields */}</div>
  ```

- **Column arrangement:**
  ```jsx
  <div className="flex flex-col gap-4">{/* Form groups */}</div>
  ```

## Button Styling

### Standard Buttons

- **Primary action:**

  ```jsx
  <Button
    type="submit"
    className="bg-sky-500 hover:bg-sky-400 text-white px-4 py-2 rounded"
  >
    Submit
  </Button>
  ```

- **Secondary action:**
  ```jsx
  <Button
    type="button"
    variant="outline"
    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
  >
    Cancel
  </Button>
  ```

### Special Purpose Buttons

- **Delete button:**

  ```jsx
  <Button
    type="button"
    variant="ghost"
    size="icon"
    onClick={deleteHandler}
    className="absolute top-0 right-0"
  >
    <X className="w-4 h-4" color="red" />
  </Button>
  ```

- **Add button:**

  ```jsx
  <Button
    type="button"
    onClick={addHandler}
    disabled={isDisabled}
    className={isDisabled ? "opacity-50" : ""}
  >
    <Plus className="h-8 w-8" color="white" />
  </Button>
  ```

- **Undo button:**
  ```jsx
  <Button
    type="button"
    size="default"
    className="w-[50px]"
    onClick={undoHandler}
  >
    <p className="text-xs">Undo</p>
  </Button>
  ```

## Status Indicators

### Badges

```jsx
<Badge
  variant="secondary"
  className="rounded-full px-2 py-1 bg-blue-500 text-white hover:bg-blue-500"
>
  {count}
</Badge>
```

### Status Messages

- **Error message:**

  ```jsx
  <div className="text-xs text-red-600 mb-2 bg-red-400 bg-opacity-20 px-6 py-4 rounded">
    <span className="font-bold">Error:</span> {errorMessage}
  </div>
  ```

- **Loading state:**
  ```jsx
  {
    loading && <div className="text-gray-500">Loading...</div>;
  }
  ```

## Component-Specific Styling

### Export Modal Styles

```jsx
// Main Export Modal Structure
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
  <div className="bg-white rounded-lg shadow-lg w-[600px] max-h-[80vh] overflow-y-auto no-scrollbar px-6 py-4">
    <div className="flex flex-col gap-4 items-center w-full relative">
      {/* Header Section */}
      <div className="flex flex-col w-full border-b border-gray-200 pb-3">
        <div className="flex flex-row gap-2 items-center">
          <h2 className="text-xl font-bold">Export Form Data</h2>
          <Download className="h-5 w-5" />
        </div>
        <p className="text-xs text-gray-600 pt-1">
          Select a date range, apply filters, and choose your preferred export
          format
        </p>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={closeModal}
          className="absolute top-0 right-0 cursor-pointer"
        >
          <X width={20} height={20} />
        </Button>
      </div>
      {/* Date Range Section */}
      <div className="flex flex-col gap-6 w-full px-2 py-4">
        <div className="w-full flex flex-col">
          <Label className="font-semibold text-sm ">Date Range</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-3/4 justify-between font-normal"
              >
                {dateRange.from && dateRange.to
                  ? `${format(dateRange.from, "PPP")} - ${format(
                      dateRange.to,
                      "PPP"
                    )}`
                  : "Select date range"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <div className="p-4 justify-center flex flex-col items-center">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDateSelect}
                  autoFocus
                />
                {(dateRange.from || dateRange.to) && (
                  <Button
                    variant="outline"
                    className="w-1/2 text-xs text-blue-600 hover:underline"
                    onClick={handleClearDateRange}
                    type="button"
                  >
                    Clear date range
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        {/* Export format selection */}
        <div className="w-full">
          <h3 className="font-semibold text-sm mb-2">Export Format</h3>
          <div className="flex flex-row w-1/2 gap-4 border border-gray-200 rounded-md p-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="exportFormat"
                value="csv"
                checked={exportFormat === "csv"}
                onChange={() => setExportFormat("csv")}
                className="accent-blue-600"
              />
              <span className="text-xs">CSV</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="exportFormat"
                value="xlsx"
                checked={exportFormat === "xlsx"}
                onChange={() => setExportFormat("xlsx")}
                className="accent-green-600"
              />
              <span className="text-xs">Excel (XLSX)</span>
            </label>
          </div>
        </div>
      </div>
      {/* Action buttons */}
      <div className="flex flex-row gap-3 w-full justify-end border-t border-gray-200 pt-4">
        <Button
          variant="outline"
          className=" bg-gray-200 hover:bg-gray-300 text-gray-800"
          onClick={closeModal}
        >
          Cancel
        </Button>
        <Button
          className=" bg-sky-500 hover:bg-sky-400 text-white disabled:opacity-50"
          onClick={() => exportFormat && onExport(exportFormat, dateRange)}
          disabled={!exportFormat}
        >
          Export
        </Button>
      </div>
    </div>
  </div>
</div>
```

#### Styling Guidelines

1. **Layout Structure**

   - Modal width: Fixed at 600px (`w-[600px]`)
   - Max height: 80vh with scrolling (`max-h-[80vh]`)
   - Inner padding: `px-6 py-4`
   - Content spacing: `gap-4`

2. **Section Styling**

   - Section dividers: `border-t border-gray-200 pt-4`
   - Section headers: `font-semibold text-sm mb-2`
   - Description text: `text-xs text-gray-600 pt-1`

3. **Interactive Elements**

   - Radio buttons: CSV uses `accent-blue-600`, Excel uses `accent-green-600`
   - Date range selector: `w-3/4` width with outline variant
   - Buttons use consistent height without size prop

4. **Specific Components**

   - Format selection container: `w-1/2 gap-4 border border-gray-200 rounded-md p-4`
   - Action buttons aligned to right with `justify-end`
   - Calendar popover: `w-auto overflow-hidden p-0` with centered content

5. **State Management**
   - Disabled states: `disabled:opacity-50`
   - Clear date range button shows conditionally
   - Format selection required for export action

#### Header Section

```jsx
{
  /* Title Section */
}
<div className="flex flex-col w-full">
  <div className="flex flex-row gap-2 items-center">
    <h2 className="text-xl font-bold">Export Data</h2>
    <Download className="h-5 w-5" />
  </div>
  <p className="text-xs text-gray-600 pt-1">Description text here</p>
</div>;

{
  /* Close Button */
}
<Button
  type="button"
  variant="ghost"
  size="icon"
  onClick={onClose}
  className="absolute top-0 right-0 cursor-pointer"
>
  <X width={20} height={20} />
</Button>;
```

#### Date Range Section

```jsx
<div className="w-full flex flex-col border-t border-gray-200 pt-4">
  <Label className="font-semibold text-sm">Date Range</Label>
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline" className="w-1/2 justify-between font-normal">
        {dateRangeText}
        <ChevronDownIcon />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
      <div className="p-4 justify-center flex flex-col items-center">
        <Calendar />
        {/* Clear button if needed */}
        <Button
          variant="outline"
          className="w-1/2 text-xs text-blue-600 hover:underline"
        >
          Clear date range
        </Button>
      </div>
    </PopoverContent>
  </Popover>
</div>
```

#### Format Selection Section

```jsx
<div className="mt-4 w-full">
  <h3 className="font-semibold text-sm mb-2">Export Format</h3>
  <div className="flex flex-row w-1/2 gap-4 border border-gray-200 rounded-md p-4">
    {/* Radio options */}
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="radio" className="accent-blue-600" />
      <span className="text-xs">Format Option</span>
    </label>
  </div>
</div>
```

#### Action Buttons

```jsx
<div className="flex flex-row gap-3 w-full mb-2 mt-4 border-t border-gray-200 pt-4">
  <Button
    size="sm"
    variant="outline"
    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
  >
    Cancel
  </Button>
  <Button
    size="sm"
    className="flex-1 bg-sky-500 hover:bg-sky-400 text-white disabled:opacity-50"
  >
    Export
  </Button>
</div>
```

#### Styling Guidelines

1. **Layout Structure**

   - Modal width: Fixed at 600px (`w-[600px]`)
   - Max height: 80vh with scrolling (`max-h-[80vh]`)
   - Inner padding: `px-6 py-4`
   - Sections spacing: `gap-4`

2. **Section Styling**

   - Section dividers: `border-t border-gray-200 pt-4`
   - Section headers: `font-semibold text-sm mb-2`
   - Description text: `text-xs text-gray-600`

3. **Interactive Elements**

   - Buttons width: Use `flex-1` for equal widths
   - Radio buttons: Use `accent-blue-600` for blue theme
   - Popover width: `w-1/2` for date range selector

4. **Specific Components**

   - Date Range Button: `variant="outline" w-1/2 justify-between font-normal`
   - Format Selection: Border container with `rounded-md p-4`
   - Action buttons: Full width with equal sizing

5. **Responsive Behavior**
   - Container maintains fixed width on larger screens
   - Scrollable content for overflow
   - No horizontal scrolling (`no-scrollbar`)

### Timesheet Sections

- Use consistent styling for all log entry types (Trucking, Maintenance, Equipment, Tasco)
- Maintain consistent input widths across all similar fields
- Follow the pattern of using `bg-slate-50` for container backgrounds and `bg-white` for input fields

### Modal Header Structure

```jsx
<div className="mb-6 relative">
  <Button
    type="button"
    variant="ghost"
    size="icon"
    onClick={onClose}
    className="absolute top-0 right-0 cursor-pointer"
  >
    <X width={20} height={20} />
  </Button>
  <div className="gap-2 flex flex-col">
    <h2 className="text-xl font-bold">{modalTitle}</h2>
    <p className="text-xs text-gray-600">{modalDescription}</p>
  </div>
</div>
```

## Best Practices

1. **Consistency**

   - Use the same styling for similar components across the application
   - Maintain consistent spacing, sizing, and color patterns
   - Match styling between Create and Edit versions of similar components

2. **Accessibility**

   - Ensure adequate color contrast for text elements
   - Include proper labels for all form fields
   - Use appropriate text sizes (minimum `text-xs`) for readability

3. **Responsive Design**

   - Use flexible layouts that adapt to different screen sizes
   - Consider mobile viewports when designing components
   - Test UI on various screen sizes to ensure proper rendering

4. **Visual Hierarchy**

   - Use size, color, and spacing to indicate importance
   - Group related information visually
   - Maintain consistent visual weight across similar components

5. **Error Handling**
   - Clearly mark required fields
   - Provide visible error messages near the relevant fields
   - Use consistent error styling throughout the application
