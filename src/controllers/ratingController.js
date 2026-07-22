const BaseController = require('./baseController');
const ratingService = require('../services/ratingService');

class RatingController extends BaseController {
  constructor() {
    super(ratingService, 'Rating');
  }
}

module.exports = new RatingController();
