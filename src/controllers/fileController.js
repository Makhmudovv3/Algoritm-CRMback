class FileController {
  async getAll(req, res) { return res.status(200).json({ success: true, message: 'Not Implemented' }); }
  async getById(req, res) { return res.status(200).json({ success: true, message: 'Not Implemented' }); }
  async create(req, res) { return res.status(201).json({ success: true, message: 'Not Implemented' }); }
  async update(req, res) { return res.status(200).json({ success: true, message: 'Not Implemented' }); }
  async delete(req, res) { return res.status(200).json({ success: true, message: 'Not Implemented' }); }
}
module.exports = new FileController();
