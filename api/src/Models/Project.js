const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "project",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      logo: {
        type: DataTypes.STRING
      },
      website: {
        type: DataTypes.STRING
      },
      oneLineDescription: {
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      upvotes: {
        type: DataTypes.INTEGER
      },
      productHunt: {
        type: DataTypes.STRING
      },
      twitter: {
        type: DataTypes.STRING
      },
      linkedIn: {
        type: DataTypes.STRING
      },
      mainColor: {
        type: DataTypes.STRING
      },
      workZone: {
        type: DataTypes.STRING
      },
      brightness: {
        type: DataTypes.STRING
      },
      isDeleted: {
        type: DataTypes.BOOLEAN
      }
    },
    {
      timestamps: false,
    }
  );
};