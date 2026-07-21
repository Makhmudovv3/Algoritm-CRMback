/**
 * @swagger
 * tags:
 *   name: CallCenter
 *   description: API endpoints for Call Center Module
 * 
 * /calls:
 *   get:
 *     summary: Retrieve a list of calls
 *     tags: [CallCenter]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of calls
 *   post:
 *     summary: Create a new call record
 *     tags: [CallCenter]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Call created
 * 
 * /call-notes:
 *   get:
 *     summary: Retrieve a list of call notes
 *     tags: [CallCenter]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of call notes
 * 
 * /call-analytics/dashboard:
 *   get:
 *     summary: Retrieve call center dashboard analytics
 *     tags: [CallCenter]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics including total calls, conversion rate, top operators, etc.
 * 
 * /agent-status:
 *   get:
 *     summary: Retrieve agent statuses
 *     tags: [CallCenter]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of agent statuses
 * 
 * /follow-ups:
 *   get:
 *     summary: Retrieve a list of follow-ups
 *     tags: [CallCenter]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of follow-ups
 */
