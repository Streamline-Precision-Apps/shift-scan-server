## Zustand Best Practices (from Tic-Tac-Toe Tutorial)

1. **Keep State Minimal and Derived When Possible**

   - Only store the minimal state needed. Derive values (like `xIsNext` from `currentMove`) instead of duplicating state, to avoid bugs and keep logic simple.

2. **Use Middleware for Complex State**

   - For more complex state updates, use Zustand middleware like `combine` or `immer` to keep your store logic clean and immutable.

3. **Treat State as Immutable**

   - Always create new copies of arrays/objects when updating state (e.g., use `.slice()` or spread syntax) instead of mutating existing state. This enables features like time travel and undo/redo.

4. **Lift State Up When Needed**

   - Store shared state at the highest common parent or in the store, not in deeply nested components. Pass state and actions down as props or via hooks.

5. **Write Small, Focused Actions**

   - Define small, focused setter functions in your store (e.g., `setHistory`, `setCurrentMove`) that update only the relevant part of the state.

6. **Selector Functions for Performance**

   - Use selector functions in your hooks (e.g., `useGameStore(state => state.history)`) to subscribe only to the state you need, minimizing unnecessary re-renders.

7. **Controlled Components**

   - Make components fully controlled by props/state from the store, so their behavior is predictable and testable.

8. **Avoid Redundant State**

   - If a value can be calculated from other state, do not store it separately. This reduces the risk of state getting out of sync.

9. **Encapsulate Store Logic**

   - Keep all state logic (including actions and derived state) inside the store or in custom hooks, not scattered throughout components.

10. **Test State Logic Independently**
    - Since Zustand stores are just functions, you can test their logic outside of React components.
