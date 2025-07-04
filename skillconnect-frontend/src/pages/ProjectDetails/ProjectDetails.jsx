import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { getApi } from '../../utils/axiosConfig';
import { Alert, Card, CardContent, Typography, Avatar, Grid, IconButton, Button, Dialog, DialogTitle, DialogContent, TextField, Box, Container, FormControl, InputLabel, Select, MenuItem, Slide } from '@mui/material';
import './projectDetails.css';
import ProjectOtherDetails from '../../components/project/ProjectOtherDetails';
import ProjectInfoDetails from '../../components/project/ProjectInfoDetails';
import { Square, Task } from '@mui/icons-material';

import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import Spinner from '../../components/general/spinner/Spinner';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
  });



export default function ProjectDetails() {

    const api = getApi();
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();
    const location = useLocation();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [project, setProject] = useState(null);
    const [refresh, setRefresh] = useState();
    const [open, setOpen] = useState(false);
    const [taskList, setTaskList] = useState([]);
    const [usersAssignedProjectList, setUsersAssignedProjectList] = useState([]);



    const projectId = location.pathname.split('/')[2];



    const createNewTask = (task) => {
        api.post(`api/v1/task/${projectId}/add-new-task`, task)
            .then(function (response) {
                console.log(response.data);
                setRefresh(true);
                setOpen(false);
            })
            .catch(function (error) {
                if (error.response && error.response.status == 403) {
                    handleNavigateToLogin();
                    return;
                }
                setError(error.response.data.message);
            });
    }

    const openNewTaskDialog = () => {
        setOpen(true);
    }


    const handleNavigateToLogin = () => {
        navigate('/login', { replace: true, state: { alert: 'You need to login first' } });
    }


    useEffect(() => {

        const fetchProject = async () => {

            setIsLoading(true);

            api.get(`/api/v1/project/${projectId}`)
                .then(function (response) {
                    console.log(response.data);
                    setProject(response.data);
                    setUsersAssignedProjectList(response?.data?.usersAssignedProjectList);
                })
                .catch(function (error) {
                    if (error.response && error.response.status == 403) {
                        handleNavigateToLogin();
                        return;
                    }
                    setError(error.response.data.message);
                })
                .finally(function () {
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 1000);
                });

            api.get(`/api/v1/task/all/${projectId}`)
                .then(function (response) {
                    console.log(response.data);
                    const taskList = response.data;

                    //for testing add same task again 10 times
                    // for (let i = 0; i < 10; i++) {
                    //     taskList.push(taskList[response.data.length - 1]);
                    // }

                    setTaskList(taskList);
                })
                .catch(function (error) {
                    if (error.response && error.response.status == 403) {
                        handleNavigateToLogin();
                        return;
                    }
                    setError(error.response.data.message);
                });

        }

        fetchProject();
    }, [refresh]);


    return (
        <>
            {
                isLoading &&
                <div className='d-flex justify-content-center'>
                    <div className='loading-body'>
                        <h6>Loading</h6>
                        <Spinner />
                    </div>
                </div>
            }
            {
                error &&
                <div className='d-flex justify-content-center mt-5'>
                    <Alert severity="error">{error}</Alert>
                </div >
            }
            {
                !isLoading && !error && project &&
                <div className='project-detail-body'>
                    <div className='project-other-details'>
                        <ProjectOtherDetails
                            project={project}
                            setRefresh={setRefresh}
                        />
                    </div>
                    <div className='project-details'>
                        {
                            userId == project?.projectCreator?.userId &&
                            <div className='d-flex justify-content-end'>
                                <Button
                                    onClick={openNewTaskDialog}
                                    startIcon={<AddToPhotosIcon />}
                                    color='success'>
                                    <b>
                                        Create New Task
                                    </b>
                                </Button>
                            </div>
                        }
                        <ProjectInfoDetails
                            isLoading={isLoading}
                            error={error}
                            project={project}
                            taskList={taskList}
                            setRefresh={setRefresh} />
                    </div>
                </div>
            }
            {
                <CreateNewTaskDialog
                    open={open}
                    handleClose={() => setOpen(false)}
                    createNewTask={createNewTask}
                    usersAssignedProjectList={usersAssignedProjectList}
                />
            }
        </>
    )
}


const CreateNewTaskDialog = ({ open, handleClose, createNewTask, usersAssignedProjectList }) => {

    const [taskAssignedUserId, setTaskAssignedUserId] = useState('');

    const submitForm = (event) => {
        event.preventDefault();
        handleClose();
        const task = {
            taskTitle: event.target.taskTitle.value,
            taskDescription: event.target.taskDescription.value,
            taskAssignedUserId: taskAssignedUserId
        }
        createNewTask(task);
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            TransitionComponent={Transition}>
            <DialogTitle><b>Create New Task</b></DialogTitle>
            <DialogContent>
                <form onSubmit={submitForm} className='d-flex flex-column'>
                    <div className='mt-4'>
                        <TextField
                            id="taskTitle"
                            label="Task Title"
                            variant="outlined"
                            fullWidth
                        />
                    </div>
                    <div className='mt-4'>
                        <TextField
                            id="taskDescription"
                            label="Task Description"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                        />
                    </div>
                    <div className='mt-4'>
                        <FormControl fullWidth >
                            <InputLabel id="taskAssignedUser">Task Assigned User</InputLabel>
                            <Select
                                labelId="taskAssignedUser"
                                id="taskAssignedUser"
                                value={taskAssignedUserId}
                                label="Task Assigned User"
                                onChange={(event) => setTaskAssignedUserId(event.target.value)}>
                                {
                                    usersAssignedProjectList.map(user => {
                                        return (
                                            <MenuItem
                                                key={user.userId}
                                                value={user.userId}>
                                                {`#${user.userId} ${user.name}`}
                                            </MenuItem>
                                        )
                                    })
                                }
                            </Select>
                        </FormControl>
                    </div>
                    <div className='mt-4 d-flex justify-content-center'>
                        <Button
                            variant="contained"
                            color="success"
                            type="submit">
                            Create
                        </Button>
                    </div>
                </form>
                <div className='d-flex justify-content-end mt-3'>
                    <Button
                        onClick={handleClose}
                        color='success'
                        className='mt-3'>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}


/*

{
    "projectId": 1,
    "projectCreator": {
        "userId": 1,
        "name": "test",
        "email": "test@gmail.com",
        "password": "$2a$10$2PQlL.QBmXRB2wK.0eyOLOLxdQp.WNy4zX1ryQ8tWmnwVBG8DkX2e",
        "departmentName": "IT",
        "joiningDate": "2023-06-14T18:30:00.000+00:00",
        "role": "USER",
        "enabled": true,
        "accountNonLocked": true,
        "credentialsNonExpired": true,
        "accountNonExpired": true,
        "username": "test@gmail.com",
        "authorities": [
            {
                "authority": "USER"
            }
        ]
    },
    "projectName": "Andorid Clock App",
    "projectDetails": "For the next phase of the Android Clock app project, the focus will be on enhancing user experience and expanding functionality. This includes refining the alarm feature with additional customization options, improving the timer functionality for better precision, and integrating new features like a stopwatch and sleep tracker. The goal is to create a comprehensive and user-centric time management app that meets the evolving needs of Android users.",
    "startDate": "2023-06-16T18:30:00.000+00:00",
    "endDate": "2023-06-29T18:30:00.000+00:00",
    "isFinished": false,
    "departmentName": "Android",
    "usersAssignedProjectList": []
}


*/