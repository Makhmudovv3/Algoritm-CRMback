const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { auth } = require('../middlewares/authMiddleware'); // assuming we have auth
// const { checkRole } = require('../middlewares/roleMiddleware');

// Note: apply auth and role middleware later to secure these endpoints
// router.use(auth, checkRole(['TEACHER', 'SUPER_ADMIN']));

// Get all teachers
router.get('/', teacherController.getAllTeachers);

// Dashboard Stats
router.get('/dashboard/stats', teacherController.getDashboardStats);
router.get('/dashboard/schedule', teacherController.getDashboardSchedule);
router.get('/dashboard/tasks', teacherController.getDashboardTasks);
router.get('/dashboard/activity', teacherController.getDashboardActivity);
router.get('/dashboard/alerts', teacherController.getDashboardAlerts);

// Group Workspace Overview
router.get('/groups/:groupId/overview', teacherController.getGroupOverview);

// Group Workspace Students
router.get('/groups/:groupId/students', teacherController.getStudents);

// Group Workspace Lessons
router.get('/groups/:groupId/lessons', teacherController.getLessons);

// Group Workspace Homeworks
router.get('/groups/:groupId/homeworks', teacherController.getHomeworks);

// Group Workspace Tests
router.get('/groups/:groupId/tests', teacherController.getTests);

// Group Workspace Materials
router.get('/groups/:groupId/materials', teacherController.getMaterials);

// Group Workspace Gradebook
router.get('/groups/:groupId/gradebook', teacherController.getGradebook);

module.exports = router;
