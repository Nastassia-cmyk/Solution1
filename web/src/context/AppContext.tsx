import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { Task, Comment } from '../types';
import { api } from '../services/api';

interface AppContextType {
  tasks: Task[];
  comments: Map<string, Comment[]>;
  loadTasks: () => Promise<void>;
  addTask: (data: { title: string; description: string; assignee?: number }) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  loadComments: (taskId: string) => Promise<void>;
  addComment: (taskId: string, data: { author: number; text: string }) => Promise<void>;
  deleteComment: (taskId: string, commentId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [comments, setComments] = useState<Map<string, Comment[]>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.tasks.getAll();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = useCallback(async (data: { title: string; description: string; assignee?: number }) => {
    setLoading(true);
    setError(null);
    try {
      const newTask = await api.tasks.create(data);
      setTasks(prev => [...prev, newTask]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (id: string, data: Partial<Task>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await api.tasks.update(id, data);
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.tasks.delete(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      const newComments = new Map(comments);
      newComments.delete(id);
      setComments(newComments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [comments]);

  const loadComments = useCallback(async (taskId: string) => {
    setError(null);
    try {
      const data = await api.comments.getByTaskId(taskId);
      setComments(prev => new Map(prev).set(taskId, data));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }, []);

  const addComment = useCallback(async (taskId: string, data: { author: number; text: string }) => {
    setError(null);
    try {
      const newComment = await api.comments.create(taskId, data);
      setComments(prev => {
        const newComments = new Map(prev);
        const taskComments = newComments.get(taskId) || [];
        newComments.set(taskId, [...taskComments, newComment]);
        return newComments;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }, []);

  const deleteComment = useCallback(async (taskId: string, commentId: string) => {
    setError(null);
    try {
      await api.comments.delete(commentId);
      setComments(prev => {
        const newComments = new Map(prev);
        const taskComments = newComments.get(taskId) || [];
        newComments.set(taskId, taskComments.filter(c => c.id !== commentId));
        return newComments;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        tasks,
        comments,
        loadTasks,
        addTask,
        updateTask,
        deleteTask,
        loadComments,
        addComment,
        deleteComment,
        loading,
        error,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
