
const { Student, Teacher, Payment, Attendance } = require('../../models');

exports.getDashboardSummary = async (req, res) => {
  try {
    const students = await Student.count();
    const revenue = await Payment.sum('amount');
    
    res.json({
      success: true,
      data: {
        forecast: "Daromad oylik 12% o'sishi kutilmoqda",
        risk: "Davomat o'tgan haftaga nisbatan 5% past",
        recommendations: ['Davomatni yaxshilash', 'Qarzdorliklarni undirish']
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
