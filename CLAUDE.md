# Analytix - Analytics Dashboard App

## Project Overview
A web-based analytics dashboard application for creating dashboards and visualizing data from CSV files.

## Tech Stack
- **Framework**: React 19 + TypeScript
- **Build**: Vite 7
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts 3
- **Grid Layout**: react-grid-layout 2 (uses `useContainerWidth` hook, NOT the legacy `WidthProvider` HOC)
- **CSV Parsing**: PapaParse
- **Routing**: React Router v7
- **Storage**: localStorage (no backend)

## Commands
- `npm run dev` — Start dev server
- `npm run build` — TypeScript check + production build
- `npm run lint` — ESLint
- `npm run preview` — Preview production build

## Project Structure
```
src/
├── App.tsx                          # App shell with sidebar + routes
├── main.tsx                         # Entry point with BrowserRouter
├── index.css                        # Tailwind + grid layout CSS imports
├── types/index.ts                   # All TypeScript interfaces
├── store/useStore.ts                # localStorage-backed React hooks
├── utils/
│   ├── csvParser.ts                 # PapaParse CSV ingestion
│   └── aggregation.ts              # Data aggregation & summary stats
├── pages/
│   ├── DashboardListPage.tsx        # List/create/delete dashboards
│   ├── DashboardEditorPage.tsx      # Grid editor with drag/resize widgets
│   └── DataPage.tsx                 # Upload & manage CSV datasets
└── components/
    ├── DataPreview.tsx              # Tabular CSV preview
    ├── WidgetRenderer.tsx           # Widget chrome + type dispatch
    ├── WidgetConfigModal.tsx        # Column/dataset picker modal
    └── widgets/
        ├── BarChartWidget.tsx
        ├── LineChartWidget.tsx
        ├── PieChartWidget.tsx
        ├── ScatterChartWidget.tsx
        ├── SummaryStatsWidget.tsx
        └── DataTableWidget.tsx
```

## Key Patterns
- State is managed via custom hooks (`useDashboards`, `useDatasets`) that sync to localStorage
- Dashboard widgets use `WidgetConfig` type which stores grid position (x, y, w, h) and chart config (datasetId, xColumn, yColumn)
- react-grid-layout v2 API: use `Responsive` component with `width` prop from `useContainerWidth()` hook, `dragConfig`/`resizeConfig` objects instead of `isDraggable`/`isResizable` booleans
- CSV columns are auto-classified as numeric or categorical via sampling

## Conventions
- Functional components only
- Tailwind utility classes for all styling (no CSS modules)
- Types defined centrally in `src/types/index.ts`
