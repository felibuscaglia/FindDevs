import React, { useLayoutEffect, useEffect } from 'react';
import style from './HeaderUser.module.css';
import Logo from '../../Media/logo.png';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from 'react-router-dom';
import jwt from 'jsonwebtoken';
import { connect } from 'react-redux';
import axios from 'axios';
import Register from '../PopUps/RegisterPopUp';
import SearchBar from './SearchBar';

function HeaderUser(props) {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorEl2, setAnchorEl2] = React.useState(null);
    const [deleted, setDeleted] = React.useState([]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick2 = (event) => {
        setAnchorEl2(event.currentTarget);
    };

    const handleClose2 = () => {
        setAnchorEl2(null);
    };

    async function acceptInvitation(notification) {
        var message = `🤝 ${props.userInfo.username} is now part of ${notification.projectName} 🤝`;

        try {
            await axios.post(`http://localhost:5001/users/${props.userInfo.username}/project/${notification.projectId}`, { jobTitle: notification.jobTitle });
            await axios.post(`http://localhost:5001/users/${notification.ownerUsername}/notifications`, { content: message, type: 'Joined' });
            await axios.delete(`http://localhost:5001/jobs/${notification.jobId}`);
            await axios.delete(`http://localhost:5001/users/${props.userInfo.id}/notifications/${notification.id}`)
            window.location.replace('/admin/panel');
        } catch (err) {
            console.log(err);
        }
    }

    async function rejectInvitation(notificationid, userId) {
        try {
            await axios.delete(`http://localhost:5001/users/${userId}/notifications/${notificationid}`);
            setDeleted(deleted.concat(notificationid))
        } catch (err) {
            console.log(err);
        }
    }

    function changeScreen() {
        props.userInfo.username ? window.location.replace(`/user/${props.userInfo.username}`) : window.location.replace('/');
    }

    function logOut() {
        localStorage.removeItem('user');
        window.location.replace('/');
    }

    if (props.pathname.pathname.indexOf('/project/settings') === -1 && props.pathname.pathname.indexOf('/project/members') === -1 && props.pathname.pathname !== '/' && props.pathname.pathname !== '/project/post' && props.pathname.pathname !== '/admin/panel' && props.pathname.pathname.indexOf('project/jobPanel') !== 1 && props.pathname.pathname.indexOf('project/addJob') !== 1) {
        return (
            <div id={style.header}>
                <img onClick={changeScreen} style={{ cursor: 'pointer' }} src={Logo} id='icon' />
                <div className='displayFlex' id='alignItemsCenter'>
                    {props.pathname.pathname !== '/suggestions' && <SearchBar />}
                    {props.userInfo.username ?
                        <div id={style.dropdownDiv}>
                            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                                <i id='popUpIcn' class="fas fa-bell"></i>
                                {props.notifications && props.notifications.length > 0 && <i id={style.alert} class="fas fa-circle"></i>}
                            </Button>
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                                className={style.notificationDiv}
                            >
                                {props.notifications && props.notifications.map(notification =>
                                    <MenuItem style={{ display: deleted.includes(notification.id) ? 'none' : 'block' }} id='alignItemsFS' className='displayFlexColumn'>
                                        <div className='displayFlex' id='alignItemsCenter'>
                                            <img onClick={() => window.location.replace(`/project/profile/${notification.projectId}`)} src={notification.projectLogo} id={style.icon} />
                                            <span className='font800'>{notification.content}</span>
                                            {notification.type === 'Invitation' ?
                                                <div>
                                                    <button onClick={() => acceptInvitation(notification)} style={{ color: 'green' }} className={style.dropdownBtn}><i class="fas fa-check-circle"></i></button>
                                                    <button onClick={() => rejectInvitation(notification.id, notification.userId)} style={{ color: 'red' }} className={style.dropdownBtn}><i class="fas fa-times-circle"></i></button>
                                                </div> :
                                                <button onClick={() => rejectInvitation(notification.id, notification.userId)} style={{ color: 'red' }} className={style.dropdownBtn}><i class="fas fa-times-circle"></i></button>
                                            }
                                        </div>
                                    </MenuItem>
                                )}
                            </Menu>
                            <div>
                                <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick2}>
                                    <div className='displayFlex' id='alignItemsCenter'>
                                        <div style={{ backgroundImage: `url(${props.userInfo.profilePic})` }} id={style.profilePic}></div>
                                    </div>
                                </Button>
                                <Menu
                                    id="simple-menu"
                                    anchorEl={anchorEl2}
                                    keepMounted
                                    open={Boolean(anchorEl2)}
                                    onClose={handleClose2}
                                    className={style.notificationDiv}
                                >
                                    <MenuItem onClick={() => window.location.replace('/edit/user/me')}>
                                        <div class={style.dropdown}>
                                            <span>Edit your profile</span>
                                        </div>
                                    </MenuItem>
                                    <Link to='/admin/panel' className='links'>
                                        <MenuItem>
                                            <div class={style.dropdown}>
                                                <span>Your startups</span>
                                            </div>
                                        </MenuItem>
                                    </Link>
                                    <MenuItem onClick={logOut}>
                                        <div class={style.dropdown}>
                                            <span>Log out</span>
                                        </div>
                                    </MenuItem>
                                    <hr id='line'></hr>
                                    <Link className='links' to='/project/post'><button id={style.postBtn}>Post a project</button></Link>
                                </Menu>
                            </div>
                        </div> :
                        <div>
                            <Register isHomepage={false} />
                        </div>}
                </div>
            </div>
        )
    } else return null;
}



function mapStateToProps(state) {
    return {
        userInfo: state.userInfo,
        notifications: state.notifications
    }
}

export default connect(mapStateToProps, null)(HeaderUser);