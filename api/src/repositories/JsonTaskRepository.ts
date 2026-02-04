import path from 'path';
import { Task, Comment } from '../types';
import { ITaskRepository } from './TaskRepository';
import { safeWriteFile, safeReadJsonFile, ensureDir } from '../utils/fileOperations';

interface StoredTask extends Omit<Task, 'createdAt' | 'updatedAt'> {
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

interface StoredData {
  tasks: StoredTask[];
  comments: Array<Comment & { createdAt: string }>; // ISO string for createdAt
}

/**
 * JSON file-based implementation of TaskRepository
 * Persists all data to api/data/tasks.json file
 * Automatically creates the data directory if it doesn't exist
 * Uses atomic writes (temp file + rename) to prevent data corruption
 */
export class JsonTaskRepository implements ITaskRepository {
  private dataDir: string;
  private filePath: string;

  constructor() {
    // Resolve data directory path relative to this file's location
    // Using __dirname ensures correct path regardless of where server is started from
    this.dataDir = path.resolve(__dirname, '..', 'data');
    this.filePath = path.join(this.dataDir, 'tasks.json');
    
    // Ensure data directory exists
    ensureDir(this.dataDir);
    
    // Initialize tasks.json with proper structure if it doesn't exist
    this.initializeFile();
  }

  /**
   * Initialize tasks.json file with proper structure if it's missing or invalid
   */
  private initializeFile(): void {
    const fs = require('fs');
    
    try {
      if (!fs.existsSync(this.filePath)) {
        // File doesn't exist, create it with initial structure
        const initialData: StoredData = { tasks: [], comments: [] };
        const content = JSON.stringify(initialData, null, 2);
        safeWriteFile(this.filePath, content);
        console.log('[JsonTaskRepository] Initialized tasks.json');
      } else {
        // File exists, verify it can be parsed
        try {
          const content = fs.readFileSync(this.filePath, 'utf-8');
          JSON.parse(content);
        } catch (parseError) {
          // File is corrupted, reinitialize it
          console.warn('[JsonTaskRepository] Found corrupted tasks.json, reinitializing...');
          const initialData: StoredData = { tasks: [], comments: [] };
          const content = JSON.stringify(initialData, null, 2);
          safeWriteFile(this.filePath, content);
        }
      }
    } catch (error) {
      console.error('[JsonTaskRepository] Error initializing tasks.json:', error);
    }
  }

  /**
   * Load all data from file
   * Deserializes ISO date strings back to Date objects
   */
  private loadData(): StoredData {
    const data = safeReadJsonFile<StoredData>(this.filePath);
    // Ensure data has the required structure, even if file doesn't exist or is empty
    return {
      tasks: (data && data.tasks) ? data.tasks : [],
      comments: (data && data.comments) ? data.comments : []
    };
  }

  /**
   * Save all data to file
   * Serializes Date objects to ISO strings for JSON compatibility
   */
  private saveData(data: StoredData): void {
    const content = JSON.stringify(data, null, 2);
    safeWriteFile(this.filePath, content);
  }

  /**
   * Convert stored task (with string dates) to Task (with Date objects)
   */
  private deserializeTask(stored: StoredTask): Task {
    return {
      ...stored,
      createdAt: new Date(stored.createdAt),
      updatedAt: new Date(stored.updatedAt),
    };
  }

  /**
   * Convert Task (with Date objects) to stored format (with ISO strings)
   */
  private serializeTask(task: Task): StoredTask {
    return {
      ...task,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  }

  /**
   * Convert stored comment (with string date) to Comment (with Date object)
   */
  private deserializeComment(stored: any): Comment {
    return {
      ...stored,
      createdAt: new Date(stored.createdAt),
    };
  }

  /**
   * Convert Comment (with Date object) to stored format (with ISO string)
   */
  private serializeComment(comment: Comment): any {
    return {
      ...comment,
      createdAt: comment.createdAt.toISOString(),
    };
  }

  // Task operations
  getAllTasks(): Task[] {
    const data = this.loadData();
    return data.tasks.map(task => this.deserializeTask(task));
  }

  getTaskById(id: string): Task | undefined {
    const data = this.loadData();
    const task = data.tasks.find(t => t.id === id);
    return task ? this.deserializeTask(task) : undefined;
  }

  createTask(task: Task): void {
    const data = this.loadData();
    data.tasks.push(this.serializeTask(task));
    this.saveData(data);
  }

  updateTask(id: string, task: Task): void {
    const data = this.loadData();
    const index = data.tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      data.tasks[index] = this.serializeTask(task);
      this.saveData(data);
    }
  }

  deleteTask(id: string): boolean {
    const data = this.loadData();
    const initialLength = data.tasks.length;
    
    // Remove task
    data.tasks = data.tasks.filter(t => t.id !== id);
    
    // Remove associated comments
    data.comments = data.comments.filter(c => c.taskId !== id);
    
    const found = data.tasks.length < initialLength;
    if (found) {
      this.saveData(data);
    }
    
    return found;
  }

  // Comment operations
  getTaskComments(taskId: string): Comment[] {
    const data = this.loadData();
    return data.comments
      .filter(c => c.taskId === taskId)
      .map(c => this.deserializeComment(c));
  }

  addTaskComment(taskId: string, comment: Comment): void {
    const data = this.loadData();
    data.comments.push(this.serializeComment(comment));
    this.saveData(data);
  }

  deleteTaskComment(taskId: string, commentId: string): boolean {
    const data = this.loadData();
    const initialLength = data.comments.length;
    
    data.comments = data.comments.filter(
      c => !(c.taskId === taskId && c.id === commentId)
    );
    
    const found = data.comments.length < initialLength;
    if (found) {
      this.saveData(data);
    }
    
    return found;
  }
}
