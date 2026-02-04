export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type RepositoryType = 'memory' | 'json';

export interface User {
  id: number;
  name: string;
  role: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee?: number; // User ID
  author?: number; // User ID
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  taskId: string;
  author: number; // User ID
  text: string;
  createdAt: Date;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  assignee?: number;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  assignee?: number;
}

export interface CreateCommentInput {
  author: number;
  text: string;
}

export interface AdminSettings {
  taskRepo: RepositoryType;
  users: User[];
}
