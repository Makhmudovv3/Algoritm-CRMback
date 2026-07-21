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

  delete = async (req, res) => {
    try {
      const certificate = await this.service.getById(req.params.id);
      if (certificate && certificate.fileUrl) {
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(__dirname, '../..', certificate.fileUrl);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      await this.service.delete(req.params.id, req.user?.id, req.ip);
      return successResponse(res, `Certificate deleted successfully`);
    } catch (error) {
      return errorResponse(res, `Failed to delete certificate`, [error.message], 400);
    }
  };
}

module.exports = new CertificateController();
