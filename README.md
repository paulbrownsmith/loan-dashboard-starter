# Loan Dashboard Assessment

# Loan Dashboard Starter – Change Log & Implementation Notes

This README documents the key changes and enhancements made to the codebase.

---

## 1. Role-Based Sensitive Data Masking

- Implemented logic in `ApplicationDetailDialog` to show sensitive fields (National Insurance Number, Date of Birth, Bank Account Details) as masked for `LOAN_OFFICER` and unmasked for `SENIOR_OFFICER`.
- The masking is controlled by the `currentUserRole` prop, which is passed down from the parent and updated throughout the app.

---

## 2. Role Management

- Added a `RoleSwitcher` component in the header to allow switching between user roles.
- Ensured that the current user role is managed in the top-level `App` component and passed as a prop to all relevant children.
- Removed local `currentUserRole` state and duplicate `RoleSwitcher` from child components (such as `DataTable`) to ensure a single source of truth.
- All components now use the `currentUserRole` prop or, where appropriate, a global state (e.g., with Zustand).

---

## 3. DataTable State Persistence

- Integrated React Router's `useSearchParams` to persist DataTable state (sorting, filtering, search, pagination) in the URL query string.
- On state change, the query string is updated, and on reload, the table restores its state from the query string.

---

## 4. Application Data Context

- Created `ApplicationsDataContext` and a custom hook `useApplicationsData` for providing and consuming applications data via React context.
- Updated `DataTable` to consume application data from context instead of receiving it as a prop.

---

## 5. Type Safety Improvements

- Replaced all `any` types with more specific types or `unknown` where appropriate.
- Updated the `LoanApplication` interface to use `[key: string]: unknown;` only if extra fields are expected; otherwise, recommended removing it for stricter type safety.

---

## 6. UI Consistency and DRY Principles

- Refactored repeated UI code in `ApplicationDetailDialog` to use arrays and `.map()` for rendering fields.
- Used helper functions for risk score color coding and labeling, following requirements:
  - 0-3: Green (LOW)
  - 4-7: Amber (MEDIUM)
  - 8-10: Red (HIGH)

---

## 7. Summary Cards Refactor

- Moved the summary cards block to a dedicated export in `components/SummaryCards/index.tsx` for reuse and clarity.

---

## 8. Miscellaneous

- Ensured all files are formatted according to project and language standards.
- Added comments and documentation where necessary for clarity and maintainability.

---

**For more details, see the code
