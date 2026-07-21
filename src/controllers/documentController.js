const BaseController = require('./baseController');
const documentService = require('../services/documentService');
const { successResponse, errorResponse } = require('../utils/response');

class DocumentController extends BaseController {
  constructor() {
    super(documentService, 'Document');
  }

  create = async (req, res) => {
    try {
      const data = { ...req.body };
      if (req.file) {
        data.fileUrl = `/uploads/${req.file.filename}`;
      }
      const record = await this.service.create(data, req.user?.id, req.ip);
      return successResponse(res, `Document created successfully`, record, {}, 201);
    } catch (error) {
      return errorResponse(res, `Failed to create document`, [error.message], 400);
    }
  };

  delete = async (req, res) => {
    try {
      const document = await this.service.getById(req.params.id);
      if (document && document.fileUrl) {
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(__dirname, '../..', document.fileUrl);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      await this.service.delete(req.params.id, req.user?.id, req.ip);
      return successResponse(res, `Document deleted successfully`);
    } catch (error) {
      return errorResponse(res, `Failed to delete document`, [error.message], 400);
    }
  };
}

module.exports = new DocumentController();
