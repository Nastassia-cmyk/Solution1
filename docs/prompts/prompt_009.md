Refactor the frontend React app by extracting the "main layout" (non-admin part) from App.tsx into a separate layout component.

STRICT RULES:
- Do NOT modify anything inside the /api folder.
- Do NOT change any backend code, routes, services, controllers, or repositories.
- Only frontend files inside /web/src are allowed.

You may ONLY edit or create these files:
1. web/src/App.tsx
2. web/src/components/layouts/MainLayout.tsx (NEW FILE)

DO NOT modify any other files.

GOAL:
- App.tsx should only handle routing logic:
    - If the route starts with "/admin", render <AdminLayout />
    - Otherwise render the new <MainLayout />

MainLayout.tsx must:
- Represent the main (non-admin) layout of the application
- Render the existing <TaskPage /> inside it
- Be a clean wrapper so future components like header/footer can be added later

CURRENT App.tsx CONTENT:

import React, { useEffect, useState } from 'react';
import TaskPage from './components/pages/TaskPage';
import AdminLayout from './components/layouts/AdminLayout';
import './App.css';

export const App: React.FC = () => {
const [currentRoute, setCurrentRoute] = useState<string>(() => {
const hash = window.location.hash.slice(1) || '/tasks';
return hash;
});

useEffect(() => {
const handleHashChange = () => {
const hash = window.location.hash.slice(1) || '/tasks';
setCurrentRoute(hash);
};

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
}, []);

if (currentRoute.startsWith('/admin')) {
return <AdminLayout />;
}

return <TaskPage />;
};

export default App;

EXPECTED RESULT:
- App.tsx renders <MainLayout /> instead of <TaskPage /> directly
- MainLayout.tsx imports and renders <TaskPage />
- No backend changes
- No other files touched
Don't create any *.md files with documentation.

You can only expand and update the existing README.md file so that it matches the latest changes made in the project.