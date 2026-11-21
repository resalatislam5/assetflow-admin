# AssetFlow Admin — Frontend Architecture & Developer Guide (AGENTS.md)

This document defines the architectural patterns, directory structure, component standards, state management, and step-by-step instructions for developing features in the **AssetFlow Admin Dashboard** (a React 19 enterprise administration app for Multi-Location Inventory & Asset Management). All developers and AI agents must follow this guide to maintain consistency, reliability, and code quality across the application.

---

## Strict Global Rules
- **NO COMMENTS ALLOWED**: Do NOT write any comments (neither single-line `//`, multi-line `/* */`, nor JSDoc `/** */`) anywhere in the codebase. All code must be self-explanatory, clean, and concise.
- **STRICT BAN ON BENGALI TEXT IN ADMIN UI — ENGLISH ONLY MANDATE**: All labels, form titles, placeholders, select options, button text, table headers, descriptions, and UI copies in the administration panel MUST strictly be written in professional, concise English. Never use Bengali words, parenthetical Bengali hints, or mixed language strings anywhere in the frontend.
- **STRICT BAN ON 'any' — USE STRICT, PROPER TYPES ONLY**: The use of `any` (neither `: any`, `as any`, nor `<any>`) is strictly prohibited everywhere across the dashboard frontend codebase. Developers and AI agents must always define exact interfaces in `types/`, use Ant Design generic props (e.g. `<AntTable<T>>`, `FormInstance<T>`), use `unknown` with type narrowing/guards for dynamic values, and use `Record<string, unknown>` for open payloads. Never fall back to `any`.
- **NO MONGODB '_id' — USE 'id' ONLY**: MongoDB-style `_id` is strictly forbidden across the entire frontend. Tables, models, form inputs, route params, rowKey, and API payloads must exclusively use `id`. Never use `_id` as `rowKey`.
- **NO REDUNDANT 'import React from \'react\'' (JSX TRANSFORM MANDATE)**: React 19 and modern bundlers (Vite `@vitejs/plugin-react-swc`) leverage the automatic JSX transform (`react/jsx-runtime`). Importing the default `React` object (`import React from 'react'`) is completely unnecessary and strictly forbidden. Always import hooks and types directly via named imports (e.g. `import { useState, useEffect, useMemo, useCallback } from 'react';` or `import type { FC, ReactNode } from 'react';`).
- **UPPERCASE STATUS & ENUMS**: All status values, action types, and enum literals (e.g., `'ACTIVE' | 'INACTIVE'`, `'PENDING' | 'IN_TRANSIT' | 'RECEIVED' | 'REJECTED'`, `'GLOBAL' | 'BRANCH' | 'WAREHOUSE'`) must ALWAYS be written in UPPERCASE letters.
- **MULTI-LOCATION SCOPE ARCHITECTURE & HEADER NAVBAR LOCATION SELECTOR**:
  - AssetFlow operates across a strict 3-tier location hierarchy:
    ```mermaid
    flowchart TD
        Navbar["Frontend Navbar Selector"] -->|User Selection| Context["Context Resolution"]
        
        Context -->|"Select: ALL (Super Admin only)"| GlobalScope["GLOBAL Scope: View aggregated data across all Branches & Warehouses"]
        Context -->|"Select: Branch A"| BranchScope["BRANCH Scope: Filter website data where branch_id = Branch A"]
        Context -->|"Select: Warehouse 1"| WhScope["WAREHOUSE Scope: Filter inventory/operations where warehouse_id = WH 1"]

        subgraph "RBAC & Data Protection"
            SuperAdmin["Super Admin (data_scope = 'ALL')"] -->|"Can access & toggle"| AllOptions["All / Any Branch / Any Warehouse"]
            BranchUser["Branch Staff (data_scope = 'BRANCH')"] -->|"Locked to assigned branch"| OnlyAssignedBranch["Only Assigned branch_id (Cannot select ALL or other branches)"]
            WhUser["Warehouse Staff (data_scope = 'WAREHOUSE')"] -->|"Locked to assigned warehouse"| OnlyAssignedWH["Only Assigned warehouse_id"]
        end
    ```
    1. **GLOBAL / ALL Scope**: Super Administrators and users with `data_scope = 'ALL'` have complete access across all branches and warehouses. From the Navbar Location Selector, they can choose "ALL" (aggregated data across the company) or select any specific Branch or Warehouse to filter the entire website's data.
    2. **BRANCH Scope**: Personnel assigned to a specific Branch (`branch_id`) are locked to that branch. They can ONLY view and manage data (invoices, receipts, inventory, expenses, staff) belonging to their assigned branch. They CANNOT select "ALL" or view other branches/warehouses.
    3. **WAREHOUSE Scope**: Personnel assigned to a specific Warehouse (`warehouse_id`) are locked to that warehouse. They can ONLY access inventory, batches, serials, dispatches, and GRN belonging to their assigned warehouse.
  - **Redux Location State (`src/app/features/locationSlice.ts`)**:
    - Manages `currentScope: 'ALL' | 'BRANCH' | 'WAREHOUSE'`, `selectedBranchId: number | null`, `selectedWarehouseId: number | null`, and `locationName: string`.
  - **Global Header Location Switcher (`src/layout/components/NavbarLocationSelector.tsx`)**:
    - Embedded in the top navbar (`MainLayout.tsx`).
    - If user has `data_scope = 'ALL'`, they can dynamically select "ALL", any Branch, or any Warehouse from the dropdown.
    - If user has `data_scope = 'BRANCH'` or `data_scope = 'WAREHOUSE'`, the selector is disabled/locked, displaying their assigned location name and badge.
  - **Automatic API Header Propagation (`src/app/api/api.ts`)**:
    - Base query automatically attaches headers to all requests:
      - `x-location-scope`: `state.location.currentScope` ('ALL', 'BRANCH', or 'WAREHOUSE')
      - `x-branch-id`: `state.location.selectedBranchId` (when scope is BRANCH)
      - `x-warehouse-id`: `state.location.selectedWarehouseId` (when scope is WAREHOUSE)
    - Whenever location changes in the navbar, relevant queries are invalidated and refetched automatically.
