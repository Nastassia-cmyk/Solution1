# Admin Settings Feature - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER BROWSER                               │
│                    (http://localhost:3000)                          │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
            ┌───────▼────────┐         ┌──────────▼────────┐
            │  React App     │         │  Components       │
            │  (App.tsx)     │         │  & Pages          │
            └───────┬────────┘         └───────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
    ┌───▼────┐  ┌───▼────┐  ┌──▼──────┐
    │ TaskPage   │ AdminLayout   │ Router │
    └───┬────┘  └───┬────┘  └─────────┘
        │           │
        │      ┌────▼─────────┐
        │      │ Settings     │
        │      │ Page         │
        │      │ Component    │
        │      └────┬─────────┘
        │           │
    ┌───┴───────────┼──────────────┐
    │               │              │
┌───▼──────┐  ┌─────▼─────┐  ┌────▼────┐
│AppContext │  │ Settings  │  │Settings  │
│(Tasks)    │  │Context    │  │Provider  │
└───┬──────┘  └─────┬─────┘  └─────────┘
    │               │
    │          ┌────▼────────────┐
    │          │ settingsApi.ts   │
    │          │ (Service)        │
    │          └────┬─────────────┘
    │               │
    │       HTTP Requests
    │               │
    └───────────────┼──────────────────────────────┐
                    │                              │
                    │ CORS Enabled                 │
                    │ All Methods                  │
                    │                              │
        ┌───────────▼──────────────┐
        │  Express Server          │
        │  (localhost:5000)        │
        └───────────┬──────────────┘
                    │
        ┌───────────┴────────────────┐
        │                            │
    ┌───▼────────────┐  ┌───────────▼────┐
    │ /api/tasks     │  │ /api/admin     │
    │ (taskRoutes)   │  │ (adminRoutes)  │
    └───┬────────────┘  └───────┬────────┘
        │                       │
    ┌───▼──────────────┐   ┌────▼──────────────┐
    │ taskController   │   │settingsController │
    │ (handlers)       │   │ (handlers)        │
    └───┬──────────────┘   └────┬──────────────┘
        │                       │
    ┌───▼──────────────┐   ┌────▼──────────────┐
    │ TaskService      │   │SettingsService    │
    │ (business logic) │   │ (business logic)   │
    └───┬──────────────┘   └────┬──────────────┘
        │                       │
    ┌───▼──────────────┐   ┌────▼──────────────┐
    │ TaskRepository   │   │ fileOperations    │
    │ (abstraction)    │   │ (safe writes)     │
    └───┬──────────────┘   └────┬──────────────┘
        │                       │
        ├──────────┬────────────┤
        │          │            │
    ┌───▼────┐ ┌───▼────┐  ┌───▼─────┐
    │Memory  │ │ JSON   │  │settings. │
    │Storage │ │Storage │  │json file │
    │(Maps)  │ │(File)  │  │          │
    └────────┘ └────────┘  └──────────┘
```

## Data Flow Diagram

### GET Settings Flow
```
1. User opens Settings page
   ↓
2. SettingsProvider mounts
   ↓
3. useEffect calls loadSettings()
   ↓
4. settingsApi.getSettings()
   ↓
5. HTTP GET /api/admin/settings
   ↓
6. Server receives request
   ↓
7. settingsController.getSettings()
   ↓
8. SettingsService.getSettings()
   ↓
9. Read settings.json file
   ↓
10. Return JSON response
   ↓
11. settingsApi receives data
   ↓
12. Update SettingsContext state
   ↓
13. Re-render component with current settings
```

### POST Settings Flow
```
1. User selects new storage type
   ↓
2. Click "Save Settings" button
   ↓
3. handleSave() calls saveSettings()
   ↓
4. settingsApi.saveSettings({taskRepo: "json"})
   ↓
5. HTTP POST /api/admin/settings with body
   ↓
6. Server receives request
   ↓
7. settingsController.saveSettings()
   ↓
8. Validate taskRepo value
   ↓
9. SettingsService.saveSettings({taskRepo: "json"})
   ↓
10. Validate settings object
   ↓
11. Write to api/src/data/settings.json (atomic)
   ↓
12. Return success response
   ↓
13. settingsApi receives response
   ↓
14. Update SettingsContext (restartRequired = true)
   ↓
15. Show orange restart warning
   ↓
16. Show success message
   ↓
17. User sees: "⚠️ Restart required to apply changes"
```

## Component Hierarchy

```
AdminLayout
├── Header (navigation)
├── Sidebar (menu)
│   └── Settings link
└── Content Area
    └── SettingsProvider
        └── SettingsPage
            ├── Loading indicator
            ├── Error message
            ├── RestartWarning (orange box)
            ├── Settings Form
            │   ├── Dropdown selector
            │   ├── Current storage display
            │   └── Save button
            └── Messages
                ├── Success message
                └── Error message
```

## State Management Flow

```
SettingsContext
├── State
│   ├── settings: {taskRepo: "memory" | "json"}
│   ├── loading: boolean
│   ├── error: string | null
│   └── restartRequired: boolean
│
└── Methods
    ├── loadSettings()
    │   ├── Fetch from API
    │   ├── Update state
    │   └── Handle errors
    │
    └── saveSettings(newSettings)
        ├── POST to API
        ├── Validate response
        ├── Update context
        └── Set restartRequired = true
```

## API Contract

### GET /api/admin/settings
```
Request:
  Method: GET
  URL: http://localhost:5000/api/admin/settings
  Headers: (none required)

Response (200 OK):
  {
    "taskRepo": "memory" | "json"
  }

Error Response (500):
  {
    "error": "Failed to retrieve settings",
    "message": "error details"
  }
```

### POST /api/admin/settings
```
Request:
  Method: POST
  URL: http://localhost:5000/api/admin/settings
  Headers:
    Content-Type: application/json
  Body:
    {
      "taskRepo": "memory" | "json"
    }

Response (200 OK):
  {
    "success": true,
    "message": "Settings saved successfully. Server restart required...",
    "settings": {
      "taskRepo": "json"
    }
  }

Error Response (400/500):
  {
    "error": "Invalid taskRepo value",
    "message": "taskRepo must be \"memory\" or \"json\"."
  }
```

## File Organization

```
Backend Storage Layer
├── settings.json (persistent)
└── fileOperations (utilities)

Backend Service Layer
├── SettingsService (business logic)
└── TaskService (existing)

Backend API Layer
├── settingsController (GET/POST handlers)
├── taskController (existing)
└── adminRoutes (routing)

Frontend API Layer
├── settingsApi (HTTP client)
└── api.ts (existing)

Frontend State Layer
├── SettingsContext (state management)
└── AppContext (existing)

Frontend Component Layer
├── SettingsPage (main page)
├── RestartWarning (notification)
├── AdminLayout (container)
└── Other components (existing)
```

## Technology Stack

```
API Communication
├── HTTP (REST)
├── JSON (data format)
└── Fetch API (browser)

State Management
├── React Context API
├── Custom hooks
└── Provider pattern

Styling
├── CSS (no framework)
├── Responsive design
└── Color scheme (#ffa500 orange)

Storage
├── JSON files
├── File system
└── Atomic operations

Validation
├── Frontend (input type checking)
├── Backend (enum values)
└── Both (taskRepo type)
```

## Restart Requirement

```
Server Startup
    │
    ├─► Read settings.json
    │   ├─ Get taskRepo value
    │   └─ Fallback to "memory"
    │
    ├─► RepositoryFactory.createRepository()
    │   ├─ Check TASK_REPO env var
    │   ├─ Check settings.json value
    │   └─ Instantiate correct repository
    │
    ├─► Inject into TaskService
    │   └─ Ready to handle requests
    │
    └─► All subsequent requests use selected repository

⚠️ Changing settings.json requires:
   1. Restart the backend server
   2. Then new repository type is used
   3. Frontend can see changes after refresh
```

## Navigation Flow

```
App Router (hash-based)
    │
    ├─► /#/tasks
    │   └─ TaskPage (task manager)
    │
    └─► /#/admin
        └─ AdminLayout
            │
            ├─► /#/admin/overview
            │   └─ Welcome page
            │
            ├─► /#/admin/users
            │   └─ Placeholder
            │
            └─► /#/admin/settings
                └─ SettingsProvider
                    └─ SettingsPage
                        ├─ Load settings
                        ├─ Display form
                        └─ Handle save
```

## Success Indicators

✅ Settings page loads successfully
✅ Current storage type displays
✅ Dropdown selector functional
✅ Save button works
✅ Orange warning appears after change
✅ Settings persisted to file
✅ Server restart applies settings
✅ API endpoints respond correctly
✅ Error handling works
✅ No console errors

---

This architecture provides a clean separation of concerns while maintaining a simple, understandable flow for the admin settings feature.
