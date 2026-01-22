# Architecture Overview

## System Design

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                          │
│                      (React + TypeScript)                       │
├─────────────────────────────────────────────────────────────────┤
│  UI Components  │  Pages  │  Context API  │  Custom Hooks       │
├─────────────────────────────────────────────────────────────────┤
│                    API Client Layer                             │
│              (services/api.ts - Fetch wrapper)                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                    HTTP/REST
                    (CORS enabled)
                         │
┌────────────────────────┴────────────────────────────────────────┐
│                       BACKEND LAYER                             │
│                   (Node.js + Express.js)                        │
├─────────────────────────────────────────────────────────────────┤
│              Routes (taskRoutes.ts)                             │
│                      ↓                                          │
│           Controllers (taskController.ts)                       │
│           Request validation & mapping                         │
│                      ↓                                          │
│           Services (TaskService.ts)                            │
│           Business logic & data operations                     │
│                      ↓                                          │
│         Data Store (In-Memory Maps)                            │
│         • tasks: Map<id, Task>                                 │
│         • comments: Map<id, Comment>                           │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Components Tree

```
App.tsx (Main container)
├── TaskForm.tsx (Left sidebar)
│   └── Form inputs for creating tasks
├── TaskStats (Display counters)
├── Filter buttons (by status)
└── TasksContainer
    └── TaskCard.tsx (Repeating)
        ├── StatusBadge.tsx (Inline dropdown)
        ├── TaskTitle (Editable)
        ├── TaskMeta (assignee, dates)
        └── CommentSection.tsx
            ├── Comments list
            └── Comment form
```

### Backend Route Structure

```
/api/tasks
├── GET        → getAllTasks()
├── POST       → createTask()
├── /:id
│   ├── GET    → getTaskById()
│   ├── PATCH  → updateTask()
│   ├── DELETE → deleteTask()
│   └── /comments
│       ├── GET  → getTaskComments()
│       └── POST → addComment()
└── /comments/:commentId
    └── DELETE → deleteComment()
```

## State Management

### Global State (AppContext)

```typescript
{
  // Data
  tasks: Task[]
  comments: Map<string, Comment[]>
  
  // States
  loading: boolean
  error: string | null
  
  // Actions
  loadTasks(): Promise<void>
  addTask(data): Promise<void>
  updateTask(id, data): Promise<void>
  deleteTask(id): Promise<void>
  loadComments(taskId): Promise<void>
  addComment(taskId, data): Promise<void>
  deleteComment(taskId, commentId): Promise<void>
}
```

### Component Local State

- **App.tsx**: `filterStatus` (current filter selection)
- **TaskForm.tsx**: `title`, `description`, `assignee` (form inputs)
- **TaskCard.tsx**: `isExpanded`, `editingField`, `editValues` (card state)
- **CommentSection.tsx**: `author`, `text` (comment form)

## Data Flow

### Creating a Task

```
1. User fills TaskForm.tsx
2. handleSubmit() calls addTask() from context
3. Context calls api.tasks.create() 
4. API sends POST /api/tasks to backend
5. Backend: route → controller → service → store
6. Returns new Task object
7. Context updates local tasks array
8. UI re-renders with new task
```

### Updating Task Status

```
1. User clicks status dropdown in StatusBadge
2. onChange handler calls updateTask() from context
3. Context calls api.tasks.update()
4. API sends PATCH /api/tasks/:id to backend
5. Backend updates task in service
6. Returns updated Task object
7. Context updates tasks array
8. UI re-renders task with new status
```

### Adding Comment

```
1. User fills comment form in CommentSection
2. handleSubmit() calls addComment() from context
3. Context calls api.comments.create(taskId, data)
4. API sends POST /api/tasks/:taskId/comments
5. Backend: route → controller → service → store
6. Returns new Comment object
7. Context updates comments Map for that task
8. UI re-renders comment list
```

## Data Storage

### In-Memory Store Structure

