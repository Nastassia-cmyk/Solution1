﻿﻿﻿﻿﻿﻿﻿# Task Manager MVP

A modern task management application for small teams (3-10 people) built with Node.js, React, and TypeScript.

## Features

- **Task Management**: Create, read, update, and delete tasks
- **Task Assignment**: Assign tasks to team members by user ID
- **Status Tracking**: Track task status (To Do, In Progress, Done)
- **Comments**: Add and manage comments on tasks (linked to user IDs)
- **Filtering**: Filter tasks by status
- **Centralized User Management**: Team members defined in `api/data/settings.json` with IDs, names, and roles
- **Flexible Storage**: Choose between in-memory or persistent JSON file storage
- **Admin Dashboard**: Separate admin interface for system administration and settings
- **Admin Overview**: View task statistics and completed tasks at a glance
- **Admin Users**: View and manage team members with role-based summaries
- **Storage Configuration**: Change repository type (in-memory/JSON) through admin settings with restart notification
- **Hash-Based Routing**: Navigate between Task Manager and Admin pages using URL hashes

## Tech Stack

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Repository Pattern** for flexible data persistence
- **Storage Options**: In-Memory (Maps) or JSON File
- **Atomic File Operations** for data integrity

### Frontend
- **React 18** with Hooks
- **TypeScript** for type safety
- **Vite** as build tool
- **CSS3** for styling (no external CSS framework in MVP)
- **Hash-Based Routing** for client-side navigation between pages

## Architecture

```
Solution1/
├── api/                          # Backend REST API
│   ├── src/
│   │   ├── server.ts            # Express setup & entry point
│   │   ├── types.ts             # TypeScript interfaces
│   │   ├── routes/
│   │   │   ├── taskRoutes.ts    # Task API routes
│   │   │   └── adminRoutes.ts   # Admin API routes
│   │   ├── controllers/
│   │   │   ├── taskController.ts # Task request handlers
│   │   │   └── settingsController.ts # Settings request handlers
│   │   ├── services/
│   │   │   ├── TaskService.ts   # Task business logic
│   │   │   └── SettingsService.ts # Settings business logic
│   │   ├── repositories/        # Data persistence abstraction
│   │   │   ├── TaskRepository.ts # Repository interface
│   │   │   ├── InMemoryTaskRepository.ts # In-memory implementation
│   │   │   ├── JsonTaskRepository.ts    # JSON file implementation
│   │   │   └── RepositoryFactory.ts    # Factory for repository selection
│   │   └── utils/
│   │       └── fileOperations.ts # Safe file I/O utilities
│   ├── data/                    # Task & settings data storage (auto-created)
│   │   ├── tasks.json           # Tasks data (JSON mode only)
│   │   └── settings.json        # Admin settings (auto-created)
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example             # Environment configuration template
│   └── .gitignore
│
├── web/                          # Frontend React App
│   ├── src/
│   │   ├── main.tsx             # React entry point
│   │   ├── App.tsx              # Main app router component
│   │   ├── types.ts             # TypeScript interfaces
│   │   ├── context/
│   │   │   ├── AppContext.tsx   # Global state management
│   │   │   └── SettingsContext.tsx # Admin settings state
│   │   ├── components/
│   │   │   ├── TaskForm.tsx     # Create task form
│   │   │   ├── TaskCard.tsx     # Task display card
│   │   │   ├── CommentSection.tsx # Comments UI
│   │   │   ├── StatusBadge.tsx  # Status indicator
│   │   │   ├── RestartWarning.tsx # Restart notification
│   │   │   ├── pages/           # Page components
│   │   │   │   ├── TaskPage.tsx # Task manager page
│   │   │   │   ├── AdminOverviewPage.tsx # Admin overview page
│   │   │   │   ├── AdminUsersPage.tsx # Admin users management page
│   │   │   │   ├── SettingsPage.tsx # Admin settings page
│   │   │   │   ├── TaskPage.css
│   │   │   │   └── SettingsPage.css
│   │   │   └── layouts/         # Layout components
│   │   │       ├── AdminLayout.tsx # Admin dashboard layout
│   │   │       ├── AdminLayout.css
│   │   │       └── MainLayout.tsx # Main (non-admin) layout
│   │   ├── hooks/
│   │   │   └── useAppContext.ts # Context hook
│   │   ├── services/
│   │   │   ├── api.ts           # Task API client
│   │   │   └── settingsApi.ts   # Settings API client
│   │   ├── styles/
│   │   │   ├── TaskForm.css
│   │   │   ├── TaskCard.css
│   │   │   ├── StatusBadge.css
│   │   │   ├── CommentSection.css
│   │   │   ├── AdminOverviewPage.css
│   │   │   ├── AdminUsersPage.css
│   │   │   └── RestartWarning.css
│   │   ├── App.css
│   │   └── main.css
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .gitignore
│
└── README.md                    # This file
```

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

