const { DataTypes, Model } = require('sequelize');

class Task extends Model {
  static initModel(sequelize) {
    Task.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
        },
        status: {
          type: DataTypes.ENUM('To Do', 'In Progress', 'Done'),
          defaultValue: 'To Do',
        },
        deadline: {
          type: DataTypes.DATE,
        },
        comments: {
          type: DataTypes.TEXT,
        }
      },
      {
        sequelize,
        modelName: 'Task',
        tableName: 'Tasks',
      }
    );
    return Task;
  }
}

module.exports = Task;
