import React, { useEffect, useState } from 'react';
import style from './Homepage.module.css';
import AppDevelopment from '../../Media/app_development_SVG.svg';
import CreativeProcess from '../../Media/Creative_process_SVG.svg';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Register from '../../Components/PopUps/RegisterPopUp';

function Homepage() {

    const [proyects, setProyects] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5001/projects')
            .then(proyects => setProyects(proyects.data.splice(0, 8)))
            .catch(err => console.log(err))
    }, [])

    console.log('Proyectos: ', proyects)

    return (
        <div>
            <div id={style.firstBlock}>
                <div id={style.innerTxtDiv}>
                    <h1 className='font800'>Create the next big thing.</h1>
                    <span className='font200'>Share your idea, find the developers you need and <span className='font800'>turn it into a total success.</span></span>
                </div>
            </div>
            <div id={style.secondBlock}>
                <div id={style.secondBlockTxt}>
                    <h1 className='font800'><span className='font200'> Be part of the future.</span> Today.</h1>
                    <p>
                        People with revolutionary ideas need your tech skills to transform them into a reality. Find the project that best suits your needs and preferences and apply
                        to be part of it.
                    </p>
                    <div id={style.txtDiv}>
                        <div className={style.smallTxt1}>
                            <h3 className={style.smallTitle} className='font800'>No surprises.</h3>
                            <span>Speak directly with the creator of the project to be able to define if their interests are aligned with yours.</span>
                        </div>
                        <div className={style.smallTxt2}>
                            <h3 className={style.smallTitle} className='font800'>Get all the details.</h3>
                            <span>You will be able to know everything you need about the project and the job before applying.</span>
                        </div>
                    </div>
                    <Link to='/jobs'><button className={style.btn}>Find startup jobs.</button></Link>
                </div>
                <img src={AppDevelopment} className={style.icon} />
            </div>
            <div id={style.thirdBlock}>
                <div id={style.logoTxtDiv}>
                    <h1 className='font200'>We grow <span className='font800'>everyday.</span></h1>
                    <span className='font200'>Explore the strartups that use FindDevs to gather their work team.</span>
                </div>
                <div id={style.logoDiv}>
                    {proyects.map(project =>
                        <Link to={`/project/profile/${project.id}`}>
                            <img src={project.logo} className={style.logo} />
                        </Link>
                    )}
                </div>
            </div>
            <div id={style.fourthBlock}>
                <img src={CreativeProcess} className={style.icon} />
                <div id={style.secondBlockTxt}>
                    <h1 className='font200'>Gather the team <span className='font800'>you</span> need.</h1>
                    <p>
                        Begin working today with developers who <span className={style.bold}>want your project to be a total success</span>. Publish your startup idea,
                    choose those who best fit in your team and start working.
                    </p>
                    <div id={style.txtDiv}>
                        <div className={style.smallTxt1}>
                            <h3 className='font800'>Find the ideal candidate.</h3>
                            <span>Test the skills of the applicants or tempt the developer you think your project needs.</span>
                        </div>
                        <div className={style.smallTxt2}>
                            <h3 className='font800'>You are in control.</h3>
                            <span>Post jobs, put applicants' skills to the test and hire whoever you think is the ideal developer.</span>
                        </div>
                    </div>
                    <Register isMain={true} />
                </div>
            </div>
        </div>
    )
}

export default Homepage;