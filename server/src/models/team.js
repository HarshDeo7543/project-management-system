const { DataTypes, Model } = require('sequelize');

class Team extends Model {
  static initModel(sequelize) {
    Team.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
      },
      {
        sequelize,
        modelName: 'Team',
        tableName: 'Teams',
      }
    );
    return Team;
  }

  static associate(models) {
    // A team can have many users (members)
    this.belongsToMany(models.User, { 
      through: 'TeamMembers', 
      foreignKey: 'teamId',
      as: 'members'
    });

    // A team can be assigned to many projects
    this.hasMany(models.Project, {
      foreignKey: 'teamId',
      as: 'projects'
    });
  }
}

module.exports = Team;
