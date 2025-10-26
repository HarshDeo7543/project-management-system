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
        },
        projectId: {
          type: DataTypes.UUID,
          references: {
            model: 'Projects',
            key: 'id'
          }
        },
        assignedToId: {
          type: DataTypes.UUID,
          references: {
            model: 'Users',
            key: 'id'
          }
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

  static associate(models) {
    this.belongsTo(models.Project, {
      foreignKey: 'projectId',
      as: 'project'
    });
    this.belongsTo(models.User, {
      foreignKey: 'assignedToId',
      as: 'assignedTo'
    });
  }
}

module.exports = Task;
