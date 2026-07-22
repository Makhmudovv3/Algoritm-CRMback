const { Student, Group, Teacher, Payment, Attendance } = require('../../models');
const aiService = require('../../services/aiService');
const { successResponse, errorResponse } = require('../../utils/response');

class AiController {
  async getDashboardSummary(req, res, next) {
    try {
      const stats = {
        studentsCount: await Student.count(),
        groupsCount: await Group.count(),
        teachersCount: await Teacher.count(),
      };
      const summary = await aiService.getDashboardSummary(stats);
      return successResponse(res, 'AI Summary', { summary });
    } catch (error) {
      next(error);
    }
  }

  async analyzeFinance(req, res, next) {
    try {
      const payments = await Payment.findAll({ limit: 100, order: [['createdAt', 'DESC']] });
      const analysis = await aiService.predictRevenue(payments);
      return successResponse(res, 'Finance Analysis', analysis);
    } catch (error) {
      next(error);
    }
  }

  async predictStudentDropRisk(req, res, next) {
    try {
      const students = await Student.findAll({ limit: 50 });
      const attendance = await Attendance.findAll({ limit: 200 });
      const riskAnalysis = await aiService.analyzeStudentDropRisk(students, attendance);
      return successResponse(res, 'Drop Risk Analysis', riskAnalysis);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res) { return res.status(200).json({ success: true, message: 'Not Implemented' }); }
  async getById(req, res) { return res.status(200).json({ success: true, message: 'Not Implemented' }); }
  async create(req, res) { return res.status(201).json({ success: true, message: 'Not Implemented' }); }
  async update(req, res) { return res.status(200).json({ success: true, message: 'Not Implemented' }); }
  async delete(req, res) { return res.status(200).json({ success: true, message: 'Not Implemented' }); }
}

module.exports = new AiController();