- **STRICT PROHIBITION ON FRONTEND RESPONSE RE-MAPPING / FIELD RENAMING**:
  - Whatever field names come from the backend API MUST be consumed directly in the frontend using the EXACT same field names.
  - Frontend developers and AI agents are strictly forbidden from renaming, aliasing, remapping, or modifying backend response properties.
  - TypeScript interfaces in frontend `types/` must directly mirror backend response schemas (`id`, `name`, `code`, `quantity_on_hand`, `in_transit_quantity`, `safety_stock`, `branch_id`, `warehouse_id`, etc.).
- **LEAN LIST CONTRACT & PROJECTION PARITY (MINIMAL PAYLOADS FOR TABLES)**:
  - In all listing/table views, frontend interfaces and components must only request and consume the minimal fields required for table display (`single bade a list a frontend a jhe jhe information dakhano dorker sudu oto tuku backend thake asbe`).
  - Detail-heavy fields and nested sub-objects belong exclusively in single detail endpoints and inspection drawers (`View<Feature>.tsx`).
- **ZERO DEAD CODE & IMMEDIATE UNUSED CODE REMOVAL MANDATE**:
  - Whenever working on, refactoring, or modifying any feature, file, or component, developers and AI agents MUST actively detect and immediately delete any code that is no longer used (`jokon kno kicu niya kaj korba, tokon jhe code use hoy na oita remove kore diba`).
  - Remove all unreferenced imports, variables, functions, types, and obsolete files immediately.
- **IMAGE STORAGE & DISPLAY STANDARDS (CLOUDFLARE R2 & Image.tsx)**:
  - Database image and document paths are ALWAYS strictly relative storage keys (e.g. `'product/xxx.webp'`, `'attachment/xxx.pdf'`).
  - In all create/update forms, any submitted image paths MUST pass through `cleanImageKey()` to transmit only relative paths.
  - Always import and use `<ImagePreview>` or `<CustomImage>` from `src/common/components/Image.tsx`.
