const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "jobOpportunity",
    {
      title: {
          type: DataTypes.STRING,
          allowNull: false
      },
      description: {
          type: DataTypes.TEXT
      }
    }
  );
};