import express from 'express';
import { addTask, getAllTasks, deleteTask, updateTask } from '../controller/todoController.js';

const router = express.Router();

router.post('/tasks', addTask);
router.get('/tasks', getAllTasks);
router.delete('/tasks/:id', deleteTask);
router.put('/tasks/:id', updateTask);

export default router;