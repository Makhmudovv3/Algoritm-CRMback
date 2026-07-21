const BaseService = require('./baseService');
const attendanceRepository = require('../repositories/attendanceRepository');
const { Attendance, Lesson, Student, sequelize } = require('../models');

class AttendanceService extends BaseService {
  constructor() {
    super(attendanceRepository, []); 
  }

  // Override create to use Transactions
  async recordAttendances(lessonId, attendancesArray) {
    const t = await sequelize.transaction();
    try {
      const results = [];
      for (const record of attendancesArray) {
        // Find existing or create
        const [att, created] = await Attendance.findOrCreate({
          where: { lessonId, studentId: record.studentId },
          defaults: { status: record.status, notes: record.notes },
          transaction: t
        });

        if (!created) {
          await att.update({ status: record.status, notes: record.notes }, { transaction: t });
        }
        results.push(att);
      }
      await t.commit();
      return results;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

module.exports = new AttendanceService();