```typescript
// TaskService.ts
private tasks: Map<string, Task> = new Map()
// {
//   "uuid-1": { id, title, description, status, assignee, createdAt, updatedAt }
//   "uuid-2": { ... }
// }

private comments: Map<string, Comment> = new Map()
// {
//   "uuid-comment-1": { id, taskId, author, text, createdAt }
//   "uuid-comment-2": { ... }
// }
```

### Why Maps?
- O(1) lookup by ID
- Efficient for CRUD operations
- Easy to iterate/filter
- Perfect for MVP with small datasets

## Error Handling

### Backend Error Handling

1. **Route Level**: Express middleware catches route errors
2. **Controller Level**: Try-catch blocks, validation checks
3. **Response**: HTTP status codes + JSON error messages

```javascript
try {
  // Process request
} catch (error) {
  res.status(500).json({ error: 'Error message' })
}
```

### Frontend Error Handling

1. **API Level**: Try-catch in api.ts functions
2. **Context Level**: Error state stored in context
3. **UI Level**: Error messages displayed in components

```typescript
try {
  await operation()
} catch (err) {
  setError(err.message)
  throw err // Re-throw for component handling
}
```

## TypeScript Usage

### Shared Types

- **Task**: Task object with all properties
- **TaskStatus**: 'todo' | 'in-progress' | 'done'
- **Comment**: Comment object
- **CreateTaskInput**: Task creation payload
- **UpdateTaskInput**: Task update payload
- **CreateCommentInput**: Comment creation payload

### Type Benefits

✅ Compile-time error checking
✅ IDE autocompletion
✅ Self-documenting code
✅ Catch API contract violations
✅ Refactoring safety

## Scalability Considerations

### Current MVP Limitations

- In-memory storage (data lost on restart)
- No database
- No authentication
- Single server instance
- No caching

### Path to Production

1. **Database**: Replace in-memory Maps with database
   - Minimal changes needed - just update TaskService
   - Keep same service interface

2. **Authentication**: Add JWT/OAuth
   - Add auth middleware to Express
   - Add auth state to React Context

3. **Scaling**: Add clustering, caching, load balancing
   - Separate backend instances
   - Add Redis for caching
   - Use queue system for async tasks

4. **Real-time**: Add WebSockets
   - Socket.io for real-time updates
   - Pub/sub model for task changes

## Performance Characteristics

### Current
- GET /api/tasks: O(1) - Map lookup
- POST /api/tasks: O(1) - Map insertion
- PATCH /api/tasks/:id: O(1) - Map update
- DELETE /api/tasks/:id: O(n) - Need to find/delete associated comments

### With Database
- Depends on database query optimization
- Recommend indexes on: id, status, assignee, taskId (for comments)

## Testing Strategy (For Future)

### Unit Tests
- TaskService methods
- Controller validation
- React component rendering

### Integration Tests
- API endpoint behavior
- Context state management
- Component interactions

### E2E Tests
- User workflows (create → assign → comment → done)
- Filter & search functionality
- Error scenarios

## Security Considerations

### Current MVP
⚠️ **No authentication** - Anyone can do anything
⚠️ **No input validation** - Could add XSS attacks
⚠️ **No HTTPS** - Local development only

### Future Hardening
1. Add input validation on backend
2. Sanitize HTML in comments
3. Add user authentication
4. Add authorization checks
5. Add rate limiting
6. Use HTTPS in production

## Deployment Architecture

### Development
- Frontend: `localhost:3000` (Vite dev server)
- Backend: `localhost:5000` (ts-node)

### Production (Future)
```
┌─────────────────────┐
│   CDN / Static      │
│   Frontend Assets   │
│  (S3 + CloudFront)  │
└──────────┬──────────┘
           │
┌──────────┴──────────┐
│  Load Balancer      │
│  (HTTPS/SSL)        │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    │   Node.js   │
    │  Instances  │
    │  (Scaled)   │
    └──────┬──────┘
           │
┌──────────┴──────────┐
│   Database Layer    │
│  (MongoDB/Postgres) │
└─────────────────────┘
```

---

This architecture emphasizes clarity, maintainability, and scalability from the ground up!
