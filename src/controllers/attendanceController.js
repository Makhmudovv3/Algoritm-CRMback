const BaseController = require('./baseController');
const attendanceService = require('../services/attendanceService');
const { successResponse, errorResponse } = require('../utils/response');

class AttendanceController extends BaseController {
  constructor() {
    super(attendanceService, 'Attendance');
  }

  recordBatch = async (req, res) => {
    try {
      const { lessonId, attendances } = req.body;
      const results = await attendanceService.recordAttendances(lessonId, attendances);
      return successResponse(res, 'Attendances recorded successfully', results);
    } catch (error) {
      return errorResponse(res, 'Failed to record attendances', [error.message], 400);
    }
  }
}

module.exports = new AttendanceController();
