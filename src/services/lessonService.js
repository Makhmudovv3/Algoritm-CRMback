const BaseService = require('./baseService');
const lessonRepository = require('../repositories/lessonRepository');

class LessonService extends BaseService {
  constructor() {
    super(lessonRepository, []); // no default text search for these yet
  }
}

module.exports = new LessonService();
