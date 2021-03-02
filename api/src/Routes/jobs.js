const server = require("express").Router();
const { JobOpportunity, Project, User, Skills } = require("../db");
const cloudinary = require('cloudinary').v2;

server.get('/', (req, res, next) => {
    JobOpportunity.findAll({ include: [{ model: User, as: 'Applicants' }, { model: Project, include: { model: User } }, { model: Skills }] })
        .then(jobs => res.json(jobs))
        .catch(next)
})

server.get('/:jobId/jobInfo', (req, res, next) => {
    const { jobId } = req.params;

    JobOpportunity.findByPk(jobId, { include: [{ model: User, as: 'Applicants' }, { model: Project, include: { model: User } }, { model: Skills }] })
        .then(job => res.status(200).json(job))
        .catch(next)
})

server.post('/:projectId', async (req, res, next) => {
    const { projectId } = req.params;
    const { jobInfo, skills } = req.body;

    try {
        const project = await Project.findByPk (projectId);
        const jobOpportunity = await JobOpportunity.create (jobInfo);
        await jobOpportunity.setSkills (skills);
        await project.addJobOpportunity (jobOpportunity);
        res.status (200).send ('Job placed successfully.');
    } catch (err) { 
        next (err);
    }
})

server.post('/:jobId/applicants', (req, res, next) => {
    const { jobId } = req.params;
    const { username } = req.body;

    var copyOfUser;

    User.findOne({ where: { username: username } })
        .then(user => {
            copyOfUser = user;
            return JobOpportunity.findByPk(jobId)
        })
        .then(job => job.addApplicants(copyOfUser))
        .then(response => res.status(200).send('Applicant successfully posted.'))
        .catch(next)
})

server.delete('/:jobId/applicants', (req, res, next) => {
    const { jobId } = req.params;
    const { username } = req.body;

    console.log(req.body, 'REQBODY!!!')

    JobOpportunity.findByPk(jobId, { include: { model: User, as: 'Applicants' } })
        .then(job => {
            const filteredApplicants = job.Applicants.filter(user => user.username !== username);
            job.setApplicants(filteredApplicants);
        })
        .then(() => res.status(200).send('Filtered.'))
        .catch(next)
})

server.get('/:jobId/applicants', (req, res, next) => {
    const { jobId } = req.params;

    JobOpportunity.findByPk(jobId, { include: { model: User, as: 'Applicants' } })
        .then(jobs => res.status(200).json(jobs.Applicants))
        .catch(next)
})

server.get('/:projectId', (req, res, next) => {
    const { projectId } = req.params;

    JobOpportunity.findAll({
            where: { projectId: projectId },
            include: [{ model: User, as: 'Applicants' }, { model: Project, include: { model: User } }]
        })
        .then(jobs => res.status(200).json(jobs))
        .catch(next)
})

server.delete('/:jobId', (req, res, next) => {
    const { jobId } = req.params;

    JobOpportunity.findByPk(jobId)
        .then(job => job.destroy())
        .then(response => res.status(200).send('Product successfully deleted.'))
        .catch(next)
})


module.exports = server;