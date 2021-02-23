import React, { useState } from 'react';
import { connect } from 'react-redux';
import style from './JobListings.module.css';
import { filterJob, removeJobFilter } from '../../Actions/index';
import { Hint } from 'react-autocomplete-hint';
import JobCard from './JobCard';
import Loading from '../../Media/Loading.gif';

function JobListings({ jobs, skills, skillSelection, filteredJobs, filterJob, removeJobFilter }) {

    const [loading, setLoading] = useState(false);

    function addSkill(e) {
        if (e.keyCode === 13) {
            var found = skills.find(skill => skill.label === e.target.value);
            if (found) {
                setLoading(true);
                filterJob(found);
                setLoading(false);
            }
        }
    }

    return (
        <div className='displayFlexColumn' id='alignItemsCenter'>
            <div id={style.mainImage}>
                <div id={style.searchDiv}>
                    <i class="fas fa-search"></i>
                    <Hint options={skills}>
                        <input onKeyDown={(e) => addSkill(e)} type='text' placeholder='Search for job skills' id={style.searchInput} />
                    </Hint>
                </div>
                <svg style={{ position: 'absolute', top: 200 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="#ffffff" fill-opacity="1" d="M0,192L60,192C120,192,240,192,360,202.7C480,213,600,235,720,224C840,213,960,171,1080,160C1200,149,1320,171,1380,181.3L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
                </svg>
            </div>
            <div style={{ display: skillSelection.length > 0 ? 'block' : 'none' }} id={style.filteredDiv}>
                {skillSelection.map(filtered =>
                    <span onClick={() => removeJobFilter(filtered)} style={{ background: filtered.strongColor, color: filtered.softColor }} id={style.skillSpan}>{filtered.label} <i class="fas fa-times-circle"></i></span>
                )}
            </div>
            {loading ?
                <img id={style.loading} src={Loading} /> :
                skillSelection.length === 0 ?
                    jobs.map(job => <JobCard setLoading={setLoading} job={job} />)
                    :
                    filteredJobs.map(job => <JobCard setLoading={setLoading} job={job} />)
            }
            {!loading && <span id='giveMargin'>🧑‍💻 <span id={style.end}>There are no more job opportunities. Please come back later!</span></span>}
        </div>
    )
}

function mapStateToProps(state) {
    return {
        jobs: state.jobs,
        skills: state.allSkills,
        skillSelection: state.jobSkillSelection,
        filteredJobs: state.filteredJobs
    }
}

function mapDispatchToProps(dispatch) {
    return {
        filterJob: skill => dispatch(filterJob(skill)),
        removeJobFilter: skill => dispatch(removeJobFilter(skill))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(JobListings);