import { Autocomplete, Chip, FormControl, InputLabel, ListItem, MenuItem, Select, TextField, Button } from "@mui/material";
import { getApi } from "../../utils/axiosConfig";

import React, { useEffect } from 'react'

export default function CreatePostForm({ setPostCreated, setError, handleNavigateToLogin, handleToClose }) {

    const api = getApi();

    const [selectedProjectId, setSelectedProjectId] = React.useState('');
    const [openProjects, setOpenProjects] = React.useState([]);
    const [priority, setPriority] = React.useState(0);
    const [listOfSkillsRequired, setListOfSkillsRequired] = React.useState([]);
    const [skillEntered, setSkillEntered] = React.useState(null);
    const [skillSuggestions, setSkillSuggestions] = React.useState([]);


    useEffect(() => {

        const getOpenProjects = async () => {
            api.get(`api/v1/project/all-open`)
                .then(function (response) {
                    setOpenProjects(response.data);
                })
                .catch(function (error) {
                    if (error.response && error.response.status == 403) {
                        handleNavigateToLogin();
                        return;
                    }
                    setError(error.response.data.message);
                });
        }

        getOpenProjects();

    }, []);

    useEffect(() => {

        const getSkillSuggestions = async () => {

            const skillName = skillEntered == '' ? null : skillEntered;

            api.get(`api/v1/skill/search/${skillName}`)
                .then(function (response) {
                    setSkillSuggestions(response.data);
                })
                .catch(function (error) {
                    if (error.response && error.response.status == 403) {
                        handleNavigateToLogin();
                        return;
                    }
                    setError(error.response.data.message);
                });
        }

        getSkillSuggestions();

    }, [skillEntered]);



    const createNewPost = (event) => {
        event.preventDefault();

        const postTitle = event.target.postTitle.value;
        const postDescription = event.target.postDescription.value;
        const projectName = event.target.projectName.value;
        const projectId = openProjects.find((project) => project.projectName == projectName).projectId;



        const post = {
            projectId: projectId,
            postTitle: postTitle,
            postDescription: postDescription,
            urgencyLevel: priority,
            listOfSkillStringsRequired: listOfSkillsRequired,
        }

        console.log(post);

        api.post(`api/v1/post/create`, post)
            .then(function (response) {
                setPostCreated(true);
                handleToClose();
            })
            .catch(function (error) {
                if (error.response && error.response.status == 403) {
                    handleNavigateToLogin();
                    return;
                }
                setError(error.response.data.message);
            });

    }

    const handleChangePriority = (event) => {
        setPriority(event.target.value);
    };

    const handleProjectChange = (event) => {
        console.log(event.target.value);
        setSelectedProjectId(openProjects.find((project) => project.projectName == event.target.value).projectId);
    };

    const addNewSkill = (event) => {
        event.preventDefault();
        setListOfSkillsRequired((skills) => [...skills, skillEntered]);
        setSkillEntered('');
    }

    const handleSkillDelete = (skillToDelete) => () => {
        setListOfSkillsRequired((skills) => skills.filter((skill) => skill !== skillToDelete));
    };

    const handleSkillSuggestionsClick = (skill) => {
        setListOfSkillsRequired((skills) => [...skills, skill.skillName]);
        setSkillEntered('');
    }


    return (
        <form onSubmit={createNewPost}>
            <div className="d-flex flex-column w-100">
                <div className="mb-3">
                    <FormControl fullWidth>
                        <TextField
                            id="postTitle"
                            label="Title"
                            variant="outlined"
                            labelId='postTitle'
                        />
                    </FormControl>
                </div>

                <div className="mb-3">
                    <FormControl fullWidth>
                        <TextField
                            id="postDescription"
                            label="Description"
                            variant="outlined"
                            labelId='postDescription'
                            multiline
                            rows={3}
                        />
                    </FormControl>
                </div>

                <div className="mb-3">
                    <FormControl fullWidth>
                        <Autocomplete
                            disablePortal
                            id="projectName"
                            options={openProjects}
                            renderInput={(params) => <TextField {...params} label="Project" />}
                            getOptionLabel={(option) => option.projectName}
                        />
                    </FormControl>

                </div>

                <div className="mb-3">
                    <div className="d-flex flex-row">
                        <FormControl fullWidth>

                            <div className='d-flex flex-row'>
                                <TextField
                                    id="listOfSkillsRequired"
                                    label="Skills"
                                    variant="outlined"
                                    labelId='listOfSkillsRequired'
                                    value={skillEntered}
                                    fullWidth 
                                    className='mr-3'
                                    onChange={(event) => setSkillEntered(event.target.value)}
                                />
                                <Button variant="contained" color="success" onClick={addNewSkill}>Add</Button>
                            </div>
                            {
                                skillSuggestions.length > 0 &&
                                <div className='mt-1'>Suggestions:</div>
                            }
                            {
                                skillSuggestions.length > 0 &&
                                <div className="d-flex flex-row mt-1" style={{ 'maxWidth': '100%', 'flexFlow': 'row wrap', 'backgroundColor':'lightGray' }}>
                                    {
                                        skillSuggestions.map((skill) => (
                                            <ListItem key={skill.skillId} style={{ 'width': 'fit-content' }}>
                                                <Chip
                                                    label={skill.skillName}
                                                    color="success"
                                                    onClick={() => handleSkillSuggestionsClick(skill)}
                                                />
                                            </ListItem>
                                        ))
                                    }
                                </div>
                            }
                        </FormControl>
                    </div>
                    <div style={{ 'maxWidth': '100%', 'display': 'flex', 'flexFlow': 'row wrap' }}>
                        {
                            listOfSkillsRequired.map((skill, i) => (
                                <ListItem key={i} style={{ 'width': 'fit-content' }}>
                                    <Chip
                                        label={skill}
                                        color="success"
                                        onDelete={skill.label === 'React' ? undefined : handleSkillDelete(skill)}
                                    />
                                </ListItem>
                            ))
                        }
                    </div>
                </div>

                <div className="mb-3">
                    <FormControl fullWidth>
                        <InputLabel id="urgencyLevel">Priority</InputLabel>
                        <Select
                            labelId="urgencyLevel"
                            id="urgencyLevel"
                            value={priority}
                            label="Priority"
                            onChange={handleChangePriority}>
                            <MenuItem value={0}>Low</MenuItem>
                            <MenuItem value={1}>Medium</MenuItem>
                            <MenuItem value={2}>High</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                <Button variant="contained" color="success" type="submit" >Submit</Button>
            </div>
        </form >
    )
}



