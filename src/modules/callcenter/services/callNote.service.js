const BaseService = require('../../../services/baseService');
const callNoteRepository = require('../repositories/callNote.repository');

class CallNoteService extends BaseService {
  constructor() {
    super(callNoteRepository, ['note']);
  }
}

module.exports = new CallNoteService();
