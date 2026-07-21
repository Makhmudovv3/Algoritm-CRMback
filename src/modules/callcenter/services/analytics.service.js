const { Call, User, Sequelize } = require('../../../models');
const { Op } = Sequelize;

class AnalyticsService {
  async getDashboardStats(filters = {}) {
    const { branch_id, dateFrom, dateTo } = filters;
    
    let whereClause = {};
    if (branch_id) whereClause.branch_id = branch_id;
    if (dateFrom || dateTo) {
      whereClause.createdAt = {};
      if (dateFrom) whereClause.createdAt[Op.gte] = new Date(dateFrom);
      if (dateTo) whereClause.createdAt[Op.lte] = new Date(dateTo);
    }

    const totalCalls = await Call.count({ where: whereClause });
    const incoming = await Call.count({ where: { ...whereClause, direction: 'incoming' } });
    const outgoing = await Call.count({ where: { ...whereClause, direction: 'outgoing' } });
    const answered = await Call.count({ where: { ...whereClause, status: 'answered' } });
    const missed = await Call.count({ where: { ...whereClause, status: 'missed' } });
    const busy = await Call.count({ where: { ...whereClause, status: 'busy' } });

    const avgDurationRow = await Call.findOne({
      where: { ...whereClause, status: 'answered' },
      attributes: [[Sequelize.fn('avg', Sequelize.col('duration')), 'avgDuration']],
      raw: true
    });
    const avgDuration = avgDurationRow?.avgDuration ? parseInt(avgDurationRow.avgDuration, 10) : 0;

    const converted = await Call.count({ where: { ...whereClause, result: 'converted' } });
    const conversionRate = totalCalls > 0 ? ((converted / totalCalls) * 100).toFixed(2) : 0;

    // Top Operators — use table-qualified col to avoid ambiguous 'id' error
    const topOperators = await Call.findAll({
      where: whereClause,
      attributes: [
        'operator_id',
        [Sequelize.fn('count', Sequelize.col('Call.id')), 'calls_count'],
        [Sequelize.fn('sum', Sequelize.col('Call.duration')), 'total_duration']
      ],
      include: [{ model: User, as: 'operator', attributes: ['id', 'firstName', 'lastName'] }],
      group: ['Call.operator_id', 'operator.id', 'operator.firstName', 'operator.lastName'],
      order: [[Sequelize.literal('calls_count'), 'DESC']],
      limit: 5
    });

    return {
      totalCalls,
      incoming,
      outgoing,
      answered,
      missed,
      busy,
      avgDuration,
      conversionRate,
      topOperators
    };
  }
}

module.exports = new AnalyticsService();
