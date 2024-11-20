const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const User = require('./User');  // Import the User model'
const Post = require('./Post');  // Import the Post model


class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'comment',
  }
);

// Set up the relationship between Comment and User
Comment.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'id', // user_id in Comment references id in User
});

module.exports = Comment;