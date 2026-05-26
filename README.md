# Capacity App Scaffold

This workspace is scaffolded to match the structure you described:

- Base44-backed, serverless data access
- React + Vite frontend
- Protected app shell with route placeholders
- Shared query helpers and UI building blocks

## Key folders

- `src/lib/` Base44 wrapper, query client, shared helpers
- `src/components/` layout, dashboard, shared, employee, and project UI
- `src/pages/` route-level screens
- `src/providers/` auth context placeholder
- `src/routes/` route guards

## Notes

- The Base44 SDK wrapper expects `window.base44` to exist in the browser.
- Pages and charts are placeholders so you can plug in the real data/UX next.