#### 1. Backend Setup

```bash
cd api
npm install
```

#### 2. Frontend Setup

```bash
cd web
npm install
```

## Configuration

### Data Persistence

The Task Manager supports flexible data persistence strategies. The repository type is configured through `api/data/settings.json`, which is read on server startup.

#### Configuration Priority

On server startup, the repository type is determined in this order:
1. **`api/data/settings.json`** (if file exists and is valid) - **Primary configuration**
2. **`TASK_REPO` environment variable** (fallback)
3. **Default to `memory`** (if neither above is configured)

#### In-Memory Mode (Default)
- **Configuration**: `"taskRepo": "memory"` in `api/data/settings.json` or `TASK_REPO=memory`
- **Storage**: Data stored in application memory using Maps
- **Persistence**: Data is lost when the application restarts
- **Use Case**: Development, testing, prototyping
- **Default behavior**: If `settings.json` is missing, the server defaults to in-memory mode

#### JSON File Mode
- **Configuration**: `"taskRepo": "json"` in `api/data/settings.json` or `TASK_REPO=json`
- **Storage**: Data persisted to `api/data/tasks.json`
- **Persistence**: Data survives application restarts
- **Features**: Atomic writes using temp file + rename pattern (prevents corruption)
- **Use Case**: Production, persistent data storage

### Setting Repository Type

#### Option 1: Configure via Admin Settings (Recommended)
1. Navigate to `http://localhost:3000/#/admin/settings`
2. Select repository type from the dropdown
3. Click "Save Settings"
4. A notification will appear indicating server restart is required
5. Restart the backend server to apply changes
6. The new setting is persisted to `api/data/settings.json`

#### Option 2: Manual Configuration via settings.json
Edit `api/data/settings.json` directly:
```json
{
  "taskRepo": "json"
}
```
Then restart the backend server.

#### Option 3: Environment Variable (Legacy)
If `settings.json` is missing, you can set the `TASK_REPO` environment variable before starting the server.

**Linux/Mac:**
```bash
cd api
TASK_REPO=json npm run dev
```

**Windows (PowerShell):**
```powershell
cd api
$env:TASK_REPO="json"; npm run dev
```

**Windows (CMD):**
```cmd
cd api
set TASK_REPO=json
npm run dev
```

#### Option 4: Create `.env` file in `api/` folder (for environment variables)
```bash
cd api
cp .env.example .env
# Edit .env and set: TASK_REPO=json
```

## Running the Application

### Server Startup Behavior

When you start the backend server, it performs the following initialization sequence:

1. **Read Configuration**: Loads `api/data/settings.json` to determine the repository type
   - If the file exists and contains a valid `taskRepo` setting, that value is used
   - If the file is missing or invalid, defaults to `"memory"` mode
