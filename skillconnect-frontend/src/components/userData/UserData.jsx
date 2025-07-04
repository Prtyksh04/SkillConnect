
import React, { useEffect, useState } from 'react'
import './userData.css'
import { Avatar, Button, Card, CardContent, Chip, FormControl, IconButton, InputLabel, ListItem, MenuItem, Select, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { getApi, getAuthApi } from '../../utils/axiosConfig';

export default function UserData({ userData, updateUserData }) {


    const api = getApi();
    const authApi = getAuthApi();
    const [name, setName] = React.useState(userData?.name);
    const [email, setEmail] = React.useState(userData?.email);
    const [experience, setExperience] = React.useState(userData?.experience);
    const [department, setDepartment] = React.useState(userData?.department?.departmentId);

    const [isEditable, setIsEditable] = useState(false);
    const [listOfSkills, setListOfSkills] = React.useState([]);
    const [skillEntered, setSkillEntered] = React.useState('');
    const [departmentList, setDepartmentList] = useState([]);

    useEffect(() => {
        if (userData?.listOfSkills) {
            setListOfSkills(userData?.listOfSkills);
        }

        const fetchDepartmentList = async () => {
            authApi.get('api/v1/department/get-all')
                .then(function (response) {
                    setDepartmentList(response.data);
                })
                .catch(function (error) {
                    if (error.response && error.response.status == 403) {
                        handleNavigateToLogin()
                        return;
                    }
                    setError(error.response.data.message);
                });
        }

        fetchDepartmentList();

    }, [userData])

    const makeEditable = () => {
        if (isEditable)
            setIsEditable(false);
        else
            setIsEditable(true);
    }

    const submitForm = (e) => {
        e.preventDefault();
        const newUserData = {
            name: name,
            email: email,
            departmentId: department,
            experience: experience,
            listOfSkillStrings: listOfSkills.map((skill) => skill.skillName)
        }
        console.log(newUserData);
        updateUserData(newUserData);
        setIsEditable(false);
    }

    const handleDepartmentChange = (event) => {
        setDepartment(event.target.value);
    };


    const addNewSkill = (event) => {
        event.preventDefault();
        setListOfSkills((skills) => [...skills, {
            skillId: skills.length + 1,
            skillName: skillEntered
        }]);
        setSkillEntered('');
    }

    const handleSkillDelete = (skillToDelete) => () => {
        setListOfSkills((skills) => skills.filter((skill) => skill.skillName !== skillToDelete));
    };

    return (
        <Card style={{ 'minWidth': '50%' }}>
            <CardContent >
                <div className='d-flex justify-content-end'>
                    <IconButton onClick={() => { makeEditable() }}>
                        <EditIcon color='success' />
                    </IconButton>
                </div>
                <div className='d-flex justify-content-center mb-3'>
                    <Avatar sx={{ width: 50, height: 50, color: 'white', bgcolor: 'green' }}/>  
                </div>
                <form className='w-100' onSubmit={submitForm}>
                    <div className='d-flex justify-content-center mt-3 flex-column' style={{ 'gap': '20px' }}>
                        <TextField
                            label='Name'
                            id='name'
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            disabled={isEditable ? false : true}
                            fullWidth
                        />
                        <TextField
                            label='Email'
                            id='email'
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            disabled={isEditable ? false : true}
                            fullWidth
                        />
                        <FormControl >
                            <InputLabel id="departmentId">Department</InputLabel>
                            <Select
                                id="departmentId"
                                value={department}
                                label="Department"
                                onChange={handleDepartmentChange}
                                disabled={isEditable ? false : true}>
                                {
                                    departmentList.map((department) => (
                                        <MenuItem key={department.departmentId} value={department.departmentId}>
                                            {department.departmentName}
                                        </MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        <TextField
                            label='Experience'
                            id='experience'
                            value={experience}
                            onChange={(event) => setExperience(event.target.value)}
                            disabled={isEditable ? false : true}
                            fullWidth
                            multiline
                            rows={4}
                        />
                        {
                            <div className="mb-3">
                                <div className="d-flex flex-row">
                                    {
                                        isEditable ?
                                            <FormControl fullWidth className='mr-3'>
                                                <TextField
                                                    id="listOfSkillsRequired"
                                                    label="Skills"
                                                    variant="outlined"
                                                    labelId='listOfSkillsRequired'
                                                    value={skillEntered}
                                                    fullWidth
                                                    disabled={isEditable ? false : true}
                                                    onChange={(event) => setSkillEntered(event.target.value)}
                                                />
                                            </FormControl>
                                            :
                                            <h6 style={{ 'color': 'gray', 'marginLeft': '5px' }}>
                                                Skills List
                                            </h6>
                                    }
                                    {
                                        isEditable &&
                                        <Button variant="contained" color="success" onClick={addNewSkill}>Add</Button>
                                    }
                                </div>
                                <div style={{ 'maxWidth': '100%', 'display': 'flex', 'flexFlow': 'row wrap' }}>
                                    {
                                        listOfSkills?.map((skill) => (
                                            <ListItem key={skill.skillId} style={{ 'width': 'fit-content' }}>
                                                {
                                                    isEditable ?
                                                        <Chip
                                                            label={skill.skillName}
                                                            color="success"
                                                            onDelete={skill.label === 'React' ? undefined : handleSkillDelete(skill.skillName)}
                                                        />
                                                        :
                                                        <Chip
                                                            label={skill.skillName}
                                                            color="success"
                                                        />

                                                }

                                            </ListItem>
                                        ))
                                    }
                                </div>
                            </div>
                        }

                    </div>
                    {
                        isEditable &&
                        <Button type='submit' variant='contained' color='success' className='mt-3'>
                            Save
                        </Button>
                    }
                </form>

            </CardContent>
        </Card>
    );
}


// {
//     "userId": 1,
//     "name": "Raj Singharia",
//     "email": "rajsingharia.1234@gmail.com",
//     "password": "$2a$10$/xdOxZCIKkwtxP9DK31ntet4MI/qV.qV8j3a29LBbfdmE2W5YqTzG",
//     "department": {
//         "departmentId": 7,
//         "departmentName": "Software Development"
//     },
//     "savedPostsId": [
//         1,
//         1
//     ],
//     "experience": null,
//     "listOfSkills": null,
//     "role": "USER",
//     "enabled": true,
//     "credentialsNonExpired": true,
//     "accountNonExpired": true,
//     "username": "rajsingharia.1234@gmail.com",
//     "authorities": [
//         {
//             "authority": "USER"
//         }
//     ],
//     "accountNonLocked": true
// }