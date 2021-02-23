import React, { useEffect, useState, useLayoutEffect } from 'react';
import style from '../WorkersList/WorkersList.module.css';
import { connect } from 'react-redux';
import Loading from '../../Media/Loading.gif';
import UserCardSearch from '../../Components/UserCard/UserCardSearch';
import ProjectCard from '../../Components/UserCard/ProjectCard';
import { findSuggestions } from '../../utils';
import Empty from '../../Media/NotFoundSearch.svg';

function Suggestions({ pathname, users, projects }) {

    const [loading, setLoading] = useState(true);
    const [suggestions, setSuggestions] = useState({});

    useLayoutEffect(() => {
        const allProjectsAndUsers = projects.concat(users);
        setSuggestions(findSuggestions(allProjectsAndUsers, pathname.search));
        setLoading(false);
    }, [users])


    function search(e) {
        setLoading(true);
        if (e.keyCode === 13) {
            const allProjectsAndUsers = projects.concat(users);
            setSuggestions(findSuggestions(allProjectsAndUsers, `?${e.target.value}`));
        }
        setLoading(false);
    }

    return (
        <div>
            <div id={style.mainImage}>
                <div id={style.searchDiv}>
                    <i class="fas fa-search"></i>
                    <input onKeyDown={(e) => search(e)} placeholder='Search for projects or users' id={style.searchInput} />
                </div>
                <svg style={{ position: 'absolute', top: 230 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="#ffffff" fill-opacity="1" d="M0,192L60,192C120,192,240,192,360,202.7C480,213,600,235,720,224C840,213,960,171,1080,160C1200,149,1320,171,1380,181.3L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
                </svg>
            </div>
            {loading ?
                <div className='justifyCenter' id='alignItemsCenter'>
                    <img id={style.loading} src={Loading} />
                    <h1 className='font800'>Loading...</h1>
                </div> :
                <div>
                    {suggestions.projects.length > 0 && <div className='displayFlexColumn' id='alignItemsCenter'>
                        <div className='displayFlex' id='alignItemsCenter'>
                            <h1 className='font800'>Projects ({suggestions.projects.length})</h1>
                        </div>
                        <div id={style.userCards}>
                            {suggestions.projects.map(project => <ProjectCard project={project} />)}
                        </div>
                    </div>}
                    {suggestions.users.length > 0 && <div className='displayFlexColumn' id='alignItemsCenter'>
                        <div className='displayFlex' id='alignItemsCenter'>
                            <h1 className='font800'>Developers ({suggestions.users.length})</h1>
                        </div>
                        <div id={style.userCards}>
                            {suggestions.users.map(user => <UserCardSearch user={user} />)}
                        </div>
                    </div>}
                    {suggestions.projects.length === 0 && suggestions.users.length === 0 &&
                        <div className='displayFlex' id='alignItemsCenter'>
                            <img src={Empty} id={style.empty} />
                            <div>
                                <h1 style={{ marginBottom: '25px' }} className='font800'>Oops... nothing was found.</h1>
                            </div>
                        </div>}
                </div>}
        </div>
    )
}

function mapStateToProps(state) {
    return {
        users: state.users,
        projects: state.projects
    }
}

export default connect(mapStateToProps, null)(Suggestions);