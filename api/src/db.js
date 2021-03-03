require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

const sequelize =
  process.env.NODE_ENV === "production"
    ? new Sequelize({
      database: DB_NAME,
      dialect: "postgres",
      host: DB_HOST,
      port: 5432,
      username: DB_USER,
      password: DB_PASSWORD,
      pool: {
        max: 3,
        min: 1,
        idle: 10000,
      },
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
        keepAlive: true,
      },
      ssl: true,
    })
    : new Sequelize(
      `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/startit`,
      { logging: false, native: false }
    );


const basename = path.basename(__filename);

const modelDefiners = [];

fs.readdirSync(path.join(__dirname, '/models'))
  .filter(
    (file) =>
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

modelDefiners.forEach((model) => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

const { User, Skills, Project, JobOpportunity } = sequelize.models;

const UserSkills = sequelize.define(
  'user_skills',
  {
    isValidated: DataTypes.BOOLEAN
  },
  {
    timestamps: false,
  }
);

const UserXProjects = sequelize.define(
  'userXprojects',
  {
    isFounder: DataTypes.BOOLEAN,
    isWorking: DataTypes.BOOLEAN,
    role: DataTypes.STRING,
    startDate: DataTypes.STRING,
    endDate: DataTypes.STRING
  },
  { timestamps: false }
);

const JobXSkills = sequelize.define(
  'jobXskills',
  {}
)

const Notifications = sequelize.define(
  'notification',
  {
    content: DataTypes.STRING,
    type: DataTypes.STRING,
    projectId: DataTypes.INTEGER,
    jobTitle: DataTypes.STRING,
    projectLogo: DataTypes.STRING,
    projectName: DataTypes.STRING,
    ownerUsername: DataTypes.STRING,
    jobId: DataTypes.INTEGER
  },
  { timestamps: false }
)



User.belongsToMany(Skills, { through: UserSkills });
Skills.belongsToMany(User, { through: UserSkills });

Project.belongsToMany(User, { through: UserXProjects });
User.belongsToMany(Project, { through: UserXProjects });

Project.hasMany(JobOpportunity);
JobOpportunity.belongsTo(Project);

JobOpportunity.hasMany(User, { as: 'Applicants' });
JobOpportunity.belongsToMany(Skills, { through: JobXSkills });
Skills.belongsToMany(JobOpportunity, { through: JobXSkills })

User.hasMany(Notifications);

module.exports = {
  ...sequelize.models,
  conn: sequelize,
  UserSkills,
  UserXProjects,
  Notifications
};
