import React, { useState, useEffect } from 'react';
import style from './AddJob.module.css';
import axios from 'axios';
import { Hint } from 'react-autocomplete-hint';
import { connect } from 'react-redux';
import { Editor } from '@tinymce/tinymce-react';
import Loading from '../../Media/Loading.gif';

function AddJob({ projectID, skills }) {

    const [project, setProject] = useState({});
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [input, setInput] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:5001/projects/${projectID}`)
            .then(projectData => {
                setProject(projectData.data);
                setLoading(false);
            })
            .catch(err => console.log(err))
    }, [])

    function removeSkill(e) {
        setSelectedSkills(selectedSkills.filter(skill => skill.label !== e.target.name))
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

    function handleInputChange(e) {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })
    }

    function handleDescriptionChange(e) {
        setInput({
            ...input,
            description: e.target.getContent()
        })
    }

    function handleSubmit() {
        setLoading (true);
        const justIDs = selectedSkills.map(skill => skill.id);

        if (!input.title || !input.description) return setError('Please complete all the necessary fields.')

        axios.post(`http://localhost:5001/jobs/${project.id}`, { jobInfo: input, skills: justIDs })
            .then(res => window.location.replace(`http://localhost:3000/project/jobPanel/${project.id}`))
            .catch(err => setError('Something failed—we are sorry!'))
    }

    return (
        <div>
            <div id={style.fixedDiv}>
                <div id={style.logoDiv}>
                    <img src={project.logo} id={style.logo} />
                </div>
            </div>
            <div id={style.secondDiv}>
                {!loading ?
                    <div>
                        <h1 className='font800'>Post a job</h1>
                        <div className='displayFlexColumn'>
                            <span className='font600'>Title *</span>
                            <input maxLength='255' name='title' onChange={(e) => handleInputChange(e)} className={style.input} />
                        </div>
                        <div className='displayFlexColumn'>
                            <span className={style.title}>Description *</span>
                            <Editor
                                onChange={(e) => handleDescriptionChange(e)}
                                apiKey='5ltasngibqdlae7csndk86vmlye4eqd8jhk6fsiza0lpz5db'
                                init={{
                                    selector: 'textarea',
                                    content_style: "@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;600;700;800;900&display=swap'); body { font-family: 'Nunito';}",
                                    branding: false,
                                    height: 300,
                                    width: 723,
                                    menubar: false,
                                    plugins: [
                                        'advlist autolink lists link image',
                                        'charmap print preview anchor help',
                                        'searchreplace visualblocks code',
                                        'insertdatetime media table paste wordcount',
                                    ],
                                    toolbar:
                                        'undo redo | formatselect | bold italic | \
                            alignleft aligncenter alignright | \
                            bullist numlist outdent indent'
                                }}
                            />
                        </div>
                        <div id={style.skillDiv}>
                            <span className='font600'>Skills</span>
                            <div className='displayFlex' style={{ maxWidth: '800px', flexWrap: 'wrap' }}>
                                {selectedSkills.map(skill =>
                                    <div>
                                        <button style={{ background: skill.strongColor, color: skill.softColor }} name={skill.label} onClick={(e) => removeSkill(e)} id={style.skillBtn}>{skill.label}</button>
                                    </div>
                                )}
                            </div>
                            <Hint options={skills}>
                                <input onKeyDown={(e) => addSkill(e)} className={style.inputSkill} placeholder='Press enter to add a skill' />
                            </Hint>
                            <span className='advert'>If you don't find your skill, please contact us.</span>
                        </div>
                        <div>
                            <button onClick={handleSubmit} id={style.uploadBtn}>Post job!</button>
                            {error &&
                                <div id={style.alert} class="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            }
                        </div>
                    </div> :
                    <img className='loading' src={Loading} />}
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        skills: state.allSkills
    }
}

export default connect(mapStateToProps, null)(AddJob);