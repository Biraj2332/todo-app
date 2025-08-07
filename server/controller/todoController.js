import { db } from "../config/connectDB.js";

export const addTask = async (req, res) => {
  try {
    const { id, title, date, time, completed } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const [result] = await db.query(
      'INSERT INTO tasks (id, title, date, time, completed) VALUES (?, ?, ?, ?, ?)',
      [id, title, date || null, time || null, completed || false]
    );
    
    res.status(201).json({ 
      message: 'Task added successfully',
      task: { id, title, date, time, completed }
    });
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Failed to add task' });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const [tasks] = await db.query(`
      SELECT id, title, date, time, completed 
      FROM tasks 
      ORDER BY created_at DESC
    `);
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM tasks WHERE id = ?', [id]);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, time, completed } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required' });
    }

    await db.query(
      'UPDATE tasks SET title = ?, date = ?, time = ?, completed = ? WHERE id = ?',
      [title, date || null, time || null, completed, id]
    );
    
    res.status(200).json({ 
      message: 'Task updated successfully',
      task: { id, title, date, time, completed }
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

