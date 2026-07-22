const fs = require('fs');
const path = require('path');

const srcDir = 'c:/Users/user/Desktop/AlgortmCRM/backend/src';

const modelName = 'GroupAnnouncement';
const tableName = 'GroupAnnouncements';
const camelCase = 'groupAnnouncement';
const routeBase = 'group_announcements';

// 1. Model
const modelContent = `'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class GroupAnnouncement extends Model {
    static associate(models) {
      GroupAnnouncement.belongsTo(models.Group, { foreignKey: 'groupId', as: 'group' });
    }
  }
  GroupAnnouncement.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    groupId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    }
  }, {
    sequelize,
    modelName: 'GroupAnnouncement',
    tableName: 'GroupAnnouncements',
    timestamps: true,
    paranoid: true,
  });
  return GroupAnnouncement;
};
`;
fs.writeFileSync(path.join(srcDir, 'models', 'groupAnnouncement.js'), modelContent);

// 2. Repository
const repoContent = `const BaseRepository = require('./baseRepository');
const { GroupAnnouncement } = require('../models');

class GroupAnnouncementRepository extends BaseRepository {
  constructor() {
    super(GroupAnnouncement);
  }
}

module.exports = new GroupAnnouncementRepository();
`;
fs.writeFileSync(path.join(srcDir, 'repositories', 'groupAnnouncementRepository.js'), repoContent);

// 3. Service
const serviceContent = `const BaseService = require('./baseService');
const groupAnnouncementRepository = require('../repositories/groupAnnouncementRepository');

class GroupAnnouncementService extends BaseService {
  constructor() {
    super(groupAnnouncementRepository, ['title', 'message']);
  }
}

module.exports = new GroupAnnouncementService();
`;
fs.writeFileSync(path.join(srcDir, 'services', 'groupAnnouncementService.js'), serviceContent);

// 4. Controller
const controllerContent = `const BaseController = require('./baseController');
const groupAnnouncementService = require('../services/groupAnnouncementService');

class GroupAnnouncementController extends BaseController {
  constructor() {
    super(groupAnnouncementService, 'GroupAnnouncement');
  }
}

module.exports = new GroupAnnouncementController();
`;
fs.writeFileSync(path.join(srcDir, 'controllers', 'groupAnnouncementController.js'), controllerContent);

// 5. Route
const routeContent = `const express = require('express');
const router = express.Router();
const groupAnnouncementController = require('../controllers/groupAnnouncementController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.use(verifyToken);

router.get('/', groupAnnouncementController.getAll);
router.get('/:id', groupAnnouncementController.getById);
router.post('/', groupAnnouncementController.create);
router.put('/:id', groupAnnouncementController.update);
router.delete('/:id', groupAnnouncementController.delete);

module.exports = router;
`;
fs.writeFileSync(path.join(srcDir, 'routes', 'groupAnnouncementRoutes.js'), routeContent);

console.log('Successfully created GroupAnnouncement CRUD!');