- **FORM INPUT STANDARDS & IMAGE PLACEMENT (NO '(OPTIONAL)', NO CANCEL/DIVIDER, IMAGE ALWAYS LAST)**:
  - Media and file upload fields (`FormFileUpload`) must ALWAYS be positioned at the very end of the form layout.
  - Never write `(Optional)` in input labels or placeholders.
  - For `FormInputTextArea`, set `rows={1}` when placed on the same line as other inputs (`md={12}`), or set `lg={24}` when placed on its own line.
  - Use standard `<FromSubmit text={editMode ? 'Update <Feature>' : 'Create <Feature>'} loading={loading} />`. Never add extra cancel buttons or dividers inside `<Feature>Inputs.tsx`.
  - Always write `Update <Feature>`, NEVER `Edit <Feature>`.
  - Single-page form grid layout uses 3 items per row on large displays (`md={12} lg={8} xs={24}`).
- **MANDATORY `Form.useWatch` OVER MULTIPLE `useState` FOR FORM TRACKING**:
  - Never declare multiple redundant `useState` hooks to track form values. Consume `Form.useWatch(fieldName, form)` directly.
- **NO MONOLITHIC / COMBINED FEATURE FOLDERS (DEEP MODULE ARCHITECTURE)**:
  - Each distinct entity must adhere to DMA inside its own dedicated feature module under `src/modules/<Category>/<Feature>/` (e.g. `src/modules/Inventory/Stock/`, `src/modules/Location/Branch/`, `src/modules/Location/Warehouse/`), containing dedicated `api/`, `components/`, `pages/`, and `types/`.
- **DATE & TIME FORMATTING STANDARDS (DAYJS & STRICT BAN ON RAW ISO STRINGS)**:
  - Date format: `'DD MMM YYYY'` (e.g. `04 Nov 2026`).
  - Date & Time format: `'DD MMM YYYY, hh:mm A'` (e.g. `04 Nov 2026, 09:58 AM`).
  - Raw ISO timestamp strings must NEVER be displayed in the UI. Always format using `formatDate()` or `formatDateTime()` from `src/common/utils/dateFormat`.
- **REPORTS BELONG IN DEDICATED REPORT MODULES & MANDATORY ReportContainer STANDARDS**:
  - All analytical queries, logs, and summaries MUST live under `src/modules/Report/<ReportName>/`.
  - Wrap every report component inside `<ReportContainer>` (`src/layout/components/ReportContainer.tsx`).
  - Mandatory date range filtering via built-in DatePicker in `ReportContainer`.
  - STRICT PROHIBITION ON DEFAULT DATES IN REPORTS (no `defaultMonth`, no `defaultDateRange`).
  - NO BACKEND REQUEST WITHOUT DATE SELECTION (`skip: !query?.from_date || !query?.to_date`).
- **CENTRALIZED SELECT ARCHITECTURE (`src/common/SelectWithApi/`)**:
  - Dropdowns backed by API data MUST be centralized in `src/common/SelectWithApi/`:
    - `SelectBranch`
    - `SelectWarehouse`
    - `SelectStorageLocation`
    - `SelectProduct`
    - `SelectCategory`
    - `SelectBrand`
    - `SelectUnit`
    - `SelectSupplier`
    - `SelectClient`
    - `SelectAccount`
  - Never write ad-hoc inline selects with manual API mapping in feature components.
- **NO MANUAL 'ID' OR 'SL.' COLUMN IN `AntTable`**:
  - `AntTable` automatically generates the serial number column (`SL.`). Never declare a manual `'ID'` or `'SL'` column.
- **MODAL CONTAINER CARD & BACKGROUND STYLING (`.modal-container`)**:
  - Wrap inner modal/drawer content in `<Card size="small" className="modal-container">`.
- **DOUBLE-ENTRY ACCOUNTING & FINANCIAL TRANSACTIONS**:
  - Every financial transaction must showcase matched Debit and Credit.
  - Accounts dashboard must display live balance, total in (Debit), and total out (Credit) per financial account.
