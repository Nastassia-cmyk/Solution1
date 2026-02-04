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
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  taskId: string;
  author: number; // User ID
  text: string;
  createdAt: string;
}

export interface AdminSettings {
  taskRepo: RepositoryType;
  users: User[];
}
