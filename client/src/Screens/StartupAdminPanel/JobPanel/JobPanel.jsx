import React, { useEffect, useState } from 'react';
import style from './JobPanel.module.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import JobCard from '../../JobListing/JobCardProfile';
import Empty from '../../../Media/emptyJob.svg';

function JobPanel({ projectID }) {

    const [project, setProject] = useState({});

    useEffect(() => {
        axios.get(`http://localhost:5001/projects/${projectID}`)
            .then(projectData => setProject(projectData.data))
            .catch(err => console.log(err))
    }, [])

    return (
        <div className='displayFlex'>
            <div id={style.fixedDiv} >
                <div id={style.logoDiv}>
                    <Link to={`/project/profile/${projectID}`}><img src={project.logo} id={style.invertedLogo} /></Link>
                </div>
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
                    <img src={Empty} id={style.empty} />
                    <div>
                        <h1 style={{ marginBottom: '25px' }} className='font800'>No jobs posted.</h1>
                        <Link className='links' to={`/project/addJob/${projectID}`}><span id={style.addBtn2}>Post a job</span></Link>
                    </div>
                </div>}
        </div>
    )
}

//jobOpportunities

export default JobPanel;