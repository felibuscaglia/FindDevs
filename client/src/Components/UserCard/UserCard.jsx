import React, { useState, useEffect } from 'react';
import style from './UserCard.module.css';
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Tooltip from '@material-ui/core/Tooltip';
import Verification from '../../Media/Verification.png';
import { selectWorkers } from '../../Actions/index';
import { connect } from 'react-redux';

const useStyles = makeStyles(theme => ({
    arrow: { color: "#181a19" }
}));

function UserCard({ user, selectWorkers }) {

    const [extraSkills, setExtraSkills] = useState(null);
    const [extraSkillsLength, setExtraLength] = useState(0);

    useEffect(() => {
        if (user.skills) {
            const reduced = user.skills.slice(8).reduce((acc, curr, index) => index === user.skills.slice(8).length - 1 ? acc + curr.label : acc + `${curr.label}, `, '');
            setExtraSkills(reduced);
            setExtraLength(user.skills.slice(8).length);
        }
    }, [])

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
        <div id={style.userCard}>
            <div className='displayFlexColumn' id='alignItemsCenter'>
                <img id={style.profilePic} src={user.profilePic} />
                <div id='alignItemsCenter' className='displayFlex'>
                    <span className='font800' style={{ alignSelf: 'flex-start' }}><span style={{ color: user.color }}>@ </span>{user.username}</span>
                    {user.isPremium && <img id={style.verification} src={Verification} />}
                </div>
                <p id={style.bio}>{user.description}</p>
            </div>
            <div id='alignItemsCenter' className='justifyCenter' style={{ flexWrap: 'wrap' }}>
                {user.skills && user.skills.slice(0, 8).map(skill =>
                    <div id={style.skillDiv}>
                        <BlueOnGreenTooltip classes={{ arrow: classes.arrow }} id={style.tooltip} title='Add tag to filters' arrow>
                            <span
                                onClick={() => { selectWorkers(skill) }}
                                style={{ background: `${skill.strongColor}`, color: skill.softColor }}
                                id={style.skillSpan}>
                                {skill.user_skills.isValidated && <i style={{ marginRight: '5px' }} class="fas fa-check-circle"></i>}{skill.label}
                            </span>
                        </BlueOnGreenTooltip>
                    </div>
                )}
                {extraSkills &&
                    <BlueOnGreenTooltip classes={{ arrow: classes.arrow }} id={style.tooltip} title={extraSkills} arrow>
                        <span id={style.plus}>+{extraSkillsLength}</span>
                    </BlueOnGreenTooltip>}
            </div>
            <button id={style.btn} style={{ background: user.color }}>Contact</button>
        </div>
    )
}

function mapDispatchToProps(dispatch) {
    return {
        selectWorkers: skill => dispatch(selectWorkers(skill))
    }
}

export default connect(null, mapDispatchToProps)(UserCard);