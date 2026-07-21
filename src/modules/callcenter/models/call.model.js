'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Call extends Model {
    static associate(models) {
      if (models.User) {
        Call.belongsTo(models.User, { foreignKey: 'operator_id', as: 'operator' });
      }
      if (models.Branch) {
        Call.belongsTo(models.Branch, { foreignKey: 'branch_id', as: 'branch' });
      }
      if (models.Student) {
        Call.belongsTo(models.Student, { foreignKey: 'customer_id', as: 'customer' });
      }
      if (models.Lead) {
        Call.belongsTo(models.Lead, { foreignKey: 'lead_id', as: 'lead' });
      }
      
      // We will define these associations in the respective models as well
      Call.hasMany(models.CallNote, { foreignKey: 'call_id', as: 'notes_list' });
      Call.hasOne(models.FollowUp, { foreignKey: 'call_id', as: 'follow_up' });
    }
  }

  Call.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    call_sid: {
      type: DataTypes.STRING,
      allowNull: true
    },
    caller_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    customer_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    operator_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    branch_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    lead_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    direction: {
      type: DataTypes.ENUM('incoming', 'outgoing'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('ringing', 'answered', 'busy', 'failed', 'missed', 'ended'),
      defaultValue: 'ringing'
    },
    duration: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    started_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ended_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    recording_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    result: {
      type: DataTypes.ENUM('interested', 'not_interested', 'callback', 'converted', 'wrong_number', 'busy', 'no_answer'),
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Call',
    tableName: 'Calls',
    timestamps: true,
  });

  return Call;
};
