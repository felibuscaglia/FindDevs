const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "skills",
    {
      label: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
      },
      strongColor: {
        type: DataTypes.STRING,
        allowNull: false
      },
      softColor: {
        type: DataTypes.STRING,
        allowNull: false
      },
      logo: {
        type: DataTypes.STRING
      }
    },
    {
      timestamps: false,
    }
  );
};