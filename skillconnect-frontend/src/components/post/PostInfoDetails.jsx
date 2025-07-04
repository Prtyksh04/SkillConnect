
import React, { useState } from 'react'
import { getApi } from '../../utils/axiosConfig';
import { Alert, Avatar, Button, Card, CardContent, Chip, Grid, Tooltip } from '@mui/material';
import { TimeStampToDate } from '../../utils/Helper';
import { Link } from 'react-router-dom';
import UserDetailsDialog from '../UserDetailDialog/UserDetailsDialog';
import { motion } from 'framer-motion';

export default function PostInfoDetails({ isLoading, error, post }) {

    const api = getApi();
    const userId = localStorage.getItem('userId');

    const [userDetailDialogOpen, setUserDetailDialogOpen] = useState(false);
    const [userDetailUser, setUserDetailsUser] = useState({});

    const handleUserDetailDialogOpen = (user) => {
        setUserDetailsUser(user);
        setUserDetailDialogOpen(true);
    };


    const findUrgencyLevel = (urgencyLevel) => {
        switch (urgencyLevel) {
            case 0: return "Low";
            case 1: return "Medium";
            case 2: return "High";
            default: return "Low";
        }
    }

    const hasAppliedBefore = () => {
        console.log(userId);
        console.log(post?.listOfApplicants?.map(user => user.userId));
        if (post?.listOfApplicants?.map(user => user.userId)?.find(id => id == userId)) {
            console.log('has applied before');
            return true;
        }
        return false;
    }

    const isCreatorOfProject = () => {
        return (userId == post.project.projectCreator.userId);
    }

    const isInProject = () => {
        if (isCreatorOfProject()) return true;
        if (post.project.usersAssignedProjectList.map(user => user.userId)?.find(id => id == userId)) return true;
        return false;
    }

    const applyToPost = () => {
        api.post(`api/v1/post/${post.postId}/apply`)
            .then((response) => {
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const acceptApplication = (userId) => () => {
        api.post(`api/v1/post/${post.postId}/approve/${userId}`)
            .then(function (response) {
                window.location.reload();
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <div style={{ 'minHeight': '250px' }}>
            {
                isLoading &&
                <div
                    className='d-flex justify-content-center align-items-center w-100 h-100'
                    style={{ 'backgroundColor': 'gray', 'borderRadius': '8px' }}>
                    <Alert severity="info" >Loading Post Details</Alert>
                </div>
            }
            {
                error &&
                <div
                    className='d-flex justify-content-center align-items-center w-100 h-100'
                    style={{ 'backgroundColor': 'gray', 'borderRadius': '8px' }}>
                    <Alert severity="error" >{error}</Alert>
                </div>
            }
            {
                !isLoading && !error &&
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <Card>
                        <CardContent>

                            <div >
                                <div className='mb-4'>
                                    <div className='d-flex justify-content-between'>
                                        <h3 className="card-title fw-bold">{post?.postTitle}</h3>
                                        {
                                            post?.isOpen ?
                                                <Chip
                                                    label="OPEN"
                                                    color="success"
                                                    variant="outlined"
                                                    sx={{ 'fontFamily': 'monospace', 'fontSize': '1rem', 'fontWeight': 'bold', 'letterSpacing': '1px' }}
                                                />
                                                :
                                                <Chip
                                                    label="CLOSED"
                                                    color="error"
                                                    variant="outlined"
                                                    sx={{ 'fontFamily': 'monospace', 'fontSize': '1rem', 'fontWeight': 'bold', 'letterSpacing': '1px' }}
                                                />
                                        }
                                    </div>
                                </div>

                                <div className='mb-2'>
                                    <p className="card-subtitle"
                                        style={{ 'color': 'grey', 'fontWeight': '400' }}>
                                        <b style={{ 'color': 'black' }}>● Posted On: </b>
                                        {TimeStampToDate(post?.createdOn)}
                                    </p>
                                </div>

                                <div className='mb-4'>
                                    <p className="card-subtitle"
                                        style={{ 'color': 'grey', 'fontWeight': '400' }}>
                                        <b style={{ 'color': 'black' }}>● Urgency Level: </b>
                                        {findUrgencyLevel(post?.urgencyLevel)}
                                    </p>
                                </div>



                                <div className='mb-4'>
                                    <p className="card-text">{post?.postDescription}</p>
                                </div>


                                <div className='mb-4'
                                    style={{ 'backgroundColor': '#23c552', 'padding': '8px', 'borderRadius': '10px', 'width': 'fit-content' }}>

                                    <Link
                                        to={`/project/${post?.project?.projectId}`}
                                        style={{ 'textDecoration': 'none', 'color': 'white' }}>
                                        <b>Project: </b>
                                        {post?.project?.projectName}
                                    </Link>
                                </div>

                            </div>

                            <div className="mt-2">
                                <Grid container
                                    direction="row"
                                    justifyContent="flex-start"
                                    alignItems="center"
                                    gap={1}>
                                    {
                                        post?.listOfSkillsRequired && post?.listOfSkillsRequired?.map((skill) => {
                                            return <Grid
                                                key={skill.skillId}>
                                                <Chip
                                                    label={skill.skillName}
                                                    color='success' />
                                            </Grid>
                                        })
                                    }
                                </Grid>
                            </div>
                            {
                                post?.isOpen && !isInProject() && !hasAppliedBefore() &&
                                <div className='mt-4'>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        size='large'
                                        onClick={applyToPost}
                                        fullWidth>
                                        Apply
                                    </Button>
                                </div>
                            }
                            {
                                hasAppliedBefore() &&
                                < div className='mt-4'>
                                    <h6>
                                        You have already applied for this post
                                    </h6>
                                </div>
                            }
                            {
                                post?.isOpen && post?.listOfApplicants?.length > 0 &&
                                <div >
                                    {
                                        isCreatorOfProject() &&
                                        <h6 className='mt-4'>{post?.listOfApplicants?.length} People have applied for this post</h6>
                                    }
                                    <div className='d-flex flex-wrap'>
                                        {
                                            post?.listOfApplicants?.map((user) => {
                                                return <div key={user.userId} className='d-flex flex-row m-1 align-items-center' >
                                                    <Tooltip title={user.name} placement="top">
                                                        <Avatar
                                                            className='mr-2'
                                                            onClick={() => handleUserDetailDialogOpen(user)}>
                                                            {user?.name[0].toUpperCase() ?? '?'}
                                                        </Avatar>
                                                    </Tooltip>
                                                    <h6 className='mr-3'>{user.name}</h6>
                                                    {
                                                        isCreatorOfProject() &&
                                                        <Button
                                                            variant="contained"
                                                            color="success"
                                                            size='small'
                                                            onClick={acceptApplication(user.userId)}>
                                                            Accept
                                                        </Button>
                                                    }

                                                </div>
                                            })
                                        }
                                    </div>

                                </div>
                            }
                        </CardContent>
                    </Card>
                </motion.div>
            }
            <UserDetailsDialog
                open={userDetailDialogOpen}
                handleToClose={() => setUserDetailDialogOpen(false)}
                user={userDetailUser}
            />
        </div >
    );
}

// {
//     "postId": 1,
//     "postTitle": "Need Spring boot Dev",
//     "postDescription": "We are currently seeking a skilled Spring developer to join our team and contribute to the development of the backend for our chat app. The ideal candidate should have experience in building scalable and high-performance applications using Spring Boot and related technologies.",
//     "urgencyLevel": 2,
//     "user": {
//         "userId": 1,
//         "name": "Raj Singharia",
//         "email": "rajsingharia.1234@gmail.com",
//         "password": "$2a$10$oddUdw5A4GBpPx.cUCTRr.7kn6.PwjtBd1wgOrhFv03Se0DMV9mPu",
//         "department": {
//             "departmentId": 1,
//             "departmentName": "Mobile Communications"
//         },
//         "savedPosts": [],
//         "role": "USER",
//         "enabled": true,
//         "username": "rajsingharia.1234@gmail.com",
//         "authorities": [
//             {
//                 "authority": "USER"
//             }
//         ],
//         "accountNonExpired": true,
//         "credentialsNonExpired": true,
//         "accountNonLocked": true
//     },
//     "project": {
//         "projectId": 1,
//         "projectCreator": {
//             "userId": 1,
//             "name": "Raj Singharia",
//             "email": "rajsingharia.1234@gmail.com",
//             "password": "$2a$10$oddUdw5A4GBpPx.cUCTRr.7kn6.PwjtBd1wgOrhFv03Se0DMV9mPu",
//             "department": {
//                 "departmentId": 1,
//                 "departmentName": "Mobile Communications"
//             },
//             "savedPosts": [],
//             "role": "USER",
//             "enabled": true,
//             "username": "rajsingharia.1234@gmail.com",
//             "authorities": [
//                 {
//                     "authority": "USER"
//                 }
//             ],
//             "accountNonExpired": true,
//             "credentialsNonExpired": true,
//             "accountNonLocked": true
//         },
//         "projectName": "Chat App",
//         "projectDetails": "In the next phase of the chat app backend project, the main objectives are scalability and performance optimization. This involves implementing a distributed architecture to handle increasing user load, improving real-time communication through WebSocket integration, and enhancing database management for efficient data storage and retrieval. Additionally, security measures like encryption and authentication will be strengthened, and new features like message search and user analytics will be developed to further enhance the chat app's functionality and user experience.",
//         "startDate": "2023-06-19T00:00:00.000+00:00",
//         "endDate": "2023-06-30T00:00:00.000+00:00",
//         "isFinished": false,
//         "department": {
//             "departmentId": 1,
//             "departmentName": "Mobile Communications"
//         },
//         "usersAssignedProjectList": [
//             {
//                 "userId": 1,
//                 "name": "Raj Singharia",
//                 "email": "rajsingharia.1234@gmail.com",
//                 "password": "$2a$10$oddUdw5A4GBpPx.cUCTRr.7kn6.PwjtBd1wgOrhFv03Se0DMV9mPu",
//                 "department": {
//                     "departmentId": 1,
//                     "departmentName": "Mobile Communications"
//                 },
//                 "savedPosts": [],
//                 "role": "USER",
//                 "enabled": true,
//                 "username": "rajsingharia.1234@gmail.com",
//                 "authorities": [
//                     {
//                         "authority": "USER"
//                     }
//                 ],
//                 "accountNonExpired": true,
//                 "credentialsNonExpired": true,
//                 "accountNonLocked": true
//             }
//         ]
//     },
//     "listOfSkillsRequired": [
//         "Spring Boot",
//         "SQL",
//         "Spring Security"
//     ],
//     "listOfApplicants": [],
//     "totalApplicants": 0,
//     "isOpen": true,
//     "createdOn": "2023-06-19T05:39:59.843+00:00"
// }



