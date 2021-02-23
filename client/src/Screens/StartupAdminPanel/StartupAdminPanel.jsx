import React, { useEffect, useState, useLayoutEffect } from 'react';
import Logo from '../../Media/invertedlogo.png';
import style from './StartupAdminPanel.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import MembersPopUp from '../../Components/ApplicantsPopUp/MembersPopUp';
import ProjectCard from '../../Components/ProjectCard/ProjectCard';
import Empty from '../../Media/emptyJob.svg';

function StartupAdminPanel({ user }) {
    const [projects, setProjects] = useState([]);

    useLayoutEffect(() => {
        axios.get(`http://localhost:5001/users/${user.username}/projects`)
            .then(projectsData => {
                projectsData.data = projectsData.data.sort((a, b) => {
                    return b.userXprojects.isFounder - a.userXprojects.isFounder
                })
                setProjects(projectsData.data)
            })
            .catch(err => console.log(err))
    }, [user])

    return (
        <div className='displayFlex'>
            <div id={style.fixedDiv} >
                <Link id={style.link} to={`/user/${user.username}`}>
                    <div id={style.logoDiv}>
                        <img src={Logo} id={style.invertedLogo} />
                        <h2 className='font200'>FindDevs</h2>
                    </div>
                </Link>
            </div>
            <div id={style.secondDiv}>
                <div id={style.projectDiv}>
                    {projects.length > 0 && <h1 className='font800'>Your projects</h1>}
                    {projects.length > 0 ? projects.map(project => project.userXprojects.isFounder && project.userXprojects.endDate === null ? <ProjectCard project={project} isFounder={true} /> : <ProjectCard project={project} isFounder={false} />) :
                        <div className='displayFlex' id='alignItemsCenter'>
                            <img src={Empty} id={style.empty} />
                            <div>
                                <h1 style={{ marginBottom: '25px' }} className='font800'>Start gathering the team.</h1>
                                <Link className='links' to='/project/post'><span id={style.addBtn2}>Post a project</span></Link>
                            </div>
                        </div>}
                </div>
                {projects.length > 0 && <Link to='/project/post'><span id={style.postBtn}>Post a project</span></Link>}
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        user: state.userInfo
    }
}

export default connect(mapStateToProps, null)(StartupAdminPanel);