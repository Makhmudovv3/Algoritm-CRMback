const BaseController = require('./baseController');
const certificateService = require('../services/certificateService');
const { successResponse, errorResponse } = require('../utils/response');

class CertificateController extends BaseController {
  constructor() {
    super(certificateService, 'Certificate');
  }

  create = async (req, res) => {
    try {
      const data = { ...req.body };
      if (req.file) {
        data.fileUrl = `/uploads/${req.file.filename}`;
      }
      const record = await this.service.create(data);
      return successResponse(res, `Certificate created successfully`, record, {}, 201);
    } catch (error) {
      return errorResponse(res, `Failed to create certificate`, [error.message], 400);
    }
  };
}

module.exports = new CertificateController();
