const { 
  Group, Course, Teacher, Student, Lesson, Attendance, Schedule, Room,
  Homework, HomeworkSubmission, Test, TestQuestion, TestAttempt, Material 
} = require('../models');
const { Op } = require('sequelize');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');
// AI Services can be imported here once available

class TeacherController {
  // ==========================================
  // Dashboard Widgets & Stats
  // ==========================================
  
  async getDashboardStats(req, res) {
    try {
      const teacherId = req.user?.teacherId || req.user?.id; // Assuming auth middleware sets this
      if (!teacherId) return errorResponse(res, 'Teacher ID missing', [], 400);

      // Find all active groups for this teacher
      const activeGroups = await Group.count({ where: { teacherId, status: 'active' } });
      
      // Get all students in these groups
      const groups = await Group.findAll({ where: { teacherId }, attributes: ['id'] });
      const groupIds = groups.map(g => g.id);
      
      const totalStudents = await Student.count({ where: { groupId: { [Op.in]: groupIds } } });
      
      // Today's lessons
      const today = new Date();
      today.setHours(0,0,0,0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const todayLessons = await Lesson.count({
        where: {
          groupId: { [Op.in]: groupIds },
          date: {
            [Op.gte]: today,
            [Op.lt]: tomorrow
          }
        }
      });

      const stats = {
        activeGroups: { value: activeGroups, trend: "Faol" },
        totalStudents: { value: totalStudents, trend: "Jami" },
        todayLessons: { value: todayLessons, trend: "Bugun" },
        attendanceRate: { value: 0, trend: "O'rtacha" },
        pendingHomework: { value: 0, trend: "Kutilmoqda" },
        pendingTests: { value: 0, trend: "Kutilmoqda" }
      };

      return successResponse(res, 'Dashboard stats', stats);
    } catch (err) {
      logger.error('Error in getDashboardStats:', err);
      return errorResponse(res, 'Internal Server Error', [err.message], 500);
    }
  }

  async getDashboardSchedule(req, res) {
    try {
      const teacherId = req.user?.teacherId || req.user?.id;
      if (!teacherId) return errorResponse(res, 'Teacher ID missing', [], 400);

      const today = new Date();
      today.setHours(0,0,0,0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const groups = await Group.findAll({ where: { teacherId }, attributes: ['id', 'name', 'courseId', 'roomId'] });
      const groupIds = groups.map(g => g.id);

      const lessons = await Lesson.findAll({
        where: {
          groupId: { [Op.in]: groupIds },
          date: { [Op.gte]: today, [Op.lt]: tomorrow }
        },
        order: [['startTime', 'ASC']]
      });

      const mapped = lessons.map(l => {
        const group = groups.find(g => g.id === l.groupId);
        return {
          id: l.id,
          time: l.startTime + ' - ' + l.endTime,
          groupName: group ? group.name : 'Noma\'lum',
          course: 'Noma\'lum', // Needs eager loading of Course
          room: 'Xona', // Needs eager loading of Room
          status: l.status || 'planned',
          topic: l.topic || 'Belgilanmagan'
        };
      });

      return successResponse(res, 'Today Schedule', mapped);
    } catch (err) {
      return errorResponse(res, 'Internal Server Error', [err.message], 500);
    }
  }

  async getDashboardTasks(req, res) {
    return successResponse(res, 'Dashboard Tasks', []);
  }

  async getDashboardActivity(req, res) {
    return successResponse(res, 'Dashboard Activity', []);
  }

  async getDashboardAlerts(req, res) {
    return successResponse(res, 'Dashboard Alerts', []);
  }

  // ==========================================
  // Group Workspace Overview
  // ==========================================
  
  async getGroupOverview(req, res) {
    try {
      const { groupId } = req.params;
      const group = await Group.findByPk(groupId, {
        include: [
          { model: Course, as: 'course' },
          { model: Teacher, as: 'teacher' },
          { model: Room, as: 'room' }
        ]
      });
      if (!group) return errorResponse(res, 'Group not found', [], 404);

      const studentsCount = await Student.count({ where: { groupId } });
      
      const data = {
        id: group.id,
        name: group.name,
        course: group.course?.name || '',
        teacher: group.teacher?.firstName + ' ' + group.teacher?.lastName,
        room: group.room?.name || '',
        studentsCount,
        capacity: group.capacity || 20,
        schedule: group.schedule || '',
        time: group.time || '',
        status: group.status || 'active',
        attendanceRate: 0,
        progressPercent: 0,
        nextLesson: null
      };
      
      return successResponse(res, 'Group overview', data);
    } catch (err) {
      logger.error('Error in getGroupOverview:', err);
      return errorResponse(res, 'Internal Server Error', [err.message], 500);
    }
  }

  // ==========================================
  // Students
  // ==========================================
  
  async getStudents(req, res) {
    try {
      const { groupId } = req.params;
      const students = await Student.findAll({ where: { groupId } });
      
      const mapped = students.map(s => ({
        id: s.id,
        fullname: s.firstName + ' ' + s.lastName,
        phone: s.phone,
        attendancePercent: 0, // Calculate from attendances later
        progressPercent: 0
      }));
      
      return successResponse(res, 'Students', mapped);
    } catch (err) {
      logger.error('Error in getStudents:', err);
      return errorResponse(res, 'Internal Server Error', [err.message], 500);
    }
  }

  // ==========================================
  // Lessons
  // ==========================================
  
  async getLessons(req, res) {
    try {
      const { groupId } = req.params;
      const lessons = await Lesson.findAll({ where: { groupId }, order: [['date', 'ASC']] });
      
      const mapped = lessons.map(l => ({
        id: l.id,
        date: l.date,
        time: l.startTime + ' - ' + l.endTime,
        topic: l.topic || 'Belgilanmagan',
        homework: l.homeworkDescription || '',
        status: l.status || 'planned'
      }));
      
      return successResponse(res, 'Lessons', mapped);
    } catch (err) {
      logger.error('Error in getLessons:', err);
      return errorResponse(res, 'Internal Server Error', [err.message], 500);
    }
  }

  // Additional stubs for Homeworks, Tests, Materials, etc.
  // These will be expanded as needed.
  async getHomeworks(req, res) {
    return successResponse(res, 'Homeworks', []);
  }
  async getTests(req, res) {
    return successResponse(res, 'Tests', []);
  }
  async getMaterials(req, res) {
    return successResponse(res, 'Materials', []);
  }
  async getAllTeachers(req, res) {
    try {
      const teachers = await Teacher.findAll();
      return successResponse(res, 'Teachers list', teachers);
    } catch (err) {
      logger.error('Error in getAllTeachers:', err);
      return successResponse(res, 'Teachers list', []);
    }
  }
}

module.exports = new TeacherController();
