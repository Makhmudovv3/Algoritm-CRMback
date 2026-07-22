const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { auth } = require('../middlewares/authMiddleware'); // assuming we have auth
// const { checkRole } = require('../middlewares/roleMiddleware');

// Note: apply auth and role middleware later to secure these endpoints
// router.use(auth, checkRole(['TEACHER', 'SUPER_ADMIN']));

// CRUD for teachers
router.get('/', teacherController.getAll);
router.get('/:id', teacherController.getById);
router.post('/', teacherController.create);
router.put('/:id', teacherController.update);
router.delete('/:id', teacherController.delete);

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
router.post('/groups/:groupId/materials', teacherController.uploadMaterial);
router.delete('/groups/:groupId/materials/:materialId', teacherController.deleteMaterial);

// Group Workspace Gradebook
router.get('/groups/:groupId/gradebook', teacherController.getGradebook);
router.put('/groups/:groupId/gradebook/:studentId/:assessmentId', teacherController.updateGrade);

// Additional endpoints matching frontend requests
router.post('/groups/:groupId/lessons/:lessonId/attendance', teacherController.saveAttendanceSession);
router.get('/homeworks/:homeworkId/submissions', teacherController.getHomeworkSubmissions);
router.post('/homeworks/:homeworkId/submissions/:studentId/grade', teacherController.gradeHomeworkSubmission);
router.get('/tests/:testId/attempts', teacherController.getTestAttempts);
router.get('/groups/:groupId/analytics', teacherController.getAnalytics);
router.get('/groups/:groupId/insights', teacherController.getAiInsights);

module.exports = router;
