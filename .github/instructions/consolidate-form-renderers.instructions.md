Consolidate RenderFields + FormFieldRenderer into FormBridge
==========================================================

Objective
---------
Create a single bridging component (FormBridge) that replaces the existing
`RenderFields` and `FormFieldRenderer` components in order to reduce
duplication, unify behavior, and make future maintenance easier.

Scope
-----
- Create `FormBridge` which converts a canonical `FormTemplate` into a
  set of rendered fields using existing Render[X] components.
- Provide a compatibility wrapper so existing call sites continue working
  without breaking changes.
- Incrementally migrate call sites to use `FormBridge` directly.

Main Deliverables
-----------------
1. `client/app/admins/forms/_components/RenderFields/FormBridge.tsx` - the
   new shared component.
2. `client/app/admins/forms/_components/RenderFields/FormBridgeWrapper.tsx`
   - thin backward-compatible wrapper that maps current `RenderFields` props
   to `FormBridge` props.
3. Add a short `README` / documentation snippet in this file describing the
   component's contract and migration steps.

Plan Summary (phases)
---------------------
Phase 0 - Analysis
- Inventory call sites of `RenderFields` & `FormFieldRenderer` and the
  Render[X] components to understand their usage patterns.

Phase 1 - Design
- Finalize a minimal prop contract for `FormBridge`.
- Decide on canonical value format for person/asset fields (object vs id).

Phase 2 - Implementation
- Create the `FormBridge` component implementing type-switch to existing
  renderers and normalization helpers.
- Create `FormBridgeWrapper` for backward compatibility.

Phase 3 - Migration
- Migrate one call site to use `FormBridge` directly (e.g.,
  `CreateFormSubmissionModal`).
- Add tests and run build/lint.

Phase 4 - Cleanup
- Update more callers, remove legacy wrappers when sure of no regressions,
  and document the migration plan.

Quality gates & checks
----------------------
- TypeScript typechecking
- ESLint
- Unit/Integration tests (new tests for `FormBridge`)

Notes
-----
- Keep existing Render[X] components untouched — `FormBridge` should
  delegate to them.
- Use prop-passed `userOptions`, `equipmentOptions`, etc., whenever
  provided, fallback to stores only when necessary.

Start
-----
I’ll now add the initial `FormBridge` implementation and a wrapper. This is
intended to be a scaffold and a gradual migration starting point.

Progress
--------
- Added `FormBridge` scaffold at `client/app/admins/forms/_components/RenderFields/FormBridge.tsx`.
- Added `FormBridgeWrapper` to keep the `RenderFields` API stable at
  `client/app/admins/forms/_components/RenderFields/FormBridgeWrapper.tsx`.
- Updated `client/app/v1/(routes)/hamburger/inbox/_components/FormFieldRenderer.tsx` to use the wrapper.
- Updated `CreateFormSubmissionModal.tsx` to use the wrapper to demonstrate migration.

"How to review"
--------------
Look for the new files in admin renderfields components. The first change
is a non-breaking one: `FormBridgeWrapper.tsx` is a compatible wrapper, and
`RenderFields.tsx` continues to work. After validation, call sites will be
migrated in small batches.

End.
