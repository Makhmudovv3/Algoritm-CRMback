const { Student, Teacher, Parent, Group, Course, Payment, Invoice } = require('../models');

class DashboardService {
  async getStats(user = null) {
    const whereClause = {};
    if (user && (user.role === 'Manager' || user.role === 'BRANCH_MANAGER') && user.branchId) {
      whereClause.branchId = user.branchId;
    }

    const [totalStudents, totalTeachers, totalGroups, totalCourses, totalRevenue] = await Promise.all([
      Student.count({ where: whereClause }),
      Teacher.count({ where: whereClause }),
      Group.count({ where: whereClause }),
      Course.count(),
      Payment.sum('amount', { where: { status: 'SUCCESS' } })
    ]);

    // get recent activities
    const { AuditLog, User } = require('../models');
    const auditInclude = ['user'];
    
    // If we have a branch filter, we should ideally filter AuditLog by User's branchId,
    // but for now we'll just omit the where clause to avoid the crash, or do it via include:
    const recentActivities = await AuditLog.findAll({
      order: [['createdAt', 'DESC']],
      limit: 10,
      include: user && user.branchId && (user.role === 'Manager' || user.role === 'BRANCH_MANAGER')
        ? [{ association: 'user', where: { branchId: user.branchId } }]
        : ['user']
    });

    return {
      stats: {
        totalStudents,
        totalTeachers,
        totalGroups,
        totalCourses,
        totalRevenue: totalRevenue || 0
      },
      recentActivities
    };
  }
}

module.exports = new DashboardService();
