import { Task, Comment } from '../types';
import { ITaskRepository } from './TaskRepository';

/**
 * In-memory implementation of TaskRepository
 * Stores tasks and comments in memory using Maps
 * Data is lost when the application restarts
 */
export class InMemoryTaskRepository implements ITaskRepository {
  private tasks: Map<string, Task> = new Map();
  private comments: Map<string, Comment> = new Map();

  // Task operations
  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  getTaskById(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  createTask(task: Task): void {
    this.tasks.set(task.id, task);
  }

  updateTask(id: string, task: Task): void {
    this.tasks.set(id, task);
  }

  deleteTask(id: string): boolean {
    // Also delete associated comments
    const commentsToDelete = Array.from(this.comments.values())
      .filter(c => c.taskId === id)
      .map(c => c.id);
    
    commentsToDelete.forEach(commentId => this.comments.delete(commentId));
    return this.tasks.delete(id);
  }

  // Comment operations
  getTaskComments(taskId: string): Comment[] {
    return Array.from(this.comments.values()).filter(c => c.taskId === taskId);
  }

  addTaskComment(taskId: string, comment: Comment): void {
    this.comments.set(comment.id, comment);
  }

  deleteTaskComment(taskId: string, commentId: string): boolean {
    return this.comments.delete(commentId);
  }
}
