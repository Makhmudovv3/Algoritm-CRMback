const BaseService = require('./baseService');
const { Rating } = require('../models');

class RatingService extends BaseService {
  constructor() {
    super(Rating);
  }
}

module.exports = new RatingService();
