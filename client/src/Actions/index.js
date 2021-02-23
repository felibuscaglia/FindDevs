import axios from 'axios';

export function setSkills() {
    return function (dispatch) {
        return axios.get('http://localhost:5001/skills')
            .then(skillsData => dispatch({ type: 'SET_GLOBAL_SKILLS', payload: skillsData.data }))
            .catch(err => console.log(err))
    }
}

export function setUserInfo(username) {
    return function (dispatch) {
        return axios.get(`http://localhost:5001/users/${username}/`)
            .then(userData => dispatch({ type: 'SET_USER_DATA', payload: userData.data }))
            .catch(err => console.log(err))
    }
}

export function getNotifications(username) {
    return function (dispatch) {
        return axios.get(`http://localhost:5001/users/${username}/`)
            .then(userData => {
                dispatch({ type: 'GET_NOTIFICATIONS', payload: userData.data.notifications })
            })
            .catch(err => console.log(err))
    }
}

export function setProjects() {
    return function (dispatch) {
        return axios.get('http://localhost:5001/projects')
            .then(jobsData => dispatch({ type: 'SET_PROJECTS', payload: jobsData.data }))
            .catch(err => console.log(err))
    }
}

export function getUsers() {
    return function (dispatch) {
        return axios.get('http://localhost:5001/users')
            .then(usersData => dispatch({ type: 'GET_USERS', payload: usersData.data }))
            .catch(err => console.log(err))
    }
}

export function getJobs() {
    return function (dispatch) {
        return axios.get('http://localhost:5001/jobs')
            .then(jobsData => dispatch({ type: 'GET_JOBS', payload: jobsData.data }))
            .catch(err => console.log(err))
    }
}

export function removeFilters(skill) {
    return { type: 'REMOVE_FILTER', payload: skill }
}

export function removeJobFilter (skill) {
    return { type: 'REMOVE_JOB_FILTER', payload: skill }
}

export function selectWorkers(skill) {
    return { type: 'SELECT_WORKERS', payload: skill }
}

export function filterJob (skill) {
    return { type: 'FILTER_JOBS', payload: skill }
}