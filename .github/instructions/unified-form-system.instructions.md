# Unified Form System Architecture - FormBuilder as Central Source of Truth

## Overview

This instruction file guides the implementation of a unified form system that eliminates type fragmentation and data transformation complexity. FormBuilder is the canonical source of truth for form structure.

## Problem Statement

### Current Issues

1. **Type Fragmentation**: Multiple definitions of FormTemplate, FormGrouping, FormField across components
2. **Excessive Transformations**: 4+ conversion functions in page.tsx (convertToLegacyFormTemplate, convertFormValuesToString, etc.)
3. **Component Complexity**: Each child component redefines types and performs manual conversions
4. **Code Duplication**: ManagerFormApprovalSchema duplicated in 4+ files
5. **Tight Coupling**: Components depend on pre-processed data structures

### Affected Files

- `/client/app/v1/(routes)/hamburger/inbox/formSubmission/[id]/page.tsx` (~750 lines)
- `/client/app/v1/(routes)/hamburger/inbox/formSubmission/[id]/_components/formDraft.tsx`
- `/client/app/v1/(routes)/hamburger/inbox/formSubmission/[id]/_components/submittedForms.tsx`
- `/client/app/v1/(routes)/hamburger/inbox/formSubmission/[id]/_components/SubmittedFormsApproval.tsx`
- `/client/app/v1/(routes)/hamburger/inbox/formSubmission/[id]/_components/managerFormApproval.tsx`
- `/client/app/v1/(routes)/hamburger/inbox/formSubmission/[id]/_components/managerFormEdit.tsx`
- `/client/app/v1/(routes)/hamburger/inbox/_components/FormFieldRenderer.tsx`
- `/client/app/admins/forms/_components/RenderFields/RenderFields.tsx`

## Architecture

### Central Principle

**FormBuilder is the source of truth** → Types defined in FormBuilder flow through submission system with zero transformation

### Data Flow

```
FormBuilder (Design)
    ↓
FormTemplate with FormField[], Grouping[], Options[]
    ↓
API Response
    ↓
Normalization Layer (minimal, one-time conversion)
    ↓
Form Context (provides normalized data)
    ↓
Components (consume directly, no transformation)
```

## Implementation Phases

### Phase 1: Create Unified Type System

**File**: `/client/app/lib/types/forms.ts`

**Action**: Export FormBuilder types as canonical schema

```typescript
// Import from FormBuilder as source of truth
export type FormField = FormBuilderFormField;
export type FormGrouping = FormBuilderGrouping;
export type FormFieldOption = FormBuilderFieldOption;

// Extend with submission-specific types
export interface FormTemplate {
  id: string;
  name: string;
  formType: string;
  createdAt: string;
  updatedAt: string;
  isActive: "ACTIVE" | "DRAFT" | "ARCHIVED";
  description: string | null;
  isSignatureRequired: boolean;
  isApprovalRequired: boolean;
  FormGrouping: FormGrouping[];
}

export interface FormSubmission {
  id: number;
  title: string | null;
  formTemplateId: string;
  userId: string;
  formType: string | null;
  data: Record<string, FormFieldValue>;
  createdAt: Date;
  updatedAt: Date;
  submittedAt: Date | null;
  status: FormStatus;
  User: UserInfo;
  Approvals?: FormApproval[];
  FormTemplate: FormTemplate;
}

export interface FormApproval {
  id: string;
  formSubmissionId: number;
  signedBy: string | null;
  submittedAt: Date;
  updatedAt: Date;
  signature: string | null;
  comment: string | null;
  Approver: UserInfo | null;
}

export enum FormStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  DENIED = "DENIED",
  DRAFT = "DRAFT",
}

export type FormFieldValue =
  | string
  | Date
  | string[]
  | object
  | boolean
  | number
  | null;

export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  signature?: string;
}
```

**Acceptance Criteria**:

- [ ] No duplicate type definitions across codebase
- [ ] All form field types imported from FormBuilder
- [ ] FormFieldRenderer.tsx types match exactly
- [ ] All submission components use same type imports

---

### Phase 2: Create Data Normalization Utilities

**File**: `/client/app/lib/utils/formNormalization.ts`

**Action**: Implement minimal, one-time conversion functions

```typescript
import {
  FormTemplate,
  FormSubmission,
  FormApproval,
  FormFieldValue,
} from "../types/forms";

/**
 * Converts API FormIndividualTemplate to canonical FormTemplate
 * Minimal transformation - primarily shape mapping
 */
export function normalizeFormTemplate(apiResponse: any): FormTemplate {
  // Field ID consistency check
  // Ensure FormGrouping/Fields structure is uniform
  // Validate all required properties
}

/**
 * Converts API submission response to canonical FormSubmission
 * Ensures data field values are keyed by field ID
 */
export function normalizeFormSubmission(apiResponse: any): FormSubmission {
  // Validate field ID references match template
  // Type coercion if needed
}

/**
 * Converts API approval response to canonical FormApproval
 * Handles signature and comment fields
 */
export function normalizeFormApproval(apiResponse: any): FormApproval {
  // Parse dates correctly
  // Null-check user/approver data
}

/**
 * Maps field IDs to labels for display
 * Used when rendering form fields
 */
export function mapFieldIdToLabel(
  template: FormTemplate,
  fieldId: string
): string | null {
  // Iterate FormGrouping -> Fields to find label
}

/**
 * Maps field labels back to IDs for API submission
 * Handles field value key transformation
 */
export function mapLabelToFieldId(
  template: FormTemplate,
  fieldLabel: string
): string | null {
  // Iterate FormGrouping -> Fields to find ID
}

/**
 * Converts form values for API submission
 * Transforms field value format if needed
 */
export function denormalizeFormValues(
  template: FormTemplate,
  formValues: Record<string, FormFieldValue>
): Record<string, any> {
  // Convert values to API format
  // Handle special types (dates, arrays, objects)
}

/**
 * Validates that submission field IDs match template
 * Early detection of structural mismatches
 */
export function validateFieldStructure(
  template: FormTemplate,
  submission: FormSubmission
): { valid: boolean; errors: string[] } {
  // Check all submission data keys exist in template
  // Ensure no orphaned fields
}
```

**Acceptance Criteria**:

- [ ] All functions use canonical FormTemplate/FormSubmission types
- [ ] No transformation logic in component files
- [ ] Field ID/label mapping is bidirectional
- [ ] Date parsing handles timezone correctly
- [ ] Special field types (SEARCH_PERSON, SEARCH_ASSET, MULTISELECT) handled

---

### Phase 3: Bridge FormBuilder ↔ FormSubmission Types

**Action**: Ensure seamless type compatibility

```typescript
// FormBuilder creates field with:
{
  id: "field-123-uuid",
  label: "Request Type",
  type: "DROPDOWN",
  required: true,
  Options: [{ id: "opt-1", value: "Vacation" }, ...]
}

// Submission stores values as:
{
  "field-123-uuid": "Vacation"  // Key by ID, not label
}

// Normalization ensures:
// - Field IDs remain consistent
// - Labels available for all field references
// - No label→ID mapping required in components
```

**Acceptance Criteria**:

- [ ] FormBuilder field creation works with submission types
- [ ] Field IDs immutable from creation to submission
- [ ] Labels optional but available when needed
- [ ] Type definitions match between builder and submission

---

### Phase 4: Create Form Context

**File**: `/client/app/lib/context/FormContext.tsx`
**File**: `/client/app/lib/hooks/useFormContext.ts`

**Action**: Centralize normalized form state

```typescript
// Context provides:
{
  template: FormTemplate;           // From FormBuilder
  submission: FormSubmission | null; // From API
  values: Record<string, FormFieldValue>; // Current form state
  approval: FormApproval | null;    // If approval view
  updateValue: (fieldId: string, value: FormFieldValue) => void;
  loading: boolean;
  error: string | null;
}

// useFormContext() hook returns context
// All data already normalized - no component-level transformation
```

**Acceptance Criteria**:

- [ ] Context wraps all form submission components
- [ ] Data is normalized before providing to components
- [ ] No transformation logic inside context
- [ ] Value updates trigger auto-save
- [ ] Loading/error states managed centrally

---

### Phase 5: Create useFormManager Hook

**File**: `/client/app/lib/hooks/useFormManager.ts`

**Action**: Handle form lifecycle without component logic

```typescript
export function useFormManager(formId: string, submissionId?: number) {
  // Load template (via normalizeFormTemplate)
  // Load submission if exists (via normalizeFormSubmission)
  // Load approval if needed (via normalizeFormApproval)
  // Handle auto-save (values already normalized)
  // Manage validation

  return {
    template,
    submission,
    values,
    approval,
    isLoading,
    error,
    updateValue,
    submitForm,
    saveAsDraft,
    deleteSubmission,
  };
}
```

**Acceptance Criteria**:

- [ ] Handles all data loading scenarios
- [ ] Auto-save uses denormalizeFormValues
- [ ] Validation uses canonical FormTemplate
- [ ] Error handling is centralized
- [ ] Works with Form Context seamlessly

---

### Phase 6: Create Refactored Component Structure

**Folder**: `/client/app/v1/(routes)/hamburger/inbox/formSubmission/[id]/_components/`

**Action**: Create base + specialized view components

```
_components/
├── FormView.tsx           # Base component with shared rendering logic
├── FormDraftView.tsx      # Wraps FormView + draft-specific UI
├── FormSubmittedView.tsx  # Wraps FormView + submitted-specific UI
├── FormApprovalView.tsx   # Full approval interface
└── FormEditApprovalView.tsx # Manager edit interface
```

**Requirements**:

- All components use types from `/lib/types/forms.ts`
- All components use `useFormContext()` for data
- No type re-definitions in component files
- FormFieldRenderer receives canonical FormTemplate

**Acceptance Criteria**:

- [ ] FormView handles common rendering logic
- [ ] Child components extend/wrap FormView
- [ ] No duplicate type definitions in components
- [ ] FormFieldRenderer works identically across all views
- [ ] Props are minimal and type-safe

---

### Phase 7: Refactor Main Page.tsx

**File**: `/client/app/v1/(routes)/hamburger/inbox/formSubmission/[id]/page.tsx`

**Action**: Simplify from ~750 to ~150 lines

**Before**: Manual data fetching, multiple transformations, component routing
**After**: useFormManager hook, context provider, simple routing

```typescript
export default function DynamicForm({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = use(params).id;
  const searchParams = useSearchParams();

  // All data loading and normalization handled here
  const {
    template,
    submission,
    values,
    approval,
    isLoading,
    error,
    updateValue,
  } = useFormManager(id, submissionId);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  // Determine view based on status
  const getView = () => {
    if (!submissionId) return <FormDraftView />;
    if (status === "DRAFT") return <FormDraftView />;
    if (approvingStatus === "true") return <FormApprovalView />;
    if (status === "APPROVED" || status === "DENIED")
      return <FormSubmittedView />;
    return <FormSubmittedView />;
  };

  return (
    <FormContext.Provider
      value={{ template, submission, values, approval, updateValue }}
    >
      {getView()}
    </FormContext.Provider>
  );
}
```

**Removal**: Delete all these transformation functions

- ❌ `convertToLegacyFormTemplate()`
- ❌ `convertFormValuesToString()`
- ❌ `convertFormValuesToIdBased()`
- ❌ `updateFormValuesLegacy()`
- ❌ `convertFormValuesToIdBased()`

**Acceptance Criteria**:

- [ ] Page.tsx is ~150 lines (vs ~750 current)
- [ ] All transformation functions removed
- [ ] Data flow: hook → context → components
- [ ] useFormManager handles all loading/validation

---

### Phase 8: Unify FormFieldRenderer Components

**Files**:

- `/client/app/v1/(routes)/hamburger/inbox/_components/FormFieldRenderer.tsx`
- `/client/app/admins/forms/_components/RenderFields/RenderFields.tsx`

**Action**: Use canonical FormTemplate type, eliminate duplication

**Requirements**:

- Import FormField, FormGrouping from `/lib/types/forms.ts`
- Accept FormTemplate (not custom interface)
- All field rendering logic identical
- Work with both FormBuilder and FormSubmission contexts

**Acceptance Criteria**:

- [ ] Both components import same types
- [ ] No type re-definition in either file
- [ ] Field rendering logic is shared/identical
- [ ] Works with FormBuilder field structure directly
- [ ] Test rendering with both contexts

---

## Implementation Checklist

### Pre-Implementation

- [ ] Review FormBuilder types structure (`/client/app/admins/forms/_components/FormBuilder/types.ts`)
- [ ] Identify all type definition locations
- [ ] Document API response structure for each endpoint
- [ ] List all transformation functions and their inputs/outputs

### Phase 1: Type System

- [ ] Create `/client/app/lib/types/forms.ts`
- [ ] Export FormBuilder types as canonical
- [ ] Remove duplicate definitions from components
- [ ] Verify all imports work

### Phase 2: Normalization

- [ ] Create `/client/app/lib/utils/formNormalization.ts`
- [ ] Implement all conversion functions
- [ ] Add validation function
- [ ] Test with real API responses
- [ ] Handle edge cases (null values, missing fields, etc.)

### Phase 3: Type Bridge

- [ ] Create test file with FormBuilder field → Submission value mappings
- [ ] Verify field IDs consistent through lifecycle
- [ ] Test with multiple field types

### Phase 4: Context

- [ ] Create `/client/app/lib/context/FormContext.tsx`
- [ ] Create `/client/app/lib/hooks/useFormContext.ts`
- [ ] Implement context provider
- [ ] Test with multiple components

