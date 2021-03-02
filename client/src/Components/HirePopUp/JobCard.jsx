import React, { useState } from 'react';
import style from './HirePopUp.module.css';
import axios from 'axios';
import Loading from '../../Media/Loading.gif';
import Invited from '../ApplicantsPopUp/Accepted';


function JobCard({ job, project, applicantUsername, user, close }) {

    const [invited, setInvited] = useState(false);
    const [loading, setLoading] = useState(false);

    function inviteToProject(jobTitle, jobId) {
        setLoading (true);
        var message = `${jobTitle} at ${project.project.name}`;

        axios.post(`http://localhost:5001/users/${applicantUsername}/notifications`, { content: message, type: 'Invitation', projectId: project.project.id, jobTitle: jobTitle, projectLogo: project.project.logo, projectName: project.project.name, ownerUsername: user.username, jobId })
            .then(res => {
                setInvited (true);
                setLoading (false);
                setTimeout(() => {
                    close()
                    window.location.reload()
                }, 3000);
            })
            .catch(err => console.log(err))
    }

    if (loading) {
        return (
            <div>
                <img alt="Loading GIF" id={style.loading} src={Loading} />
            </div>
        )
    } else if (invited) {
        return <Invited type={'Invitation'} decided={applicantUsername} projectName={project.project.name}/>
    } else return (
        <div id={style.mainJobDiv} style={{ background: project.project.mainColor }}>
            <div className='displayFlex' id='alignItemsCenter'>
                <div id={style.imgDiv}><img alt="Loading GIF" src={project.project.logo} id={style.icon} /></div>
                <div id={style.jobInfoDiv}>
                    <span id={style.projectName}>{project.project.name}</span>
                    <span>{job.title}</span>
                </div>
            </div>
            <div className='displayFlex'>
                {job.skills.map(skill =>
                    <span style={{ border: `2px solid ${skill.strongColor}`, color: skill.softColor }} id={style.skillSpan}>{skill.label}</span>
                )}
            </div>
            <button onClick={() => inviteToProject(job.title, job.id)} id={style.applyBtn}>Invite</button>
        </div>
    )
}

export default JobCard;