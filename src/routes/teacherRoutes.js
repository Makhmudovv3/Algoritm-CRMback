const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Apply auth to all routes
router.use(verifyToken);

// ⚠️ IMPORTANT: Specific routes MUST come before /:id to avoid param conflicts

// Dashboard Stats (no :id param)
router.get('/dashboard/stats', teacherController.getDashboardStats);
router.get('/dashboard/schedule', teacherController.getDashboardSchedule);
router.get('/dashboard/tasks', teacherController.getDashboardTasks);
router.get('/dashboard/activity', teacherController.getDashboardActivity);
router.get('/dashboard/alerts', teacherController.getDashboardAlerts);

// Group Workspace routes (specific paths before /:id)
router.get('/groups/:groupId/overview', teacherController.getGroupOverview);
router.get('/groups/:groupId/students', teacherController.getStudents);
router.get('/groups/:groupId/lessons', teacherController.getLessons);
router.get('/groups/:groupId/homeworks', teacherController.getHomeworks);
router.get('/groups/:groupId/tests', teacherController.getTests);
router.get('/groups/:groupId/materials', teacherController.getMaterials);
router.post('/groups/:groupId/materials', teacherController.uploadMaterial);
router.delete('/groups/:groupId/materials/:materialId', teacherController.deleteMaterial);
router.get('/groups/:groupId/gradebook', teacherController.getGradebook);
router.put('/groups/:groupId/gradebook/:studentId/:assessmentId', teacherController.updateGrade);
router.get('/groups/:groupId/analytics', teacherController.getAnalytics);
router.get('/groups/:groupId/insights', teacherController.getAiInsights);

// Homework & Test routes
router.post('/groups/:groupId/lessons/:lessonId/attendance', teacherController.saveAttendanceSession);
router.get('/homeworks/:homeworkId/submissions', teacherController.getHomeworkSubmissions);
router.post('/homeworks/:homeworkId/submissions/:studentId/grade', teacherController.gradeHomeworkSubmission);
router.get('/tests/:testId/attempts', teacherController.getTestAttempts);

// CRUD for teachers (/:id must be LAST)
router.get('/', teacherController.getAll);
router.post('/', teacherController.create);
router.get('/:id', teacherController.getById);
router.put('/:id', teacherController.update);
router.delete('/:id', teacherController.delete);

module.exports = router;
