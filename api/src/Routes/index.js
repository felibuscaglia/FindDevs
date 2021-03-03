const { Router } = require("express");
// import all routers;
const proyectRouter = require ('./projects');
const userRouter = require ('./user');
const authRouter = require ('./auth');
const skillsRouter = require ('./skills');
const jobsRouter = require ('./jobs');

const router = Router();

router.use ("/projects", proyectRouter);
router.use ("/users", userRouter);
router.use ("/auth", authRouter);
router.use ("/skills", skillsRouter);
router.use ("/jobs", jobsRouter);

module.exports = router;
