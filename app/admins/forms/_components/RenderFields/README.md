# FormBridge (Render Fields consolidation)

## Purpose

Centralize rendering logic for form templates. This component serves as a single
bridge between a canonical `FormTemplate` and the existing `Render[X]` UI
components.

## Current status

- `FormBridge.tsx` contains the new implementation (initial scaffold).
- `FormBridgeWrapper.tsx` provides a backward-compatible API mapping from
  older `RenderFields` props to the new component. Existing call sites can
  switch to the wrapper with zero behavioral changes.

## Migration guidance

1. Prefer `FormBridge` for new code and components. It accepts a simple, testable
   set of props and can be used in stateless ways.
2. Use `FormBridgeWrapper` to maintain backwards compatibility while migrating
   call sites.
3. When migrating a call site, pass precomputed `userOptions`,
   `equipmentOptions`, `jobsiteOptions`, and `costCodeOptions` if available —
   this avoids duplication of data fetching in the Bridge.

## Next steps

- Expand type normalization and value mapping functions to ensure consistent
  storage format across submit/edit flows.
- Add unit & integration tests that assert stable payload formats after
  submission.
