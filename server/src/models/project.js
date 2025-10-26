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
}

module.exports = Project;