### Phase 5: Form Manager

- [ ] Create `/client/app/lib/hooks/useFormManager.ts`
- [ ] Implement data loading
- [ ] Implement auto-save
- [ ] Implement validation
- [ ] Test all scenarios

### Phase 6: Components

- [ ] Create base FormView component
- [ ] Create specialized view components
- [ ] Update FormFieldRenderer
- [ ] Remove duplicate types from all components
- [ ] Test rendering across views

### Phase 7: Main Page

- [ ] Refactor page.tsx
- [ ] Remove transformation functions
- [ ] Implement hook usage
- [ ] Verify all views still work
- [ ] Test all form scenarios (draft, submitted, approval)

### Phase 8: Unification

- [ ] Align FormFieldRenderer types
- [ ] Align RenderFields types
- [ ] Test field rendering consistency
- [ ] Verify FormBuilder and FormSubmission use same types

### Validation

- [ ] Create form in FormBuilder
- [ ] Submit form via FormSubmission
- [ ] Load draft and verify fields
- [ ] Edit and save draft
- [ ] Submit for approval
- [ ] Approve/reject form
- [ ] Verify all data persists correctly

---

## Type Definition Example

### Before (Current - Fragmented)

```typescript
// page.tsx
interface FormTemplate { ... }

// formDraft.tsx
interface FormTemplate { ... }

// managerFormApproval.tsx
interface FormTemplate { ... }
type ManagerFormApprovalSchema = { ... }

// RenderSearchAssetField.tsx
interface Fields { ... }

// RenderFields.tsx (Admin)
// Imports FormIndividualTemplate from types
```

### After (Unified)

```typescript
// /lib/types/forms.ts (Single source)
export type FormField = /* from FormBuilder */
export type FormGrouping = /* from FormBuilder */
export interface FormTemplate { ... }
export interface FormSubmission { ... }
export interface FormApproval { ... }

// page.tsx
import { FormTemplate, FormSubmission } from '@/lib/types/forms'

// formDraft.tsx
import { useFormContext } from '@/lib/hooks/useFormContext'
// No type definitions

// RenderFields.tsx (Admin)
import { FormTemplate } from '@/lib/types/forms'
// Same types as FormSubmission components
```

---

## Key Principles to Follow

1. **FormBuilder is Source of Truth**

   - Field structure defined once in FormBuilder
   - All other components import, don't redefine

2. **Normalize Once, Use Everywhere**

   - API responses → Canonical types in normalization layer
   - Components receive already-normalized data
   - No transformation in components

3. **Single Type Import Path**

   - All form types from `/lib/types/forms.ts`
   - Eliminates accidental type drift

4. **Immutable Field IDs**

   - Created in FormBuilder
   - Referenced in submissions
   - Never transformed or remapped

5. **Context as State Manager**

   - Form data lives in context
   - Components read from context
   - Context handles loading/errors/validation

6. **Minimal Component Logic**
   - Render UI from data
   - Call context methods for updates
   - No data transformation
   - No type manipulation

---

## Testing Strategy

### Unit Tests

- Normalization functions with various API responses
- Field structure validation
- ID/label mapping bidirectionality

### Integration Tests

- FormBuilder → API → Normalization → Context flow
- All views access same data via context
- Auto-save values correctly
- Field rendering consistent across views

### End-to-End Tests

- Create form in FormBuilder
- Fill out form
- Save as draft
- Edit draft
- Submit for approval
- Approve/reject
- Verify all data persists

---

## Performance Considerations

1. **Memoization**: Context value should be memoized to prevent unnecessary re-renders
2. **Normalization Caching**: Cache normalized templates if fetched multiple times
3. **Auto-save Debouncing**: Debounce form value changes before auto-save
4. **Field Rendering**: Memoize FormFieldRenderer to prevent re-renders on parent updates

---

## Backwards Compatibility

During migration:

1. Keep old components during refactoring
2. Run old and new in parallel initially
3. Migrate component by component
4. Verify data consistency after each phase
5. Remove old components once all migrated

---

## Related Instructions

Follow these instructions during implementation:

- `/best-typescript-Practices.instructions.md` - Type system design
- `/best-react-practices.instructions.md` - Component architecture
- `/best-nextjs-api-fetching.instructions.md` - API integration

---

## Success Metrics

- ✅ Page.tsx reduced from ~750 to ~150 lines
- ✅ Zero duplicate type definitions
- ✅ Zero transformation functions in components
- ✅ Single FormTemplate import path across codebase
- ✅ All form views use same context
- ✅ Field rendering identical across contexts
- ✅ All tests pass
- ✅ No performance regression
