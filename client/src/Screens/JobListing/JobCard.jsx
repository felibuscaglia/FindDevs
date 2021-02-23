import React from 'react';
import style from './JobListings.module.css';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { filterJob } from '../../Actions/index';
import moment from 'moment';
import { getDate } from '../../utils';

const useStyles = makeStyles(theme => ({
    arrow: { color: "#181a19" }
}));

function JobCard({ job, filterJobs, setLoading }) {

    const classes = useStyles();

    const BlueOnGreenTooltip = withStyles({
        tooltip: {
            color: "white",
            backgroundColor: "#181a19",
            fontFamily: 'Nunito',
            fontSize: '12px'
        }
    })(Tooltip);

    return (
        <div id={style.mainDiv} style={{ background: job.project.mainColor }}>
            <div className='displayFlex' id='alignItemsCenter'>
                <div id={style.imgDiv}><img src={job.project.logo} id={style.icon} /></div>
                <div id={style.jobInfoDiv}>
                    <span id={style.projectName}>{job.project.name}</span>
                    <span>{job.title}</span>
                    <div id={style.badgeDiv}>
                        {job.project.upvotes > 50 && <span id={style.badge}><i class="fas fa-thumbs-up"></i> HIGHLY UPVOTED</span>}
                        {job.project.users.length > 5 && <span id={style.badge}><i class="fas fa-chart-line"></i> GROWING FAST</span>}
                        {job.project.users.length >=10 && <span id={style.badge}><i class="fas fa-users"></i> BIG TEAM</span>}
                    </div>
                </div>
            </div>
            <div id={style.skillDiv}>
                {job.skills.map(skill =>
                    <BlueOnGreenTooltip classes={{ arrow: classes.arrow }} id={style.tooltip} title='Add tag to filters' arrow>
                        <span onClick={() => {
                            setLoading(true);
                            filterJobs(skill);
                            setLoading(false);
                        }} id={style.skillSpan}>{skill.label}</span>
                    </BlueOnGreenTooltip>
                )}
            </div>
            <div>
                <Link to={`/job/info/${job.id}`}><button id={style.btn}>Apply</button></Link>
                <span>📌{getDate(moment(job.createdAt).format('MM/DD/YYYY'))}</span>
            </div>
        </div>
    )
}

function mapDispatchToProps(dispatch) {
    return {
        filterJobs: skill => dispatch(filterJob(skill))
    }
}

export default connect(null, mapDispatchToProps)(JobCard);