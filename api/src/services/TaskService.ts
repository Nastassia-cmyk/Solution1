import { v4 as uuidv4 } from 'uuid';
import { Task, Comment, CreateTaskInput, UpdateTaskInput, CreateCommentInput } from '../types';
import { ITaskRepository } from '../repositories/TaskRepository';

class TaskService {
  private repository?: ITaskRepository;

  /**
   * Initialize TaskService with a repository instance
   * This allows the service to use different persistence strategies
   */
  setRepository(repository: ITaskRepository): void {
    this.repository = repository;
  }

  // Task operations
  getAllTasks(): Task[] {
    if (!this.repository) {
      throw new Error('TaskService not initialized with a repository');
    }
    return this.repository.getAllTasks();
  }

  getTaskById(id: string): Task | undefined {
    if (!this.repository) {
      throw new Error('TaskService not initialized with a repository');
    }
    return this.repository.getTaskById(id);
  }

  createTask(input: CreateTaskInput): Task {
    if (!this.repository) {
      throw new Error('TaskService not initialized with a repository');
    }
    const id = uuidv4();
    const now = new Date();
    const task: Task = {
      id,
      ...input,
      status: 'todo',
      createdAt: now,
      updatedAt: now,
    };
    this.repository.createTask(task);
    return task;
  }

  updateTask(id: string, input: UpdateTaskInput): Task | undefined {
    if (!this.repository) {
      throw new Error('TaskService not initialized with a repository');
    }
    const task = this.repository.getTaskById(id);
    if (!task) return undefined;

    const updated: Task = {
      ...task,
      ...input,
      updatedAt: new Date(),
    };
    this.repository.updateTask(id, updated);
    return updated;
  }

  deleteTask(id: string): boolean {
    if (!this.repository) {
      throw new Error('TaskService not initialized with a repository');
    }
    return this.repository.deleteTask(id);
  }

  // Comment operations
  getTaskComments(taskId: string): Comment[] {
    if (!this.repository) {
      throw new Error('TaskService not initialized with a repository');
    }
    return this.repository.getTaskComments(taskId);
  }

  addComment(taskId: string, input: CreateCommentInput): Comment | undefined {
    if (!this.repository) {
      throw new Error('TaskService not initialized with a repository');
    }
    const task = this.repository.getTaskById(taskId);
    if (!task) return undefined;

    const id = uuidv4();
    const comment: Comment = {
      id,
      taskId,
      ...input,
      createdAt: new Date(),
    };
    this.repository.addTaskComment(taskId, comment);
    return comment;
  }

  deleteComment(id: string): boolean {
    if (!this.repository) {
      throw new Error('TaskService not initialized with a repository');
    }
    // Find the taskId by checking all tasks' comments
    const allTasks = this.repository.getAllTasks();
    for (const task of allTasks) {
      const comments = this.repository.getTaskComments(task.id);
      if (comments.some(c => c.id === id)) {
        return this.repository.deleteTaskComment(task.id, id);
      }
    }
    return false;
  }
}

export default new TaskService();
