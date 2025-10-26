const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');

class User extends Model {
  static initModel(sequelize) {
    User.init(
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
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: { isEmail: true },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        role: {
          type: DataTypes.ENUM('Admin', 'ProjectManager', 'Developer'),
          defaultValue: 'Developer',
        },
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'Users',
        hooks: {
          beforeCreate: async (user) => {
            if (user.password) {
              const salt = await bcrypt.genSalt(10);
              user.password = await bcrypt.hash(user.password, salt);
            }
          },
          beforeUpdate: async (user) => {
            if (user.changed('password')) {
              const salt = await bcrypt.genSalt(10);
              user.password = await bcrypt.hash(user.password, salt);
            }
          },
        },
      }
    );
    return User;
  }

  async validatePassword(password) {
    return bcrypt.compare(password, this.password);
  }

  static associate(models) {
    // A user can be part of many teams
    this.belongsToMany(models.Team, { 
      through: 'TeamMembers', 
      foreignKey: 'userId',
      as: 'teams'
    });
  }
}

module.exports = User;
