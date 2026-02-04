export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type RepositoryType = 'memory' | 'json';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  taskId: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface AdminSettings {
  taskRepo: RepositoryType;
}
