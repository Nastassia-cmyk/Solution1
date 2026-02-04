export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type RepositoryType = 'memory' | 'json';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  taskId: string;
  author: string;
  text: string;
  createdAt: Date;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  assignee?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  assignee?: string;
}

export interface CreateCommentInput {
  author: string;
  text: string;
}

export interface AdminSettings {
  taskRepo: RepositoryType;
}
