import React, { useLayoutEffect, useState } from 'react';
import style from './JobPanel.module.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import JobCard from '../../JobListing/JobCardProfile';
import Empty from '../../../Media/emptyJob.svg';
import Loading from '../../../Media/Loading.gif';
import jwt from 'jsonwebtoken';
import { setUserInfo } from '../../../Actions/index';
import { connect } from 'react-redux';

function JobPanel({ projectID, setUserInfo, user }) {
    const [project, setProject] = useState({});
    const [loading, setLoading] = useState (true);

    async function asyncUseEffect(username) {
        await (setUserInfo(username));
    }

    useLayoutEffect(() => {
        if (!user.username) {
            const user = jwt.decode(JSON.parse(localStorage.getItem('user')))
            if (user) {
                asyncUseEffect(user.username);
            } else window.location.replace('/error');
        }
        axios.get(`http://localhost:5001/projects/${projectID}`)
            .then(projectData => {
                const userFound = projectData.data.users.find (user => user.id == user.id);
                if (!userFound || !userFound.userXprojects.isFounder || projectData.data.isDeleted) window.location.replace ('/error');
                setProject(projectData.data);
                setTimeout(() => {
                    setLoading (false);
                }, 2000)
            })
            .catch(err => console.log(err))
    }, [user])

    if (loading) {
        return (
            <img alt="Loading GIF" src={Loading} id={style.loading} />
        )
    }

    return (
        <div className='displayFlex'>
            <div id={style.fixedDiv}>
                <div id={style.logoDiv}>
                    <Link to={`/project/profile/${projectID}`}><img alt="Project logo" src={project.logo} id={style.invertedLogo} /></Link>
                </div>
                <Link id={style.link} to={`/admin/panel`}><span className='font200'><i class="fas fa-door-open"></i> Back to Admin Panel</span></Link>
            </div>
            {project.jobOpportunities && project.jobOpportunities.length > 0 ?
                <div id={style.secondDiv}>
                    <h1 className='font800'>Job Panel</h1>
                    <div id={style.jobDiv}>
                        {project.jobOpportunities && project.jobOpportunities.map(job => <JobCard isJobPanel={true} project={project} job={job} />)}
                    </div>
                    <Link className='links' to={`/project/addJob/${projectID}`}><span id={style.addBtn}>Post a job</span></Link>
                </div> :
                <div id={style.emptyDiv}>
                    <img alt="No jobs posted" src={Empty} id={style.empty} />
                    <div id={style.innerEmptyDiv}>
                        <h1 style={{ marginBottom: '25px' }} className='font800'>No jobs posted.</h1>
                        <Link className='links' to={`/project/addJob/${projectID}`}><span id={style.addBtn2}>Post a job</span></Link>
                    </div>
                </div>}
        </div>
    )
}

function mapStateToProps (state) {
    return {
        user: state.userInfo
    }
} 

function mapDispatchToProps (dispatch) {
    return {
        setUserInfo: username => dispatch(setUserInfo(username))
    }
}

export default connect (mapStateToProps, mapDispatchToProps)(JobPanel);