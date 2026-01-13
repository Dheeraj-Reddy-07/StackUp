// ============================================
// Models Index
// ============================================
// Central file to import all models and set up associations

const User = require('./User');
const Opening = require('./Opening');
const Application = require('./Application');
const Team = require('./Team');
const Message = require('./Message');
const Notification = require('./Notification');

// ============================================
// Model Associations (Relationships)
// ============================================

// User has many Openings (as creator)
User.hasMany(Opening, {
    foreignKey: 'creatorId',
    as: 'openings'
});
Opening.belongsTo(User, {
    foreignKey: 'creatorId',
    as: 'creator'
});

// User has many Applications (as applicant)
User.hasMany(Application, {
    foreignKey: 'applicantId',
    as: 'applications'
});
Application.belongsTo(User, {
    foreignKey: 'applicantId',
    as: 'applicant'
});

// Opening has many Applications
Opening.hasMany(Application, {
    foreignKey: 'openingId',
    as: 'applications'
});
Application.belongsTo(Opening, {
    foreignKey: 'openingId',
    as: 'opening'
});

// Opening has one Team
Opening.hasOne(Team, {
    foreignKey: 'openingId',
    as: 'team'
});
Team.belongsTo(Opening, {
    foreignKey: 'openingId',
    as: 'opening'
});

// User owns many Teams
User.hasMany(Team, {
    foreignKey: 'ownerId',
    as: 'ownedTeams'
});
Team.belongsTo(User, {
    foreignKey: 'ownerId',
    as: 'owner'
});

// Team has many Messages
Team.hasMany(Message, {
    foreignKey: 'teamId',
    as: 'messages'
});
Message.belongsTo(Team, {
    foreignKey: 'teamId',
    as: 'team'
});

// User sends many Messages
User.hasMany(Message, {
    foreignKey: 'senderId',
    as: 'sentMessages'
});
Message.belongsTo(User, {
    foreignKey: 'senderId',
    as: 'sender'
});

// User has many Notifications
User.hasMany(Notification, {
    foreignKey: 'userId',
    as: 'notifications'
});
Notification.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

// ============================================
// Export all models
// ============================================
module.exports = {
    User,
    Opening,
    Application,
    Team,
    Message,
    Notification
};
