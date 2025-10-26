const { DataTypes, Model } = require('sequelize');

class Project extends Model {
  static initModel(sequelize) {
    Project.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
        },
        deadline: {
          type: DataTypes.DATE,
        },
        teamId: {
          type: DataTypes.UUID,
          references: {
            model: 'Teams',
            key: 'id'
          }
        }
      },
      {
        sequelize,
        modelName: 'Project',
        tableName: 'Projects',
      }
    );
    return Project;
  }

  static associate(models) {
    // A project belongs to one team
    this.belongsTo(models.Team, {
      foreignKey: 'teamId',
      as: 'team'
    });

    this.hasMany(models.Task, {
      foreignKey: 'projectId',
      as: 'tasks',
      onDelete: 'CASCADE'
    });
  }
}

module.exports = Project;
