const server = require("express").Router();
const { User, Skills, Project, Notifications, UserXProjects } = require("../db.js");
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const streamifier = require('streamifier');
const { CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET } = process.env;

const upload = multer();

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_SECRET
});

server.post('/:userId/premium', async (req, res, next) => {
    const { userId } = req.params;

    try {
        const user = await User.findByPk(userId);
        await user.update(req.body);
        const userProjects = await Project.findAll({ where: { ownerId: userId, isDeleted: false } });
        await Promise.all(
            userProjects.map(async project => {
                await project.update({ ...project, isPremium: true })
            })
        )
        res.send('User is now premium.')
    } catch (err) {
        next(err);
    }
})

server.post('/:userId/profilePic', upload.single('image'), async (req, res, next) => {
    const { userId } = req.params;
    var user;
    try {
        user = await User.findByPk(userId);
    } catch (err) {
        next(err)
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
        user.update({ ...user, profilePic: result.url });
      }
    
      upload(req);
    
      res.send ('File uploaded.')
})

server.put('/:userId', async (req, res, next) => {
    const { userId } = req.params;

    try {
        const user = await User.findByPk(userId);
        await user.update(req.body);
        if (req.body.skills) user.setSkills(req.body.skills);
        res.status(200).send('User updated.')
    } catch (err) {
        next(err)
    }
})

server.get('/', (req, res, next) => {
    User.findAll({ include: { model: Skills } })
        .then(users => res.status(200).json(users))
        .catch(next)
})

server.get('/:username', (req, res, next) => {
    const { username } = req.params;

    User.findOne({
        where: { username: username },
        include: [{ model: Skills }, { model: Project }, { model: Notifications }]
    })
        .then(user => res.status(200).json(user))
        .catch(next)
})

server.get('/:username/projects', (req, res, next) => {
    const { username } = req.params;

    User.findOne({
        where: { username: username },
        include: { model: Project }
    })
        .then(user => res.status(200).json(user.projects))
        .catch(next)

})

server.post('/:userId/:projectId/founders', async (req, res, next) => {
    const { userId, projectId } = req.params;

    try {
        const userData = await UserXProjects.findOne({ where: { userId, projectId } });
        await userData.update({ ...userData, isFounder: true });
        res.send('User is now founder.')
    } catch (err) {
        next(err);
    }
})

server.post('/:username/notifications', (req, res, next) => {
    const { username } = req.params;

    var copyOfUser;

    User.findOne({ where: { username: username } })
        .then(user => {
            copyOfUser = user;
            return Notifications.create(req.body)
        })
        .then(notification => copyOfUser.addNotifications(notification))
        .then(response => res.status(200).send('Notification added.'))
        .catch(next)
})

server.delete('/:userId/notifications/:notificationId', (req, res, next) => {
    const { notificationId, userId } = req.params;
    Notifications.findByPk(notificationId)
        .then(notification => notification.destroy())
        .then(response => User.findByPk(userId, { include: { model: Notifications } }))
        .then(user => res.json(user.notifications))
        .catch(err => console.log(err))
})

server.post('/:username/project/:projectId', (req, res, next) => {
    const { username, projectId } = req.params;
    const { jobTitle } = req.body;

    var copyOfUser;

    User.findOne({ where: { username: username } })
        .then(user => {
            copyOfUser = user;
            return Project.findByPk(projectId)
        })
        .then(project => {
            var thisDate = new Date(Date.now());
            thisDate = thisDate.toString();
            thisDate = thisDate.split(' ')
            var finalDate = `${thisDate[1].toLowerCase()} ${thisDate[3]}`;
            UserXProjects.create({ userId: copyOfUser.id, projectId: project.id, isFounder: false, isWorking: true, role: jobTitle, startDate: finalDate })
        })
        .then(response => res.status(200).send('The user is now part of your project!'))
        .catch(next)
})

server.post('/:username/edit', (req, res, next) => {
    const { username } = req.params;

    User.findOne({ where: { username: username } })
        .then(user => {
            user.update({
                ...user,
                ...req.body
            })
        })
        .then(response => res.status(200).send('User updated succesfully!'))
        .catch(next)
})

module.exports = server;