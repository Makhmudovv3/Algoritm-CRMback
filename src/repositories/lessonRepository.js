const BaseRepository = require('./baseRepository');
const { Lesson } = require('../models');

class LessonRepository extends BaseRepository {
  constructor() {
    super(Lesson);
  }
}

module.exports = new LessonRepository();
