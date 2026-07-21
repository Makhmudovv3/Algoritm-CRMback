const BaseController = require('./baseController');
const lessonService = require('../services/lessonService');

class LessonController extends BaseController {
  constructor() {
    super(lessonService, 'Lesson');
  }
}

module.exports = new LessonController();
