const { Op } = require('sequelize');
const { Student, Teacher, Parent, User, Course, Group } = require('../models');

class SearchService {
  async globalSearch(query) {
    const q = query.q || '';
    if (!q) return { students: [], teachers: [], parents: [], users: [], courses: [], groups: [] };
    
    const [students, teachers, parents, users, courses, groups] = await Promise.all([
      Student.findAll({
        include: [{ model: User, as: 'user', where: { [Op.or]: [{ firstName: { [Op.iLike]: `%${q}%` } }, { lastName: { [Op.iLike]: `%${q}%` } }, { phone: { [Op.iLike]: `%${q}%` } }] } }],
        limit: 10
      }),
      Teacher.findAll({
        include: [{ model: User, as: 'user', where: { [Op.or]: [{ firstName: { [Op.iLike]: `%${q}%` } }, { lastName: { [Op.iLike]: `%${q}%` } }, { phone: { [Op.iLike]: `%${q}%` } }] } }],
        limit: 10
      }),
      Parent.findAll({
        include: [{ model: User, as: 'user', where: { [Op.or]: [{ firstName: { [Op.iLike]: `%${q}%` } }, { lastName: { [Op.iLike]: `%${q}%` } }, { phone: { [Op.iLike]: `%${q}%` } }] } }],
        limit: 10
      }),
      User.findAll({
        where: { [Op.or]: [{ firstName: { [Op.iLike]: `%${q}%` } }, { lastName: { [Op.iLike]: `%${q}%` } }, { phone: { [Op.iLike]: `%${q}%` } }, { email: { [Op.iLike]: `%${q}%` } }] },
        limit: 10
      }),
      Course.findAll({
        where: { [Op.or]: [{ name: { [Op.iLike]: `%${q}%` } }, { description: { [Op.iLike]: `%${q}%` } }] },
        limit: 10
      }),
      Group.findAll({
        where: { name: { [Op.iLike]: `%${q}%` } },
        limit: 10
      })
    ]);

    return { students, teachers, parents, users, courses, groups };
  }
}

module.exports = new SearchService();
