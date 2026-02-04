import express, { Express, Request, Response, NextFunction } from 'express';
import taskRoutes from './routes/taskRoutes';
import adminRoutes from './routes/adminRoutes';
import taskService from './services/TaskService';
import { RepositoryFactory } from './repositories/RepositoryFactory';
import settingsService from './services/SettingsService';

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Initialize repository based on settings.json configuration
console.log('[Startup] Initializing TaskService...');
const settings = settingsService.getSettings();
console.log(`[Startup] Repository configuration from settings.json: taskRepo="${settings.taskRepo}"`);
try {
  const repository = RepositoryFactory.createRepository(settings.taskRepo);
  taskService.setRepository(repository);
  console.log('[Startup] TaskService initialized successfully');
} catch (error) {
  console.error('[Startup] Failed to initialize repository:', error);
  process.exit(1);
}

// Middleware
app.use(express.json());

// CORS middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK' });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
