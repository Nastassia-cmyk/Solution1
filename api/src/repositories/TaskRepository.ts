import { Task, Comment } from '../types';

/**
 * Repository interface for Task persistence operations
 * Abstracts the underlying storage mechanism (in-memory, file, database, etc.)
 */
export interface ITaskRepository {
  // Task operations
  getAllTasks(): Task[];
  getTaskById(id: string): Task | undefined;
  createTask(task: Task): void;
  updateTask(id: string, task: Task): void;
  deleteTask(id: string): boolean;
  
  // Comment operations (nested in tasks)
  getTaskComments(taskId: string): Comment[];
  addTaskComment(taskId: string, comment: Comment): void;
  deleteTaskComment(taskId: string, commentId: string): boolean;
}
