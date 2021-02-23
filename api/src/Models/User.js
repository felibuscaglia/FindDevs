const { DataTypes } = require("sequelize");
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  const User = sequelize.define(
    "user",
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            args: true,
            msg: 'Please enter a valid email.'
          },

        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
        set(value) {
          if (value) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(value, salt);
            this.setDataValue("password", hash);
          }
        }
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      color: {
        type: DataTypes.STRING,
        allowNull: false
      },
      gitHub: {
        type: DataTypes.STRING
      },
      linkedIn: {
        type: DataTypes.STRING
      },
      twitter: {
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.STRING
      },
      country: {
        type: DataTypes.STRING
      },
      region: {
        type: DataTypes.STRING
      },
      profilePic: {
        type: DataTypes.STRING
      },
      isPremium: {
        type: DataTypes.BOOLEAN
      },
      brightness: {
        type: DataTypes.STRING
      }
    },
    {
      timestamps: false,
    }
  );
  User.prototype.compare = function (pass) {
    return bcrypt.compareSync(pass, this.password);
  };
  return User;
};