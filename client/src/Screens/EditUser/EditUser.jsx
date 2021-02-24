import React, { useLayoutEffect, useState, useEffect } from 'react';
import style from './EditUser.module.css';
import { connect } from 'react-redux';
import Verified from '../../Media/Verification.png';
import GoPremium from '../../Components/GoPremiumPopUp/GoPremium';
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';
import { Hint } from 'react-autocomplete-hint';
import Loading from '../../Media/Loading.gif';
import { BlockPicker } from 'react-color';
import axios from 'axios';
import { getBrightness } from '../../utils';

function EditUser({ user, skills }) {

    const [input, setInput] = useState({
        email: user.email,
        color: user.color,
        gitHub: user.gitHub,
        linkedIn: user.linkedIn,
        twitter: user.twitter,
        description: user.description,
        country: user.country,
        region: user.region
    });
    const [preview, setPreview] = useState(user.profilePic);
    const [selectedSkills, setSelectedSkills] = useState();
    const [errors, setErrors] = useState({});
    const [file, setFile] = useState(null);
    const [btnDisabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useLayoutEffect(() => {
        if (user.username) {
            setPreview(user.profilePic);
            setInput({
                email: user.email,
                color: user.color,
                gitHub: user.gitHub,
                linkedIn: user.linkedIn,
                twitter: user.twitter,
                description: user.description,
                country: user.country,
                region: user.region
            })
            setSelectedSkills(user.skills);
            setLoading(false)
        } else {
            setTimeout (() => {
                window.location.replace ('/error');
            }, 1000)
        }
    }, [user])

    function check(e) {
        setFile(e.target.files[0]);
        setPreview(URL.createObjectURL(e.target.files[0]));
    }

    function addSkill(e) {
        if (e.keyCode === 13) {
            var found = skills.find(skill => skill.label.toLowerCase() === e.target.value.toLowerCase());
            var found2 = selectedSkills.find(skill => skill.label.toLowerCase() === e.target.value.toLowerCase());
            if (found && !found2) {
                setSelectedSkills(selectedSkills.concat(found));
                e.target.value = '';
            }
        }
    }

    function removeSkill(e) {
        setSelectedSkills(selectedSkills.filter(skill => skill.label !== e.target.name))
    }

    function handleInputChange(e) {
        if (e.hex) return setInput({ ...input, color: e.hex });

        if (e.target.name === 'email') {
            if (!(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(e.target.value))) {
                setErrors({ ...errors, email: true });
                setDisabled(true);
            } else {
                setErrors({ ...errors, email: false })
                setDisabled(false);
            }
        }

        setInput({ ...input, [e.target.name]: e.target.value })
    }

    function handleSubmit() {
        setLoading(true);
        input.brightness = getBrightness(input.color);
        const filteredSkills = selectedSkills.map(skill => skill.id);
        input.skills = filteredSkills;
        axios.put(`http://localhost:5001/users/${user.id}`, input)
            .then(res => {
                if (file) {
                    const newForm = new FormData();
                    newForm.append('image', file);
                    const config = {
                        headers: {
                            'content-type': 'multipart/form-data'
                        }
                    };
                    return axios.post(`http://localhost:5001/users/${user.id}/profilePic`, newForm, config);
                } else {
                    window.location.replace(`/user/${user.username}`)
                }
            })
            .then(res => window.location.replace(`/user/${user.username}`))
            .catch(err => setError(true))
    }

    return (
        <div className='displayFlexColumn' id='alignItemsCenter'>
            <div style={{ background: user.color }} id={style.mainImage}>
                <h1 style={{ color: user.brightness === 'bright' ? '#fff' : '#000' }} className='font800'>Edit your profile</h1>
                <svg style={{ position: 'absolute', top: 160 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="#f9f9f9" fill-opacity="1" d="M0,192L60,192C120,192,240,192,360,202.7C480,213,600,235,720,224C840,213,960,171,1080,160C1200,149,1320,171,1380,181.3L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
                </svg>
            </div>
            <div id={style.container}>
                {!loading && <div id={style.form}>
                    <div className='displayFlex' id='alignItemsCenter'>
                        <h2 className='font800'>@{user.username}</h2>
                        {user.isPremium && <img id={style.verification} src={Verified} />}
                    </div>
                    <div style={{ display: user.isPremium ? 'none' : 'block' }} id={style.GPdiv}>
                        <span className='font800'>Verify your FindDevs account and access all the benefits!</span>
                        <GoPremium />
                    </div>
                    <div className='displayFlexColumn' id='alignItemsCenter'>
                        <div className='displayFlex'>
                            <div id={style.imageDiv}>
                                <div style={{ backgroundImage: `url(${preview})` }} id={style.profilePic}></div>
                                <label for={style.fileDrop} id={style.logoLabel}><i class="fas fa-portrait"></i> Upload Image</label>
                                <input onChange={(e) => check(e)} id={style.fileDrop} type='file' />
                                <BlockPicker onChange={(e) => handleInputChange(e)} color={input.color} />
                            </div>
                            <div>
                                <div className={style.inputDiv}>
                                    <span className='font800'>Your email</span>
                                    <span id={style.lowEnphasis}>Keep in mind that it will be the one through which startups will contact you.</span>
                                    <input name='email' style={{ border: errors.email ? '2px solid red' : '2px solid #e7e7e7' }} value={input.email} onChange={(e) => handleInputChange(e)} className={style.biggerInput}></input>
                                    {errors.email && <span className={style.errors}>Please enter a valid email.</span>}
                                </div>
                                <div>
                                    <span className='font800'>Where are you based?</span>
                                    <div>
                                        <CountryDropdown className={style.dropdown} value={input.country} onChange={(val) => setInput({ ...input, country: val })} />
                                        <RegionDropdown className={style.dropdown} country={input.country} value={input.region} onChange={(val) => setInput({ ...input, region: val })} />
                                    </div>
                                </div>
                                <div className={style.inputDiv}>
                                    <span className='font800'>Your bio</span>
                                    <textarea name='description' value={input.description} onChange={(e) => handleInputChange(e)} maxLength='255' className={style.textarea}></textarea>
                                </div>
                            </div>
                        </div>
                        <h3 className='font800' id='giveMargin'>Social profiles</h3>
                        <div id={style.socialDiv}>
                            <div className='displayFlexColumn' id='alignItemsCenter'>
                                <span className='font800'><i class="fab fa-github-square"></i> GitHub</span>
                                <input value={user.gitHub} name='gitHub' onChange={(e) => handleInputChange(e)} className={style.input} />
                            </div>
                            <div className='displayFlexColumn' id='alignItemsCenter'>
                                <span className='font800'><i style={{ color: '#0e76a8' }} class="fab fa-linkedin"></i> LinkedIn</span>
                                <input value={input.linkedIn} name='linkedIn' onChange={(e) => handleInputChange(e)} className={style.input} />
                            </div>
                            <div className='displayFlexColumn' id='alignItemsCenter'>
                                <span className='font800'><i style={{ color: ' #00acee' }} class="fab fa-twitter-square"></i> Twitter</span>
                                <input value={input.twitter} name='twitter' onChange={(e) => handleInputChange(e)} className={style.input} />
                            </div>
                        </div>
                        <h3 className='font800' id='giveLessMargin'>Your skills</h3>
                        <div className='displayFlexColumn' id='alignItemsCenter'>
                            <div id={style.skillDiv} className='displayFlex'>
                                {selectedSkills && selectedSkills.map(skill =>
                                    <div>
                                        <button style={{ background: skill.strongColor, color: skill.softColor }} name={skill.label} onClick={(e) => removeSkill(e)} id={style.skillBtn}><i class="fas fa-times-circle"></i> {skill.label}</button>
                                    </div>
                                )}
                            </div>
                            <Hint options={skills}>
                                <input onKeyDown={(e) => addSkill(e)} style={{ margin: '0px' }} className={style.input} placeholder='Press enter to add a skill' />
                            </Hint>
                        </div>
                    </div>
                    <div>
                        <button onClick={() => window.location.replace(`/user/${user.username}`)} style={{ background: 'black', color: 'white' }} id={style.btn}>Discard changes</button>
                        <button onClick={handleSubmit} disabled={btnDisabled} style={{ background: btnDisabled ? 'gray' : user.color, color: user.brightness === 'bright' ? '#fff' : '#000' }} id={style.btn}>Save changes</button>
                    </div>
                    {error && <div id='giveMargin' style={{ fontWeight: 800 }} class="alert alert-danger" role="alert">
                        Something failed — we are sorry!
                    </div>}
                </div>}
                {loading &&
                    <div id={style.form}>
                        <img src={Loading} />
                    </div>}
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        user: state.userInfo,
        skills: state.allSkills
    }
}

export default connect(mapStateToProps, null)(EditUser);