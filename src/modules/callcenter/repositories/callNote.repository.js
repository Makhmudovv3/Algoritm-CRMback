const BaseRepository = require('../../../repositories/baseRepository');
const { CallNote } = require('../../../models');

class CallNoteRepository extends BaseRepository {
  constructor() {
    super(CallNote);
  }
}

module.exports = new CallNoteRepository();
