import express, { Router } from 'express';
import * as taskController from '../controllers/taskController';

const router = Router();

// Task routes
router.get('/', taskController.getAllTasks);
router.post('/', taskController.createTask);
router.get('/:id', taskController.getTaskById);
router.patch('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

// Comment routes
router.get('/:taskId/comments', taskController.getTaskComments);
router.post('/:taskId/comments', taskController.addComment);
router.delete('/comments/:commentId', taskController.deleteComment);

export default router;