- **SEQUENTIAL VOUCHER & DOCUMENT NUMBERING (NEVER INPUT IN FRONTEND)**:
  - All voucher, transfer, challan, requisition, and invoice numbers are 100% server-generated (`TRF-000001`, `REQ-000001`, `PUR-000001`, `GRN-000001`, `INV-000001`, `PAY-000001`, `REC-000001`).
  - Frontend form inputs for document/voucher numbers are strictly forbidden.
- **AUTOMATIC MODAL CLOSING ON MUTATIONS (`handleSuccessAndError`)**:
  - Global RTK Query middleware automatically dispatches `closeModal()` upon successful mutation. Do NOT dispatch `closeModal()` manually inside form components.

---

## 1. Project Overview & Tech Stack

AssetFlow Admin is an enterprise-grade administration portal for managing Multi-Location Inventory & Asset operations across Branches and Warehouses.

| Technology | Version / Spec | Primary Responsibility |
| :--- | :--- | :--- |
| **React** | `^19.2.0` | Core UI library (Fiber, Concurrent Mode, React 19 hooks) |
| **Vite** | `^7.2.4` (`@vitejs/plugin-react-swc`) | Ultra-fast HMR and bundle compilation |
| **TypeScript** | `~5.9.3` | Type-safety, strict interfaces, and branded types |
| **Ant Design (antd)** | `^6.1.4` (`@ant-design/icons`) | Enterprise UI design system, theme tokens, tables, modals |
| **Redux Toolkit & RTK Query** | `^2.11.2` (`react-redux`, `redux-persist`) | Global state, location scoping, API caching, optimistic updates |
| **React Router** | `^7.12.0` | Declarative client-side routing with guarded permission routes |
| **Utility Libraries** | `dayjs`, `libphonenumber-js`, `xlsx` | Date manipulation, phone formatting, Excel/PDF exports |
| **PWA** | `vite-plugin-pwa` | Offline caching and progressive web app capabilities |

---

## 2. Directory Structure & Architecture Blueprint

```text
assestflow-frontend/
├── AGENTS.md                              # This development & architecture guide
├── public/                                # Public static assets (logos, manifest, icons)
├── src/
│   ├── App.tsx                            # Root application component with Antd ConfigProvider
│   ├── main.tsx                           # Application entry point with Redux Provider & PersistGate
│   ├── index.css                          # Global styling, utility classes, and modal animations
│   ├── app/                               # Core Redux store and base RTK Query configuration
│   │   ├── api/
│   │   │   └── api.ts                     # Base RTK Query api with Bearer auth and location headers
│   │   ├── features/                      # Global Redux slices
│   │   │   ├── authSlice.ts               # Authenticated staff user & permission state
│   │   │   ├── locationSlice.ts           # Active location scope: GLOBAL / BRANCH / WAREHOUSE
│   │   │   ├── filterSlice.ts             # Global table query filter (limit, skip, search)
│   │   │   ├── modalSlice.ts              # Global dynamic modal manager (title, content, width)
│   │   │   └── themeSlice.ts              # Antd light/dark algorithm & primary color state
│   │   ├── hooks/                         # Typed hooks: useAppDispatch, useAppSelector
│   │   └── utils/
│   │       ├── CreateTags.ts              # RTK Query cache tag definitions and helper
│   │       └── handleSuccesAndError.ts    # Global RTK Query success and error notification middleware
│   ├── common/                            # Reusable UI components, hooks, and helpers
│   │   ├── Button/                        # Action buttons (FromSubmit, EditButton, DeleteButton, ViewButton)
│   │   ├── Form/                          # Antd Form inputs (FormInputText, FormInputSelect, FormFileUpload)
│   │   ├── SelectWithApi/                 # Asynchronous server-backed select components
│   │   │   ├── SelectBranch.tsx
│   │   │   ├── SelectWarehouse.tsx
│   │   │   ├── SelectProduct.tsx
│   │   │   └── SelectSupplier.tsx
│   │   ├── Table/                         # AntTable with automatic SL, pagination, and sorting
│   │   └── components/                    # Global modal renderer, ImagePreview, CustomImage
│   ├── layout/                            # Main application chrome
│   │   ├── components/                    # ContainerLayout, Navbar, LocationSwitcher, SideMenu
│   │   ├── pages/MainLayout.tsx           # Sider + Header + Content shell with dynamic resize
│   │   └── utils/navItems.tsx             # Navigation hierarchy mapped to permission tags
│   ├── modules/                           # Domain feature modules (Deep Module Architecture)
│   │   ├── Location/                      # Branch, Warehouse, StorageLocation modules
│   │   ├── Catalog/                       # Product, Category, Brand, Unit modules
│   │   ├── Inventory/                     # Stock, StockBatch, StockTransfer, StockRequisition, StockAdjustment
│   │   ├── Asset/                         # Asset, AssetAssignment, AssetMaintenance
│   │   ├── Procurement/                   # Supplier, PurchaseOrder, GoodsReceipt, PurchaseInvoice
│   │   ├── Distribution/                  # Client, SalesOrder, DeliveryChallan, SalesInvoice
│   │   ├── Accounting/                    # Account, Payment, Receipt, Expense
│   │   ├── Audit/                         # StockAudit, AuditLog
│   │   ├── Report/                        # Dedicated analytical report modules
│   │   └── Administration/                # User, Role, Settings modules
│   └── routes/                            # Client-side routing definitions
│       ├── AppRoutes.tsx                  # Route registry with permission tags and lazy components
│       ├── PermissionRoutes.tsx           # RBAC route guard based on active user permissions
│       └── ProtectedRoute.tsx             # JWT token existence verification and redirect
```

