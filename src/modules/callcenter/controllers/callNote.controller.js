const BaseController = require('../../../controllers/baseController');
const callNoteService = require('../services/callNote.service');

class CallNoteController extends BaseController {
  constructor() {
    super(callNoteService, 'CallNote');
  }
}

module.exports = new CallNoteController();
