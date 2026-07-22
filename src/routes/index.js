const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const branchRoutes = require('./branchRoutes');
const roomRoutes = require('./roomRoutes');
const courseRoutes = require('./courseRoutes');
const teacherRoutes = require('./teacherRoutes');
const parentRoutes = require('./parentRoutes');
const studentRoutes = require('./studentRoutes');
const leadRoutes = require('./leadRoutes');
const groupRoutes = require('./groupRoutes');
const userRoutes = require('./userRoutes');
const roleRoutes = require('./roleRoutes');

const scheduleRoutes = require('./scheduleRoutes');
const lessonRoutes = require('./lessonRoutes');
const attendanceRoutes = require('./attendanceRoutes');

const invoiceRoutes = require('./invoiceRoutes');
const paymentRoutes = require('./paymentRoutes');
const discountRoutes = require('./discountRoutes');
const grantRoutes = require('./grantRoutes');

const documentRoutes = require('./documentRoutes');
const messageRoutes = require('./messageRoutes');
const notificationRoutes = require('./notificationRoutes');
const certificateRoutes = require('./certificateRoutes');
const eventRoutes = require('./eventRoutes');
const taskRoutes = require('./taskRoutes');
const searchRoutes = require('./searchRoutes');
const dashboardRoutes = require('./dashboardRoutes');

const callcenterRoutes = require('../modules/callcenter/routes');
const settingsRoutes = require('./settings');
const aiRoutes = require('./aiRoutes');

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/search', searchRoutes);
router.use('/branches', branchRoutes);
router.use('/rooms', roomRoutes);
router.use('/courses', courseRoutes);
router.use('/teachers', teacherRoutes);
router.use('/parents', parentRoutes);
router.use('/students', studentRoutes);
router.use('/leads', leadRoutes);
router.use('/groups', groupRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/lessons', lessonRoutes);
router.use('/attendances', attendanceRoutes);
router.use('/events', eventRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/payments', paymentRoutes);
router.use('/discounts', discountRoutes);
router.use('/grants', grantRoutes);
router.use('/documents', documentRoutes);
router.use('/messages', messageRoutes);
router.use('/notifications', notificationRoutes);
router.use('/certificates', certificateRoutes);
router.use('/tasks', taskRoutes);
router.use('/teacher', teacherRoutes);

router.use('/', callcenterRoutes);

router.use('/settings', settingsRoutes);
router.use('/ai', aiRoutes);

const auditRoutes = require('./auditRoutes');
const callLogRoutes = require('./callLogRoutes');
const financeAccountRoutes = require('./financeAccountRoutes');
const pendingPaymentRoutes = require('./pendingPaymentRoutes');
const paymentRequestRoutes = require('./paymentRequestRoutes');
const paymentRequestLogRoutes = require('./paymentRequestLogRoutes');
const shiftRoutes = require('./shiftRoutes');
const dailyClosingRoutes = require('./dailyClosingRoutes');
const permissionRoutes = require('./permissionRoutes');
const studentGroupRoutes = require('./studentGroupRoutes');
const ratingRoutes = require('./ratingRoutes');
const studentNoteRoutes = require('./studentNoteRoutes');

router.use('/audit_logs', auditRoutes);
router.use('/call_logs', callLogRoutes);
router.use('/finance_accounts', financeAccountRoutes);
router.use('/pending_payments', pendingPaymentRoutes);
router.use('/payment_requests', paymentRequestRoutes);
router.use('/payment_request_logs', paymentRequestLogRoutes);
router.use('/shifts', shiftRoutes);
router.use('/daily_closings', dailyClosingRoutes);
router.use('/permissions', permissionRoutes);
router.use('/student_groups', studentGroupRoutes);
router.use('/ratings', ratingRoutes);
router.use('/student_notes', studentNoteRoutes);

module.exports = router;
