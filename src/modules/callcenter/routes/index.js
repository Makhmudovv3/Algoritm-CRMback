const express = require('express');
const router = express.Router();

const callRoutes = require('./call.routes');
const callNoteRoutes = require('./callNote.routes');
const agentStatusRoutes = require('./agentStatus.routes');
const followUpRoutes = require('./followUp.routes');
const analyticsRoutes = require('./analytics.routes');

router.use('/calls', callRoutes);
router.use('/call-notes', callNoteRoutes);
router.use('/agent-status', agentStatusRoutes);
router.use('/follow-ups', followUpRoutes);
router.use('/call-analytics', analyticsRoutes);

module.exports = router;
