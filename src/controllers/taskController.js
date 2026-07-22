const { Task, User } = require('../models');

class TaskController {
  async getAll(req, res) {
    try {
      const tasks = await Task.findAll({
        where: { assignedTo: req.user.id },
        order: [['createdAt', 'DESC']]
      });
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tasks', details: error.message });
    }
  }

  async getById(req, res) {
    try {
      const task = await Task.findOne({ where: { id: req.params.id, assignedTo: req.user.id } });
      if (!task) return res.status(404).json({ error: 'Task not found' });
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch task', details: error.message });
    }
  }

  async create(req, res) {
    try {
      const { title, dueDate, assignedTo } = req.body;
      const task = await Task.create({
        title,
        dueDate,
        assignedTo: assignedTo || req.user.id,
        createdBy: req.user.id,
        completed: false
      });
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create task', details: error.message });
    }
  }

  async update(req, res) {
    try {
      const task = await Task.findOne({ where: { id: req.params.id, assignedTo: req.user.id } });
      if (!task) return res.status(404).json({ error: 'Task not found' });
      
      const { title, dueDate, assignedTo, completed } = req.body;
      if (title !== undefined) task.title = title;
      if (dueDate !== undefined) task.dueDate = dueDate;
      if (assignedTo !== undefined) task.assignedTo = assignedTo;
      if (completed !== undefined) task.completed = completed;
      
      await task.save();
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update task', details: error.message });
    }
  }

  async toggleTask(req, res) {
    try {
      const task = await Task.findOne({ where: { id: req.params.id, assignedTo: req.user.id } });
      if (!task) return res.status(404).json({ error: 'Task not found' });
      
      task.completed = !task.completed;
      await task.save();
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: 'Failed to toggle task', details: error.message });
    }
  }

  async delete(req, res) {
    try {
      const task = await Task.findOne({ where: { id: req.params.id, assignedTo: req.user.id } });
      if (!task) return res.status(404).json({ error: 'Task not found' });
      
      await task.destroy();
      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete task', details: error.message });
    }
  }
}

module.exports = new TaskController();
