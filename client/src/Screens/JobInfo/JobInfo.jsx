import React, { useEffect, useState, useLayoutEffect } from 'react';
import style from './JobInfo.module.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Loading from '../../Media/Loading.gif';

function JobInfo({ jobID, user }) {
    const [job, setJob] = useState({});
    const [applied, setApplied] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isMember, setIsMember] = useState (false);

    useLayoutEffect(() => {
        axios.get(`http://localhost:5001/jobs/${jobID}/jobInfo`)
            .then(jobInfo => {
                setJob(jobInfo.data);
                const found = jobInfo.data.Applicants.find (applicant => applicant.id === user.id);
                const findMember = jobInfo.data.project.users.find (member => member.id === user.id );
                if (findMember) {
                    setIsMember (true);
                } else if (found && found.username) setApplied (true)
                setLoading (false);
            })
            .catch(err => console.log(err))
    }, [user])

    function applyToJob() {
        axios.post(`http://localhost:5001/jobs/${jobID}/applicants`, { username: user.username })
            .then(res => setApplied(true))
            .catch(err => console.log(err))
    }

    console.log ('JOB: ', job);

    return (
        <div>
            {!loading ?
                <div>
                    {job.project &&
                        <div style={{ background: job.project && job.project.mainColor }} id={style.mainDiv}>
                            <Link className='links' to='/jobs'><span style={{ color: job.project.brightness === 'bright' ? '#fff' : '#000' }} id={style.goBack}><i style={{ marginRight: '10px' }} class="fas fa-arrow-left"></i>More jobs</span></Link>
                            <Link className='links' to={`/project/profile/${job.project.id}`}>
                                <div className='displayFlex' id='alignItemsCenter'>
                                    <div id={style.projectLogoDiv}>
                                        <img src={job.project.logo} id={style.logo} />
                                    </div>
                                    <h5 style={{ color: job.project.brightness === 'bright' ? '#fff' : '#000' }} className='font800'>{job.project.name}</h5>
                                </div>
                            </Link>
                            <h1 id={style.jobTitle}>{job.title}</h1>
                            <div id={style.btnDiv}>
                                {isMember ? <span style={{ color: job.project.mainColor }} id={style.applied}><i id={style.appliedIcon} class="fas fa-check-circle"></i> You are already part of {job.project.name}.</span> :
                                applied ?
                                    <span style={{ color: job.project.mainColor }} id={style.applied}><i id={style.appliedIcon} class="fas fa-check-circle"></i> You have applied to this job</span> :
                                    <button onClick={applyToJob} style={{ color: job.project.mainColor }} id={style.applyBtn}>Apply to this job</button>
                                }
                                {job.Applicants.length >= 15 && !applied && <span className='font200'>🔥 This job has received many applications</span>}
                            </div>
                        </div>}
                    <div>
                        <div dangerouslySetInnerHTML={{ __html: job.description }} id={style.jobDescrip}></div>
                    </div>
                </div> :
                <img id={style.loading} src={Loading} />
            }
        </div>
    )
}

function mapStateToProps(state) {
    return {
        user: state.userInfo
    }
}

export default connect(mapStateToProps, null)(JobInfo);