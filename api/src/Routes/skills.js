const server = require("express").Router();
const { Skills, User, UserSkills } = require ("../db");

server.post ('/', (req, res, next) => {
    Skills.create (req.body)
        .then (response => res.status (200).send ('Skills posted.'))
        .catch (err => console.log (err))
})

server.get ('/filterWorkers/:skills', (req, res, next) => {
    const { skills } = req.params;
    var skillsToFilter = skills.split (' ');
    
})

server.get ('/', (req, res, next) => {
    Skills.findAll ({ include: { model: User } })
        .then (skills => res.status (200).json (skills))
        .catch (next)
})

server.post ('/:username', (req, res, next) => {
    const { username } = req.params;
    const { skills } = req.body;

    User.findOne ({ where: { username: username } })
        .then (user => {
            user.setSkills (skills)
        })
        .then (response => res.status (200).send ('Succesfully posted.'))
        .catch (next)
})

server.delete ('/:skillId', (req, res, next) => {
    const { skillId } = req.params;

    Skills.findByPk (skillId)
        .then (skill => skill.destroy())
        .then (response => res.send ('Skill deleted.'))
        .catch (next)
})

server.post ('/:username/validate', (req, res, next) => {
    const { username } = req.params;
    const { skill } = req.body;

    var userId;
    var skillId;

    User.findOne ({ where: { username: username } })
        .then (user => {
            userId = user.id
            return Skills.findOne ({ where: { label: skill } })
        })
        .then (skill => {
            skillId = skill.id;
            return UserSkills.findOne ({
                where: { 
                    userId,
                    skillId
                }
            })
        })
        .then (userSkill => {
            userSkill.update ({ ...userSkill, isValidated: true })
        })
        .then (response => res.status (200).send ('Skill validated!'))
        .catch (next)
})

module.exports = server;