const BaseRepository = require('../../../repositories/baseRepository');
const { Call } = require('../../../models');

class CallRepository extends BaseRepository {
  constructor() {
    super(Call);
  }
}

module.exports = new CallRepository();
