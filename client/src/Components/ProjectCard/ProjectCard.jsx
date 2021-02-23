import React from 'react';
import style from './ProjectCard.module.css';
import MembersPopUp from '../../Components/ApplicantsPopUp/MembersPopUp';
import { Link } from 'react-router-dom';

function ProjectCard({ project, isFounder }) {
    return (
        <div id={style.mainDiv} style={{ background: project.mainColor, color: project.brightness === 'bright' ? '#fff' : '#000' }}>
            <div className='displayFlex' id='alignItemsCenter'>
                <div id={style.imgDiv}><img src={project.logo} id={style.icon} /></div>
                <h5 className='font800'>{project.name}</h5>
            </div>
            <div className='displayFlex'>
                <MembersPopUp isFounder={isFounder} brightness={project.brightness} projectID={project.id} />
                {isFounder && <Link className='links' to={`/project/jobPanel/${project.id}`}><div style={{ color: project.brightness === 'bright' ? '#fff' : '#000', border: project.brightness === 'bright' ? '2px solid #fff' : '2px solid #000' }} className={style.redirectDiv}><span><i class="fas fa-suitcase"></i> Jobs</span></div></Link>}
                <a href={project.workZone} target='_blank'><div style={{ color: project.brightness === 'bright' ? '#fff' : '#000', border: project.brightness === 'bright' ? '2px solid #fff' : '2px solid #000' }} className={style.redirectDiv}><span><i class="fas fa-terminal"></i> Work Zone</span></div></a>
                {isFounder && <Link className='links' to={`/project/settings/${project.id}`}><div style={{ color: project.brightness === 'bright' ? '#fff' : '#000', border: project.brightness === 'bright' ? '2px solid #fff' : '2px solid #000' }} className={style.redirectDiv}><span><i class="fas fa-sliders-h"></i> Settings</span></div></Link>}
                <Link className='links' to={`/project/jobPanel/${project.id}`}><div style={{ color: project.brightness === 'bright' ? '#fff' : '#000', border: project.brightness === 'bright' ? '2px solid #fff' : '2px solid #000' }} className={style.redirectDiv}><span>Go to profile</span></div></Link>
            </div>
        </div>
    )
}

export default ProjectCard;