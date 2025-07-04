import React, { useState } from 'react'
import { getApi } from '../../utils/axiosConfig'

import { Card, CardContent, Typography, Avatar, Grid, Tooltip, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Checkbox } from '@mui/material';
import UserDetailsDialog from '../UserDetailDialog/UserDetailsDialog';
import LoupeIcon from '@mui/icons-material/Loupe';
import { motion } from 'framer-motion';

export default function ProjectOtherDetails({ project, setRefresh }) {

    const api = getApi();
    const userId = localStorage.getItem('userId');

    const [userDetailDialogOpen, setUserDetailDialogOpen] = useState(false);
    const [userDetailUser, setUserDetailsUser] = useState({});
    const [oepn, setOpen] = useState(false);
    const [searchName, setsearchName] = useState('');
    const [searchedNameList, setSearchedNameList] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState();

    const searchUser = (name) => {
        api.get(`/api/v1/user/search/${project.projectId}/${name}`)
            .then((res) => {
                console.log(res.data);
                setSearchedNameList(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const handelSearchName = (name) => {
        // delay for 300ms
        setsearchName(name);
        setTimeout(() => {
            if (name.length > 0) {
                searchUser(name);
            } else {
                setSearchedNameList([]);
            }
        }, 300);
    }

    const resetDialog = () => {
        setsearchName('');
        setSearchedNameList([]);
        setSelectedUserId();
        setOpen(false);
    }


    const handleUserDetailDialogOpen = (user) => {
        setUserDetailsUser(user);
        setUserDetailDialogOpen(true);
    };

    const handleAddUser = () => {
        api.post(`/api/v1/project/${project.projectId}/add-user/${selectedUserId}`)
            .then((res) => {
                console.log(res.data);
                setRefresh(true);
                resetDialog();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const handleToClose = () => {
        resetDialog();
    }

    return (

        <div className='w-100'>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}>
                <Card>
                    <CardContent>
                        <Typography
                            variant="h6"
                            className='d-flex mb-5 justify-content-between align-items-center' >
                            <div className='d-flex align-items-center'>
                                Created By :
                                <Avatar
                                    className='ml-3' style={{ 'cursor': 'pointer' }}
                                    onClick={() => handleUserDetailDialogOpen(project?.projectCreator)}>
                                    {project?.projectCreator?.name[0].toUpperCase()}
                                </Avatar>
                            </div>
                            {
                                userId == project?.projectCreator?.userId &&
                                <IconButton onClick={() => { setOpen(true) }}>
                                    <LoupeIcon sx={{ 'width': '40px', 'height': '40px' }} />
                                </IconButton>
                            }
                        </Typography>

                        {
                            project?.usersAssignedProjectList?.length > 0 &&
                            <Typography
                                variant="h6"
                                className='d-flex mt-3 justify-content-center mb-3'>
                                Users in Project
                            </Typography>
                        }
                        <Grid
                            container
                            direction="column"
                            justifyContent="flex-center"
                            alignItems="start">
                            {

                                project?.usersAssignedProjectList?.map((user) => {
                                    return <Grid key={user.userId} item>
                                        <div className='d-flex justify-content-center align-items-center mb-3'>
                                            <Tooltip title={`#SSDS ${user?.userId}`} placement="top">
                                                <Avatar
                                                    onClick={() => handleUserDetailDialogOpen(user)}
                                                    className='mr-3'
                                                    style={{ 'cursor': 'pointer', 'backgroundColor': 'green' }}>
                                                    {user?.name[0].toUpperCase()}
                                                </Avatar>
                                            </Tooltip>
                                            < Typography variant="body1">
                                                {user?.name}
                                            </Typography>
                                        </div>
                                    </Grid>
                                })
                            }
                        </Grid>

                    </CardContent>
                </Card>
            </motion.div>
            <UserDetailsDialog
                open={userDetailDialogOpen}
                handleToClose={() => setUserDetailDialogOpen(false)}
                user={userDetailUser}
            />
            <AddUserToProjectDialog
                open={oepn}
                handleToClose={handleToClose}
                handleAddUser={handleAddUser}
                searchName={searchName}
                searchedNameList={searchedNameList}
                handelSearchName={handelSearchName}
                selectedUserId={selectedUserId}
                setSelectedUserId={setSelectedUserId}
            />
        </div>
    )
}


function AddUserToProjectDialog({
    open,
    handleToClose,
    handleAddUser,
    searchName,
    searchedNameList,
    handelSearchName,
    selectedUserId,
    setSelectedUserId }) {



    return (
        <div >
            <Dialog
                open={open}
                onClose={handleToClose}
                fullWidth={true}>
                <DialogTitle>Add New User To Project</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <div className='d-flex justify-content-center align-items-center flex-column'>
                            <TextField
                                className='mt-3'
                                label="Name"
                                variant="outlined"
                                value={searchName}
                                onChange={(e) => handelSearchName(e.target.value)}
                            />
                            {
                                searchedNameList && searchedNameList?.length === 0 &&
                                <Typography variant="body1" className='mt-3'>
                                    No User Found
                                </Typography>
                            }
                            {
                                searchedNameList && searchedNameList?.length > 0 &&
                                <Typography variant="body1" className='mt-3'>
                                    {searchedNameList?.length} User Found
                                </Typography>
                            }
                            {
                                searchedNameList && searchedNameList?.length > 0 &&
                                searchedNameList?.map((user) => {
                                    return <div key={user.userId} className='d-flex justify-content-center align-items-center mt-3'>
                                        <Tooltip title={user?.name} placement="top">
                                            <Avatar
                                                className='mr-3'
                                                style={{ 'cursor': 'pointer', 'backgroundColor': 'green' }}>
                                                {user?.name[0].toUpperCase()}
                                            </Avatar>
                                        </Tooltip>
                                        < Typography variant="body1">
                                            {user?.name}
                                        </Typography>
                                        <Checkbox checked={selectedUserId === user.userId} onChange={() => setSelectedUserId(user.userId)} />
                                    </div>
                                })
                            }
                            {
                                searchedNameList && searchedNameList?.length > 0 &&
                                <Button
                                    onClick={handleAddUser}
                                    variant="contained" color="success"
                                    className='mt-3'>
                                    Add User
                                </Button>
                            }
                        </div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleToClose}
                        color="primary" autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
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