---

## 3. Location Scope Architecture & Header Location Switcher

### 3.1 Navbar Location Selector Workflow

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   Top Navbar Location Selector                         │
│  [ GLOBAL (All Locations) ▼ ]  or  [ Branch: Dhaka ▼ ]                 │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        locationSlice (Redux)                           │
├────────────────────────────────────────────────────────────────────────┤
│ currentScope: 'GLOBAL' | 'BRANCH' | 'WAREHOUSE'                        │
│ selectedBranchId: number | null                                        │
│ selectedWarehouseId: number | null                                     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       RTK Query Base Query                             │
├────────────────────────────────────────────────────────────────────────┤
│ headers.set('x-location-scope', currentScope)                          │
│ if (selectedBranchId) headers.set('x-branch-id', selectedBranchId)     │
│ if (selectedWarehouseId) headers.set('x-warehouse-id', selectedWarehouseId)│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Step-by-Step Implementation Guide for Any New Feature

### Step 1: Define TypeScript Interfaces
Create `src/modules/<Category>/<Feature>/types/<feature>Types.ts`:
- Define `I<Feature>` matching the backend contract.
- Define `ICreate<Feature>` for form submission.

### Step 2: Register Cache Tag
Register tag in `src/app/utils/CreateTags.ts`.

### Step 3: Implement RTK Query Endpoints
Create `src/modules/<Category>/<Feature>/api/<feature>Endpoints.ts`:
- `get<Feature>List`: provides tags `[{ type: '<Feature>', id: 'LIST' }]`.
- `getSingle<Feature>`: provides tags `[{ type: '<Feature>', id: arg }]`.
- `create<Feature>`, `update<Feature>`, `delete<Feature>`: invalidates tags `[{ type: '<Feature>', id: 'LIST' }]`.

### Step 4: Build Form Inputs Component
Create `src/modules/<Category>/<Feature>/components/<Feature>Inputs.tsx`.

### Step 5: Build Create & Update Components
Create `Create<Feature>.tsx` and `Update<Feature>.tsx` with `<Card size="small" className="modal-container">`.

### Step 6: Build Listing Page
Create `src/modules/<Category>/<Feature>/pages/<Feature>List.tsx` using `<ContainerLayout>` and `<AntTable>`.

### Step 7: Mount Route & Navigation
Add route to `src/routes/AppRoutes.tsx` and menu item to `src/layout/utils/navItems.tsx`.

---

## 5. Development & Build Commands

All development tasks MUST be run using `yarn`:

```bash
# Start frontend in development mode
yarn dev

# Type-check and build for production
yarn build

# Preview production build locally
yarn preview
```
