import { Task, Comment } from '../types';

const API_BASE = '/api';

export const api = {
  tasks: {
    getAll: async (): Promise<Task[]> => {
      const res = await fetch(`${API_BASE}/tasks`);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      return res.json();
    },
    getById: async (id: string): Promise<Task> => {
      const res = await fetch(`${API_BASE}/tasks/${id}`);
      if (!res.ok) throw new Error('Failed to fetch task');
      return res.json();
    },
    create: async (data: { title: string; description: string; assignee?: string }): Promise<Task> => {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create task');
      return res.json();
    },
    update: async (id: string, data: Partial<Task>): Promise<Task> => {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update task');
      return res.json();
    },
    delete: async (id: string): Promise<void> => {
      const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete task');
    },
  },
  comments: {
    getByTaskId: async (taskId: string): Promise<Comment[]> => {
      const res = await fetch(`${API_BASE}/tasks/${taskId}/comments`);
      if (!res.ok) throw new Error('Failed to fetch comments');
      return res.json();
    },
    create: async (taskId: string, data: { author: string; text: string }): Promise<Comment> => {
      const res = await fetch(`${API_BASE}/tasks/${taskId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create comment');
      return res.json();
    },
    delete: async (commentId: string): Promise<void> => {
      const res = await fetch(`${API_BASE}/tasks/comments/${commentId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete comment');
    },
  },
};
