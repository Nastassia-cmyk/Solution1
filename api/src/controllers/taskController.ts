import { Request, Response } from 'express';
import taskService from '../services/TaskService';
import { CreateTaskInput, UpdateTaskInput, CreateCommentInput } from '../types';

export const getAllTasks = (req: Request, res: Response) => {
  try {
    const tasks = taskService.getAllTasks();
    res.json(tasks);
  } catch (error) {
    console.error('[TaskController] getAllTasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const getTaskById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = taskService.getTaskById(id);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json(task);
  } catch (error) {
    console.error('[TaskController] getTaskById error:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

export const createTask = (req: Request, res: Response) => {
  try {
    const { title, description, assignee } = req.body;
    if (!title || !description) {
      res.status(400).json({ error: 'Title and description are required' });
      return;
    }
    const task = taskService.createTask({ title, description, assignee });
    res.status(201).json(task);
  } catch (error) {
    console.error('[TaskController] createTask error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const updateTask = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = taskService.updateTask(id, req.body);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json(task);
  } catch (error) {
    console.error('[TaskController] updateTask error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

export const deleteTask = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = taskService.deleteTask(id);
    if (!success) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('[TaskController] deleteTask error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

export const getTaskComments = (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const task = taskService.getTaskById(taskId);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    const comments = taskService.getTaskComments(taskId);
    res.json(comments);
  } catch (error) {
    console.error('[TaskController] getTaskComments error:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

export const addComment = (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const { author, text } = req.body;
    if (!author || !text) {
      res.status(400).json({ error: 'Author and text are required' });
      return;
    }
    const comment = taskService.addComment(taskId, { author, text });
    if (!comment) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.status(201).json(comment);
  } catch (error) {
    console.error('[TaskController] addComment error:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

export const deleteComment = (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const success = taskService.deleteComment(commentId);
    if (!success) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('[TaskController] deleteComment error:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};
