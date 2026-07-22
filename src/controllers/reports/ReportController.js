const { Student, Group, Teacher, Payment, Invoice, Attendance, Course } = require('../../models');
const { successResponse } = require('../../utils/response');
const { Op } = require('sequelize');

class ReportController {
  async getGeneralReport(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      let dateFilter = {};
      if (startDate && endDate) {
        dateFilter = {
          createdAt: {
            [Op.between]: [new Date(startDate), new Date(endDate)]
          }
        };
      }

      const payments = await Payment.findAll({ where: dateFilter });
      const students = await Student.count({ where: dateFilter });
      const activeGroups = await Group.count();

      const totalRevenue = payments.reduce((sum, p) => sum + Number(p.sum || 0), 0);

      return successResponse(res, 'General Report', {
        totalRevenue,
        newStudents: students,
        activeGroups,
        paymentsCount: payments.length,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAttendanceReport(req, res, next) {
    try {
      const attendances = await Attendance.findAll({ limit: 500, order: [['date', 'DESC']] });
      const presentCount = attendances.filter(a => a.status === 'present').length;
      const absentCount = attendances.filter(a => a.status === 'absent').length;

      return successResponse(res, 'Attendance Report', {
        total: attendances.length,
        present: presentCount,
        absent: absentCount,
        rate: attendances.length > 0 ? (presentCount / attendances.length) * 100 : 0
      });
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

module.exports = new ReportController();