2. **Initialize Repository**: Creates a TaskRepository instance based on the configuration
   - In-Memory: Creates an in-memory storage using Maps
   - JSON: Creates a JSON file-based storage that reads from/writes to `api/data/tasks.json`
   - Automatically creates missing files with proper structure
   - Automatically detects and recovers from corrupted files
3. **Start Server**: Begins listening on port 5000
4. **Log Configuration**: Prints detailed initialization logs for verification

Example startup output:
```
[Startup] Initializing TaskService...
[Startup] Repository configuration from settings.json: taskRepo="json"
[Repository] Using JsonTaskRepository
[Startup] TaskService initialized successfully
Server is running on http://localhost:5000
```

### Start Backend (Terminal 1)

```bash
cd api
npm run dev
```

The server will run on `http://localhost:5000`

**Available scripts:**
- `npm run dev` - Run with ts-node (development)
- `npm run build` - Compile TypeScript and copy data files
- `npm start` - Run compiled JavaScript

**Build Process:**
The `npm run build` command performs two steps:
1. Compiles TypeScript source files to JavaScript in the `dist/` directory
2. Copies JSON data files from `src/data/` to `dist/data/` using the `scripts/copy-data.js` script

This ensures that `api/data/settings.json` is available in the production build.

### Start Frontend (Terminal 2)

```bash
cd web
npm run dev
```

The app will run on `http://localhost:3000`

**Available scripts:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Navigation & Routes

The frontend uses hash-based routing to navigate between different sections:

### Available Routes

| Route | Description |
|-------|-------------|
| `/#/tasks` | Task Manager (default) - Main task management interface |
| `/#/admin` | Admin Dashboard - Administration overview page |
| `/#/admin/overview` | Admin Overview - View task statistics and completed tasks |
| `/#/admin/users` | Admin Users - View and manage team members |
| `/#/admin/settings` | Admin Settings - Configure storage type and system settings |

### Switching Between Routes

You can navigate between routes in two ways:

1. **Using Navigation Buttons**: Click the navigation buttons in the header
   - "Tasks" button navigates to the task manager
   - "Admin" button navigates to the admin dashboard

2. **Using URL Hash**: Manually change the URL hash
   - Go to `http://localhost:3000/#/tasks` for task manager
   - Go to `http://localhost:3000/#/admin` for admin dashboard
   - Go to `http://localhost:3000/#/admin/overview` for admin overview
   - Go to `http://localhost:3000/#/admin/users` for users management
   - Go to `http://localhost:3000/#/admin/settings` for settings

## API Endpoints

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create a new task |
| GET | `/api/tasks/:id` | Get task by ID |
| PATCH | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

### Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/:taskId/comments` | Get task comments |
| POST | `/api/tasks/:taskId/comments` | Add comment |
| DELETE | `/api/tasks/comments/:commentId` | Delete comment |

### Admin Settings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/settings` | Get current admin settings (repository type) |
| POST | `/api/admin/settings` | Save admin settings (requires server restart) |

### Example Requests

**Create Task:**
```json
POST /api/tasks
{
  "title": "Design new landing page",
  "description": "Create mockups and design for new homepage",
  "assignee": 4
}
```

**Update Task:**
```json
PATCH /api/tasks/abc123
{
  "status": "in-progress",
  "assignee": 2
}
```

**Add Comment:**
```json
POST /api/tasks/abc123/comments
{
  "author": 3,
  "text": "Started working on this task"
}
```

**Get Settings:**
```json
GET /api/admin/settings

Response:
{
  "taskRepo": "memory",
  "users": [
    { "id": 1, "name": "Alice", "role": "developer" },
    { "id": 2, "name": "Bob", "role": "developer" },
    { "id": 3, "name": "Charlie", "role": "developer" },
    { "id": 4, "name": "Diana", "role": "designer" },
    { "id": 5, "name": "Eve", "role": "developer" }
  ]
}
```

