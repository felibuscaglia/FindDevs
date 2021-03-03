const server = require("express").Router();
const { Project, User, UserXProjects, JobOpportunity, Skills } = require("../db.js");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const multer = require('multer');
const { CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET } = process.env;

const upload = multer();

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_SECRET
});

server.get('/', (req, res, next) => {
  Project.findAll({ include: [{ model: JobOpportunity }, { model: User }] })
    .then(startups => res.status(200).json(startups))
    .catch(next)
})

server.get('/:id', (req, res, next) => {
  const { id } = req.params;

  Project.findByPk(id, { include: [{ model: User }, { model: JobOpportunity, include: { model: Skills } }] })
    .then(project => res.status(200).json(project))
    .catch(next)
})

server.post('/:username', async (req, res, next) => {
  const { username } = req.params;

  try {
    req.body.upvotes = 0;
    const newProject = await Project.create(req.body);
    const owner = await User.findOne({ where: { username: username } });
    var thisDate = new Date(Date.now());
    thisDate = thisDate.toString();
    thisDate = thisDate.split(' ')
    var finalDate = `${thisDate[1].toLowerCase()} ${thisDate[3]}`;
    await UserXProjects.create({ userId: owner.id, projectId: newProject.id, isFounder: true, isWorking: true, role: 'Founder & CEO', startDate: finalDate });
    res.status(200).json(newProject)
  } catch (err) {
    next(err)
  }
})

server.post('/:projectId/logo', upload.single('image'), async (req, res, next) => {
  const { projectId } = req.params;

  var project;

  try {
    project = await Project.findByPk(projectId);
  } catch (err) {
    res.status(500).send('Something failed.')
  }
  let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            throw new Error('Failed to upload file.')
          }
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };

  async function upload(req) {
    let result = await streamUpload(req);
    project.update({ ...project, logo: result.url });
  }

  upload(req);

  res.send ('File uploaded.')
})

server.patch('/:projectId', (req, res, next) => {
  const { projectId } = req.params;

  Project.findByPk(projectId)
    .then(project => {
      project.update(req.body)
    })
    .then(response => res.status(200).send('Project succesfully updated.'))
    .catch(next)
})

server.put('/:memberId/:projectId/role', (req, res, next) => {

  const { role } = req.body;

  UserXProjects.findOne({ where: { ...req.body.userXprojects } })
    .then(data => data.update({ ...data, role: role }))
    .then(response => res.status(200).send('Role updated.'))
    .catch(next)
})

server.put('/:projectId/delete', async (req, res, next) => {
  const { projectId } = req.params;
  try {
    await Promise.all(req.body.map(async user => {
      const userInfo = await UserXProjects.findOne({ where: { userId: user.id, projectId } });
      var thisDate = new Date(Date.now());
      thisDate = thisDate.toString();
      thisDate = thisDate.split(' ')
      var finalDate = `${thisDate[1].toLowerCase()} ${thisDate[3]}`;
      await userInfo.update({ ...userInfo, endDate: finalDate });
    }))
    const project = await Project.findByPk(projectId);
    await project.update({ ...project, isDeleted: true });
    await JobOpportunity.destroy({ where: { projectId } });
    res.send('Project deleted.')
  } catch (err) {
    next(err);
  }
})

server.delete('/:projectId/:userId/fire', (req, res, next) => {
  const { projectId, userId } = req.params;

  User.findByPk(userId, { include: { model: Project } })
    .then(user => {
      const found = user.projects.find(project => project.id == projectId);
      var thisDate = new Date(Date.now());
      thisDate = thisDate.toString();
      thisDate = thisDate.split(' ')
      var finalDate = `${thisDate[1].toLowerCase()} ${thisDate[3]}`;
      res.send(found)
      found.userXprojects.update({ ...found.userXprojects, endDate: finalDate })
    })
    .then(response => res.status(200).send('User fired.'))
    .catch(next)
})

module.exports = server;
