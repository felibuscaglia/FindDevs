import React, { useState, useEffect } from 'react';
import Logo from '../../Media/invertedlogo.png';
import style from './PostStartup.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { BlockPicker } from 'react-color';
import { getBrightness } from '../../utils';
import Loading from '../../Media/Loading.gif';
import UserCard from './UserSettingsCard';
import Confirmation from '../../Components/PopUps/Confirmation';

function ProjectSettings({ user, projectID }) {

    const [input, setInput] = useState({});
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:5001/projects/${projectID}`)
            .then(projectData => {
                console.log(projectData.data.users, 'USERS!')
                setPreview(projectData.data.logo)
                setInput(projectData.data);
            })
            .catch(err => console.log(err))
    }, [])

    function handleInputChange(e) {
        if (e.hex) return setInput({ ...input, mainColor: e.hex });
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })
    }

    function handleSubmit() {
        setLoading(true);
        axios.patch(`http://localhost:5001/projects/${projectID}`, input)
            .then(res => {
                if (file) {
                    const newForm = new FormData();
                    newForm.append('image', file);
                    const config = {
                        headers: {
                            'content-type': 'multipart/form-data'
                        }
                    };
                    return axios.post(`http://localhost:5001/projects/${projectID}/logo`, newForm, config);
                } else return window.location.replace ('/admin/panel')
            })
            .then(res => window.location.replace('/admin/panel'))
            .catch(err => setError(true))
    }

    function check(e) {
        setFile(e.target.files[0]);
        setPreview(URL.createObjectURL(e.target.files[0]));
    }

    return (
        <div className='displayFlex'>
            <div id={style.fixedDiv} >
                <div id={style.logoDivS}>
                    <Link to={`/project/profile/${projectID}`}><img src={input.logo} id={style.invertedLogoSettings} /></Link>
                </div>
            </div>
            <div id={style.secondDiv}>
                <h1 className='font800'>Project Settings</h1>
                <div className='displayFlexColumn'>
                    <span className='font600'>Project name *</span>
                    <input value={input.name} maxLength='255' onChange={(e) => handleInputChange(e)} name='name' className={style.input} />
                </div>
                <div className='displayFlexColumn'>
                    <span className='font600'>Logo *</span>
                    <div id={style.profilePicDiv}>
                        <div id={style.profilePic}><img src={preview} ID={style.logo} /></div>
                        <label for={style.fileDrop} id={style.logoLabel}>
                            <i class="fas fa-cloud-upload-alt"></i> Upload Logo
                        </label>
                        <input onChange={(e) => check(e)} id={style.fileDrop} type='file' />
                    </div>
                </div>
                <div className='displayFlexColumn'>
                    <span style={{ marginBottom: '25px' }} className='font600'>Main color *</span>
                    <BlockPicker onChange={(e) => handleInputChange(e)} color={input.mainColor} triangle={'hide'} />
                </div>
                <div style={{ marginTop: '25px' }} className='displayFlexColumn'>
                    <span className='font600'>Website</span>
                    <input value={input.website} maxLength='255' onChange={(e) => handleInputChange(e)} name='website' className={style.input} />
                </div>
                <div className='displayFlexColumn'>
                    <span className='font600'>Work Zone *</span>
                    <span className='advert'>Keep in mind that it will be your team's designated workspace. It can be a link to Slack,<br /> Flowdock or WebEx, for example.</span>
                    <input value={input.workZone} maxLength='255' onChange={(e) => handleInputChange(e)} value={input.workzone} name='workZone' className={style.input} />
                </div>
                <div id={style.socialDiv}>
                    <div className='displayFlexColumn' id='alignItemsFS'>
                        <span className='font800'><i style={{ color: '#DA552F' }} class="fab fa-product-hunt"></i> Product Hunt</span>
                        <input value={input.productHunt} maxLength='255' name='productHunt' onChange={(e) => handleInputChange(e)} className={style.socialMediaInput} />
                    </div>
                    <div className='displayFlexColumn' id='alignItemsFS'>
                        <span className='font800'><i style={{ color: ' #00acee' }} class="fab fa-twitter-square"></i> Twitter</span>
                        <input value={input.twitter} maxLength='255' name='twitter' onChange={(e) => handleInputChange(e)} className={style.socialMediaInput} />
                    </div>
                    <div className='displayFlexColumn' id='alignItemsFS'>
                        <span className='font800'><i style={{ color: '#0e76a8' }} class="fab fa-linkedin"></i> LinkedIn</span>
                        <input value={input.linkedIn} maxLength='255' name='linkedIn' onChange={(e) => handleInputChange(e)} className={style.socialMediaInput} />
                    </div>
                </div>
                <div className='displayFlexColumn'>
                    <span className='font600'>One-line description *</span>
                    <span className='advert'>Describe your project in just a few words.</span>
                    <input value={input.oneLineDescription} maxLength="100" onChange={(e) => handleInputChange(e)} name='oneLineDescription' className={style.input} />
                </div>
                <div className='displayFlexColumn'>
                    <span className='font600'>Describe your project *</span>
                    <textarea value={input.description} onChange={(e) => handleInputChange(e)} name='description' maxLength="2000" className={style.textarea} />
                </div>
                <div>
                    {input.users && input.users.map(user => !user.userXprojects.isFounder ? <UserCard user={user} projectID={input.id} /> : null)}
                </div>
                {error && <div id={style.alert} class="alert alert-danger" role="alert">Please complete all the necessary fields.</div>}
                {loading && !error ? <img id={style.loading} src={Loading} /> :
                    <div className='displayFlex'>
                        <button onClick={handleSubmit} id={style.uploadBtn}>Update your project</button>
                        <Confirmation project={input} userID={user.id} />
                    </div>}
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        user: state.userInfo
    }
}

export default connect(mapStateToProps, null)(ProjectSettings);