**Save Settings:**
```json
POST /api/admin/settings
{
  "taskRepo": "json"
}

Response:
{
  "success": true,
  "message": "Settings saved successfully. Server restart required to apply changes.",
  "settings": {
    "taskRepo": "json",
    "users": [...]
  }
}
```

## Data Models

### User
```typescript
{
  id: number              // Unique user identifier
  name: string            // User's display name
  role: string            // User's role (e.g., 'developer', 'designer')
}
```

### Task
```typescript
{
  id: string              // UUID
  title: string
  description: string
  status: TaskStatus      // 'todo' | 'in-progress' | 'done'
  assignee?: number       // Optional user ID
  createdAt: Date
  updatedAt: Date
}
```

### Comment
```typescript
{
  id: string              // UUID
  taskId: string
  author: number          // User ID
  text: string
  createdAt: Date
}
```

## Team Members

The team members are centralized in `api/data/settings.json`. The default team includes:

- Alice (developer)
- Bob (developer)
- Charlie (developer)
- Diana (designer)
- Eve (developer)

### Modifying Team Members

To modify the team members:

1. Edit `api/data/settings.json` and update the `users` array
2. Ensure each user has:
   - `id` (unique number)
   - `name` (string)
   - `role` (string)
3. Restart the backend server for changes to take effect

Example:
```json
{
  "taskRepo": "json",
  "users": [
    { "id": 1, "name": "Alice", "role": "developer" },
    { "id": 2, "name": "Bob", "role": "developer" },
    { "id": 3, "name": "Charlie", "role": "developer" },
    { "id": 4, "name": "Diana", "role": "designer" },
    { "id": 5, "name": "Eve", "role": "developer" }
  ]
}
```

