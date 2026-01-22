# Task Manager MVP

A modern task management application for small teams (3-10 people) built with Node.js, React, and TypeScript.

## Features

- **Task Management**: Create, read, update, and delete tasks
- **Task Assignment**: Assign tasks to team members
- **Status Tracking**: Track task status (To Do, In Progress, Done)
- **Comments**: Add and manage comments on tasks
- **Filtering**: Filter tasks by status
- **Team Members**: Pre-configured team members for assignment and comments
- **In-Memory Storage**: All data persists during the session

## Tech Stack

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **In-Memory Storage** (Maps) for data persistence

### Frontend
- **React 18** with Hooks
- **TypeScript** for type safety
- **Vite** as build tool
- **CSS3** for styling (no external CSS framework in MVP)

## Architecture

```
Solution1/
├── api/                          # Backend REST API
│   ├── src/
│   │   ├── server.ts            # Express setup & entry point
│   │   ├── types.ts             # TypeScript interfaces
│   │   ├── routes/
│   │   │   └── taskRoutes.ts    # API routes
│   │   ├── controllers/
│   │   │   └── taskController.ts # Request handlers
│   │   └── services/
│   │       └── TaskService.ts   # Business logic & data
│   ├── package.json
│   ├── tsconfig.json
│   └── .gitignore
│
├── web/                          # Frontend React App
│   ├── src/
│   │   ├── main.tsx             # React entry point
│   │   ├── App.tsx              # Main app component
│   │   ├── types.ts             # TypeScript interfaces
│   │   ├── context/
│   │   │   └── AppContext.tsx   # Global state management
│   │   ├── components/
│   │   │   ├── TaskForm.tsx     # Create task form
│   │   │   ├── TaskCard.tsx     # Task display card
│   │   │   ├── CommentSection.tsx # Comments UI
│   │   │   └── StatusBadge.tsx  # Status indicator
│   │   ├── hooks/
│   │   │   └── useAppContext.ts # Context hook
│   │   ├── services/
│   │   │   └── api.ts           # API client
│   │   ├── styles/
│   │   │   ├── TaskForm.css
│   │   │   ├── TaskCard.css
│   │   │   ├── StatusBadge.css
│   │   │   └── CommentSection.css
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

## Running the Application

### Start Backend (Terminal 1)

```bash
cd api
npm run dev
```

The server will run on `http://localhost:5000`

**Available scripts:**
- `npm run dev` - Run with ts-node (development)
- `npm run build` - Compile TypeScript
- `npm start` - Run compiled JavaScript

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

### Example Requests

**Create Task:**
```json
POST /api/tasks
{
  "title": "Design new landing page",
  "description": "Create mockups and design for new homepage",
  "assignee": "Alice"
}
```

**Update Task:**
```json
PATCH /api/tasks/abc123
{
  "status": "in-progress",
  "assignee": "Bob"
}
```

**Add Comment:**
```json
POST /api/tasks/abc123/comments
{
  "author": "Charlie",
  "text": "Started working on this task"
}
```

## Data Models

### Task
```typescript
{
  id: string              // UUID
  title: string
  description: string
  status: TaskStatus      // 'todo' | 'in-progress' | 'done'
  assignee?: string       // Optional team member
  createdAt: Date
  updatedAt: Date
}
```

### Comment
```typescript
{
  id: string              // UUID
  taskId: string
  author: string          // Team member name
  text: string
  createdAt: Date
}
```

## Team Members (MVP)

The following team members are available for assignment:
- Alice
- Bob
- Charlie
- Diana
- Eve

These can be modified in `web/src/App.tsx` → `TEAM_MEMBERS` constant.

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

## Development Notes

### State Management
- Uses React Context API for global state
- Centralized in `AppContext.tsx`
- Custom hook `useAppContext()` for component access

### API Client
- Centralized API calls in `services/api.ts`
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
- This is expected! Data is stored in-memory only
- Refreshing the page will reset all data
- This is by design for the MVP

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
