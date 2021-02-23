import React, { useState } from 'react';
import { connect } from 'react-redux';
import style from './WorkersList.module.css';
import UserCard from '../../Components/UserCard/UserCard';
import { Hint } from 'react-autocomplete-hint';
import { removeFilters, selectWorkers } from '../../Actions/index';
import GoPremium from '../../Components/GoPremiumPopUp/GoPremium';
import Loading from '../../Media/Loading.gif';

function WorkersList({ users, skills, skillSelection, removeFilters, filteredWorkers, selectWorkers, userInfo }) {

    const [loading, setLoading] = useState(false);

    function addSkill(e) {
        if (e.keyCode === 13) {
            var found = skills.find(skill => skill.label.toLowerCase() === e.target.value.toLowerCase());
            if (found) {
                setLoading(true);
                selectWorkers(found);
                setLoading(false);
                e.target.value = '';
            }
        }
    }

    if (loading) {
        return <img id={style.loading} src={Loading} />
    }

    console.log(userInfo, 'user info')

    return (
        <div className='displayFlexColumn'>
            <div id={style.mainImage}>
                <div id={style.searchDiv}>
                    <i class="fas fa-search"></i>
                    <Hint options={skills}>
                        <input onKeyDown={(e) => addSkill(e)} type='text' placeholder='Search and filter by skill' id={style.searchInput} />
                    </Hint>
                </div>
                <svg style={{ position: 'absolute', top: 230 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="#ffffff" fill-opacity="1" d="M0,192L60,192C120,192,240,192,360,202.7C480,213,600,235,720,224C840,213,960,171,1080,160C1200,149,1320,171,1380,181.3L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
                </svg>
            </div>
            {!userInfo.isPremium &&
                <div style={{ display: skillSelection.length > 0 ? 'none' : 'block' }} id={style.filteredDiv}>
                    <div id={style.GPdiv}>
                        <span>Do you want to appear on the frontpage? <span className='font800'>Verify your FindDevs account!</span></span>
                        <GoPremium />
                    </div>
                </div>}
            <div style={{ display: skillSelection.length > 0 ? 'block' : 'none' }} id={style.filteredDiv}>
                {skillSelection.map(filtered =>
                    <span onClick={() => removeFilters(filtered)} style={{ background: `${filtered.strongColor}`, color: filtered.softColor }} id={style.skillSpan}>{filtered.label} <i class="fas fa-times-circle"></i></span>
                )}
            </div>
            {skillSelection.length === 0 &&
                <div>
                    <div className='displayFlexColumn' id='alignItemsCenter'>
                        <div id={style.userCards}>
                            {users.map(user => user.isPremium && <UserCard user={user} />)}
                        </div>
                    </div>
                    <div>
                        {skills.map(skill =>
                            skill.users.length > 0 && skill.users.find(user => user.isPremium === true) ?
                                <div className='displayFlexColumn' id='alignItemsCenter'>
                                    <div className='displayFlex' id='alignItemsCenter'>
                                        <img src={skill.logo} id={style.verification} />
                                        <h3 className='font800'>{skill.label} developers ({skill.users.length})</h3>
                                    </div>
                                    <div id={style.userCards}>
                                        {skill.users.map(user => user.isPremium && <UserCard user={user} />)}
                                    </div>
                                </div> : null
                        )}
                    </div>
                </div>
            }
            {skillSelection.length > 0 && filteredWorkers.length !== 0 &&
                <div className='justifyCenter' id='flexWrap'>
                    {filteredWorkers.map(worker => <UserCard user={worker} />)}
                </div>
            }
        </div>
    )
}

function mapStateToProps(state) {
    return {
        users: state.users,
        skills: state.allSkills,
        skillSelection: state.skillSelection,
        filteredWorkers: state.filteredWorkers,
        userInfo: state.userInfo
    }
}

function mapDispatchToProps(dispatch) {
    return {
        removeFilters: skill => dispatch(removeFilters(skill)),
        selectWorkers: skill => dispatch(selectWorkers(skill))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkersList);