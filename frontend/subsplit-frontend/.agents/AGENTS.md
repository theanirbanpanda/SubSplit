# SubSplit Architectural Guidelines

Strictly enforce the following rules on all future development:

1. **No Placeholder Code**: Write complete, fully functional, production-ready code.
2. **No Duplicate Components**: Use centralized UI components from `src/components/ui/` and layout components from `src/components/layout/`.
3. **No Business Logic in Controllers or React Components**: Keep components clean and presentational. Delegate data fetching, transformations, and business rules to custom hooks, models (`src/models/`), and services.
4. **No Magic Strings**: Always use centralized constants from `src/config/` and `src/constants/` (`ROUTES`, `API_ENDPOINTS`, `STORAGE_KEYS`, `ROLES`, `MESSAGES`, `ENV`).
5. **No Unnecessary Redux State**: Redux is exclusively for Auth (`authSlice`) and UI state (`uiSlice`). All server-side domain data stays in React Query (`@tanstack/react-query`).
6. **MUI Usage Guidelines**:
   - Use Material UI (`@mui/material`) for base UI primitives (`Button`, `TextField`, `Drawer`, `Dialog`, `Table`).
   - Use SCSS Modules (`.module.scss`) for layout, spacing, flexbox, and custom styling.
   - Avoid heavy inline `sx` prop usage; limit `sx` to minor one-off component adjustments.
7. **Domain-Driven Package Structure (Backend)**:
   - Organize Spring Boot code by domain packages (`com.subsplit.auth`, `com.subsplit.group`, `com.subsplit.expense`, `com.subsplit.settlement`, `com.subsplit.user`, `com.subsplit.common`).
   - Each domain package contains its own controllers, services, repositories, DTOs, and mappers.
