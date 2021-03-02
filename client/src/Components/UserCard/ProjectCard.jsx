import React, { useEffect, useLayoutEffect, useState } from 'react';
import style from './UserCard.module.css';
import Verification from '../../Media/Verification.png';
import { verifyPremiumProject } from '../../utils';
import { Link } from 'react-router-dom';

function ProjectCard({ project }) {

    const [isPremium, setIsPremium] = useState(false);

    useLayoutEffect(() => {
        setIsPremium(verifyPremiumProject(project.users));
    }, [])

    return (
        <div id={style.projectCard}>
            <div id='alignItemsCenter' className='displayFlexColumn'>
                <img alt="Profile picture" id={style.profilePic} src={project.logo} />
                <span id={style.projectName} className='font800'>{project.name}</span>
                <p id={style.bio}>{project.oneLineDescription}</p>
            </div>
            <Link style={{ width: '100%' }} to={`/project/profile/${project.id}`}><button id={style.btn} style={{ background: project.mainColor }}>Go to profile</button></Link>
        </div>
    )
}

export default ProjectCard;