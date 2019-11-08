const bcrypt = require('bcrypt');

module.exports = (sequelize, Sequelize) => {
  const user = sequelize.define(
    'user',
    {
      userid: {
        type: Sequelize.STRING(20),
        primaryKey: true
      },
      email: {
        type: Sequelize.STRING(45),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false
      }
    },
    {
      createdAt: false,
      updatedAt: false,

      hooks: {
        beforeCreate: (user, options) => bcrypt
            .hash(user.password, 10)
            .then((hash) => {
              user.password = hash;
            })
            .catch((err) => {
              throw new Error();
            })
      }
    }
  );

  user.associate = (models) => {
    user.belongsToMany(models.gamesessions, {
      as: 'Games',
      through: 'playerTable',
      foreignKey: 'userID'
    });
  };
  return user;
};
