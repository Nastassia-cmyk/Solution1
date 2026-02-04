Introduce TaskRepository interface in API and two implementations: 
InMemoryTaskRepository (current behavior) and JsonTaskRepository (persist to api/data/tasks.json with safe write temp+rename).
Add config selection via TASK_REPO=memory|json (default memory).
Keep API endpoints unchanged (don't change api/src/controllers/taskController.ts file).

First output: plan + exact file list. Don't implement it yet.