import { v4 as uuidv4 } from 'uuid';
import { Task, Comment, CreateTaskInput, UpdateTaskInput, CreateCommentInput } from '../types';

class TaskService {
  private tasks: Map<string, Task> = new Map();
  private comments: Map<string, Comment> = new Map();

  // Task operations
  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  getTaskById(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  createTask(input: CreateTaskInput): Task {
    const id = uuidv4();
    const now = new Date();
    const task: Task = {
      id,
      ...input,
      status: 'todo',
      createdAt: now,
      updatedAt: now,
    };
    this.tasks.set(id, task);
    return task;
  }

  updateTask(id: string, input: UpdateTaskInput): Task | undefined {
    const task = this.tasks.get(id);
    if (!task) return undefined;

    const updated: Task = {
      ...task,
      ...input,
      updatedAt: new Date(),
    };
    this.tasks.set(id, updated);
    return updated;
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

  addComment(taskId: string, input: CreateCommentInput): Comment | undefined {
    const task = this.tasks.get(taskId);
    if (!task) return undefined;

    const id = uuidv4();
    const comment: Comment = {
      id,
      taskId,
      ...input,
      createdAt: new Date(),
    };
    this.comments.set(id, comment);
    return comment;
  }

  deleteComment(id: string): boolean {
    return this.comments.delete(id);
  }
}

export default new TaskService();