**Important**: When updating users, ensure that:
- All user IDs are unique
- All user IDs used in existing tasks and comments exist in the users list
- IDs should be consistent (don't change existing user IDs)

## Features Overview

### Create Tasks
- Use the form in the left sidebar
- Provide title, description, and optional assignee
- Tasks are created with "To Do" status

### View & Filter Tasks
- See all tasks in the main content area
- Filter by status using buttons
- View task statistics at the top

### Update Tasks
- Click a task to expand details
- Double-click task title to edit
- Change status using the status dropdown
- Double-click assignee to reassign

### Delete Tasks
- Click the ✕ button on any task card
- Confirm the deletion
- Deletes task and all associated comments

### Comments
- Expand a task to see comments
- Add comment with your name (team member dropdown)
- Delete comments using the ✕ button
- Comments auto-load when expanding a task

### Admin Overview
- Access via "Overview" in the admin sidebar (requires navigating to Admin Dashboard first)
- View task statistics at a glance:
  - Total number of tasks
  - Count of tasks in each status (To Do, In Progress, Done)
- Styled summary cards with color-coded status indicators
- View the last 5 completed tasks in a table format:
  - Task Title
  - Assigned To (team member)
  - Completion Date (with timestamp)
- Empty state message shown if no completed tasks exist
- Data source: All tasks from the backend API

### Admin Users
- Access via "Users" in the admin sidebar (requires navigating to Admin Dashboard first)
- View summary cards showing:
  - Total number of users
  - Count of users in each role (developer, designer, etc.)
- Browse all team members in a table with:
  - User ID
  - User Name
  - User Role (color-coded badge)
- Empty state message shown if no users exist
- Data source: Users list from `api/data/settings.json`
- Role-based color coding for easy identification

### Admin Settings
- Access via "Settings" in the admin sidebar (requires navigating to Admin Dashboard first)
- View current storage type (In-Memory or JSON File)
- Change repository type through a dropdown selector
- Orange warning message indicates that server restart is required to apply changes
- Settings are persisted to `api/data/settings.json`
- **Important**: The repository type is read from `settings.json` when the server starts. After changing settings, you must restart the backend server for the new repository type to take effect.
- The new repository type becomes active only after the server restarts and reads the updated `settings.json`

## Development Notes

### State Management
- Uses React Context API for global state
- Task state in `AppContext.tsx`
- Settings state in `SettingsContext.tsx`
- Custom hooks for component access (`useAppContext()`, etc.)

### API Client
- Centralized API calls in `services/` directory
  - `api.ts` for task-related API calls
  - `settingsApi.ts` for admin settings API calls
- Object-based structure for organization
- Error handling at service level

### Styling
- CSS Modules approach (scoped CSS per component)
- Responsive design with media queries
- Color scheme: Purple gradient (#667eea → #764ba2)

## Future Enhancements (Post-MVP)

1. **Authentication**: Add user authentication and authorization
2. **Database**: Replace in-memory storage with MongoDB/PostgreSQL
3. **Real-time Updates**: Add WebSockets for real-time collaboration
4. **User Profiles**: Extended user information and profiles
5. **Notifications**: Email/in-app notifications for task updates
6. **Search**: Full-text search for tasks and comments
7. **Labels/Tags**: Categorize tasks
8. **Attachments**: Upload files to tasks
9. **Activity Log**: Track task history
10. **Export**: Export tasks to CSV/PDF

## Troubleshooting

### Backend won't start
- Ensure port 5000 is not in use
- Check Node.js version (requires 16+)
- Try: `npm install` in the `api` folder

### Frontend won't connect to API
- Ensure backend is running on port 5000
- Check CORS headers (should be enabled in server.ts)
- Check browser console for errors

### Tasks not persisting
- **In-Memory Mode** (default): Data is stored in-memory only. Refreshing the page or restarting the app will reset all data. This is expected behavior.
- **JSON File Mode**: If using `TASK_REPO=json`, data is persisted to `api/data/tasks.json`. Check that:
  - The `api/data/` directory was created automatically
  - The file `api/data/tasks.json` exists with task data
  - The `api/data/` directory has write permissions
  - Set `TASK_REPO=json` environment variable before starting the app

### "Failed to create task" or "Failed to fetch tasks" in JSON mode
- **Issue**: These errors occur when `api/data/tasks.json` is malformed (missing opening brace `{`, invalid JSON, or encoding issues with BOM)
- **Automatic Recovery**: Starting from the latest version, the server automatically detects and fixes corrupted `tasks.json` files:
  - On startup, if the file is missing, it will be automatically created with proper structure
  - If the file exists but is corrupted/unparseable, it will be automatically reset with valid structure
  - Check the server logs for `[JsonTaskRepository]` messages to see if recovery occurred
- **Manual Fix**: If needed, ensure `api/data/tasks.json` contains valid JSON:
  ```json
  {
    "tasks": [],
    "comments": []
  }
  ```
- **Reset**: Delete the corrupted `tasks.json` file and restart the server. It will automatically recreate the file with valid structure.
- **Encoding**: The file must be saved as UTF-8 (without BOM). If you're manually editing the file, ensure proper encoding.
- **Debugging**: If you still see errors, check the server console output for detailed error messages prefixed with `[TaskController]` or `[JsonTaskRepository]`. These logs show the exact nature of the error.

### Server console logs show detailed error information
- **[Startup]** logs: Show how the repository is being initialized
- **[Repository]** logs: Show which repository type is being used
- **[JsonTaskRepository]** logs: Show initialization and recovery of tasks.json
- **[TaskController]** logs: Show detailed error messages when API operations fail
- **[SettingsService]** logs: Show issues with reading or writing settings.json

These detailed logs help troubleshoot issues quickly. If you encounter an error, check the server console first.

## Project Structure Principles

1. **Separation of Concerns**: Routes → Controllers → Services → Data
2. **Type Safety**: Full TypeScript usage across frontend and backend
3. **Reusability**: Modular components and services
4. **Scalability**: Easy to add database, authentication, etc.
5. **Clarity**: Clear folder organization matching functionality

## License

MIT

## Author

Task Manager MVP - 2026
