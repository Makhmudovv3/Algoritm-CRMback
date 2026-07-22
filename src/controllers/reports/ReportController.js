
exports.generateReport = async (req, res) => {
  res.json({ success: true, url: '/reports/export-123.pdf' });
};
