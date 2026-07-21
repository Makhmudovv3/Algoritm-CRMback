const { body, validationResult } = require('express-validator');
const { errorResponse } = require('../../../utils/response');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 'Validation Error', errors.array().map(e => e.msg), 400);
  }
  next();
};

const createCallValidator = [
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('direction').isIn(['incoming', 'outgoing']).withMessage('Invalid direction'),
  validate
];

const updateCallValidator = [
  body('status').optional().isIn(['ringing', 'answered', 'busy', 'failed', 'missed', 'ended']).withMessage('Invalid status'),
  validate
];

const createCallNoteValidator = [
  body('call_id').isUUID().withMessage('Valid call_id is required'),
  body('user_id').isUUID().withMessage('Valid user_id is required'),
  body('note').notEmpty().withMessage('Note content is required'),
  validate
];

const createFollowUpValidator = [
  body('assigned_to').isUUID().withMessage('assigned_to must be a valid UUID'),
  body('follow_up_date').isISO8601().withMessage('Valid follow_up_date is required'),
  validate
];

const updateAgentStatusValidator = [
  body('status').isIn(['available', 'busy', 'break', 'offline']).withMessage('Invalid status'),
  validate
];

module.exports = {
  createCallValidator,
  updateCallValidator,
  createCallNoteValidator,
  createFollowUpValidator,
  updateAgentStatusValidator
};
