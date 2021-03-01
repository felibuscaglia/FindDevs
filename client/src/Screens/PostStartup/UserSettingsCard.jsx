import React, { useState } from 'react';
import style from './PostStartup.module.css';
import axios from 'axios';
import Loading from '../../Media/Loading.gif';

function UserSettingsCard({ user, projectID }) {

    const [btnTxt, setBtnTxt] = useState('Make founder')

    function makeFounder(userId) {
        setBtnTxt (null);
        axios.post (`http://localhost:5001/users/${user.id}/${projectID}/founders`)
            .then (res => setBtnTxt (<i class="fas fa-check-circle"></i>))
            .catch (err => setBtnTxt ('Founder'))
    }

    return (
        <div style={{ background: user.color, color: user.brightness === 'bright' ? '#fff' : '#000' }} id={style.userDiv}>
            <div>
                <img src={user.profilePic} id={style.PPic} />
                <span className='font800'>@ {user.username}</span>
            </div>
            <span onClick={() => makeFounder (user.id)} style={{ color: user.color, background: user.brightness === 'bright' ? '#fff' : '#000' }} id={style.founder}>{btnTxt ? btnTxt : <img id={style.miniLoading} src={Loading} />}</span>
        </div>
    )
}

export default UserSettingsCard;