'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Calls Table
    await queryInterface.createTable('Calls', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      call_sid: { type: Sequelize.STRING },
      caller_name: { type: Sequelize.STRING },
      phone: { type: Sequelize.STRING, allowNull: false },
      customer_id: { type: Sequelize.UUID },
      operator_id: { type: Sequelize.UUID },
      branch_id: { type: Sequelize.UUID },
      lead_id: { type: Sequelize.UUID },
      direction: { type: Sequelize.ENUM('incoming', 'outgoing'), allowNull: false },
      status: {
        type: Sequelize.ENUM('ringing', 'answered', 'busy', 'failed', 'missed', 'ended'),
        defaultValue: 'ringing'
      },
      duration: { type: Sequelize.INTEGER, defaultValue: 0 },
      started_at: { type: Sequelize.DATE },
      ended_at: { type: Sequelize.DATE },
      recording_url: { type: Sequelize.STRING },
      result: {
        type: Sequelize.ENUM('interested', 'not_interested', 'callback', 'converted', 'wrong_number', 'busy', 'no_answer')
      },
      notes: { type: Sequelize.TEXT },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

    // CallNotes Table
    await queryInterface.createTable('CallNotes', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      call_id: { type: Sequelize.UUID, allowNull: false },
      user_id: { type: Sequelize.UUID, allowNull: false },
      note: { type: Sequelize.TEXT, allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

    // AgentStatuses Table
    await queryInterface.createTable('AgentStatuses', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      user_id: { type: Sequelize.UUID, allowNull: false, unique: true },
      status: {
        type: Sequelize.ENUM('available', 'busy', 'break', 'offline'),
        defaultValue: 'offline'
      },
      last_activity: { type: Sequelize.DATE, defaultValue: Sequelize.fn('now') },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

    // FollowUps Table
    await queryInterface.createTable('FollowUps', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      call_id: { type: Sequelize.UUID },
      customer_id: { type: Sequelize.UUID },
      assigned_to: { type: Sequelize.UUID, allowNull: false },
      follow_up_date: { type: Sequelize.DATE, allowNull: false },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'cancelled'),
        defaultValue: 'pending'
      },
      notes: { type: Sequelize.TEXT },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('FollowUps');
    await queryInterface.dropTable('AgentStatuses');
    await queryInterface.dropTable('CallNotes');
    await queryInterface.dropTable('Calls');
  }
};
