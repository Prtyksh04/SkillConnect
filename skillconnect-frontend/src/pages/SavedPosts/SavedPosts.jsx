
import React, { useEffect, useState } from 'react'
import { getApi } from '../../utils/axiosConfig'
import { Alert, Box, Grid, } from '@mui/material'
import SavedPostCard from '../../components/post/SavedPostCard'
import Spinner from '../../components/general/spinner/Spinner'
import { motion } from 'framer-motion'

export default function SavedPosts() {

    const [savedPosts, setSavedPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const api = getApi();

    useEffect(() => {

        setLoading(true);

        const fetchSavedPosts = async () => {
            api.get('/api/v1/user/get-all-saved-posts-details')
                .then((res) => {
                    console.log(res.data);
                    const data = res.data;
                    //for testing purpose adding same data 10 times
                    // for (let i = 0; i < 10; i++) {
                    //     data.push(res.data[0]);
                    // }
                    setSavedPosts(data);
                })
                .catch((err) => {
                    setError(true);
                })
                .finally(() => {
                    setTimeout(() => {
                        setLoading(false);
                    }, 1000);
                    //setLoading(false);
                })
        }
        fetchSavedPosts();
    }, [])

    const randomWidth = () => {
        return Math.floor(Math.random() * 4 + 4)
    }


    return (
        <>
            {
                loading &&
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
                </div>

            }
            {
                !loading && !error && savedPosts.length === 0 &&
                <Alert severity="info">No saved posts</Alert>
            }
            {
                !loading && !error && savedPosts.length > 0 &&
                <div className='w-100'>
                    {
                        <Box sx={{ flexGrow: 1 }}>
                            <Grid container spacing={2}>
                                {
                                    savedPosts?.map((post, idx) => {
                                        return < Grid
                                            item xs={6}>
                                            <motion.div
                                                key={post.postId}
                                                initial={{ opacity: 0, y: 50 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 * idx }}>
                                                <SavedPostCard
                                                    post={post} />
                                            </motion.div>
                                        </Grid>

                                    })
                                }
                            </Grid>
                        </Box>
                    }
                </div >
            }
        </>
    )
}


// [
//     {
//         "postId": 1,
//         "postTitle": "Need Spring boot Dev",
//         "postDescription": "We are currently seeking a skilled Spring developer to join our team and contribute to the development of the backend for our chat app. The ideal candidate should have experience in building scalable and high-performance applications using Spring Boot and related technologies.\nResponsibilities will include designing and implementing the backend architecture, integrating with third-party APIs for real-time communication, and ensuring efficient data management and storage. The developer will collaborate closely with the frontend team to establish smooth communication channels and implement necessary features.",
//         "urgencyLevel": 2,
//         "user": {
//             "userId": 1,
//             "name": "Raj Singharia",
//             "email": "rajsingharia.1234@gmail.com",
//             "password": "$2a$10$/xdOxZCIKkwtxP9DK31ntet4MI/qV.qV8j3a29LBbfdmE2W5YqTzG",
//             "department": {
//                 "departmentId": 7,
//                 "departmentName": "Software Development"
//             },
//             "savedPostsId": [
//                 1,
//                 1
//             ],
//             "role": "USER",
//             "enabled": true,
//             "authorities": [
//                 {
//                     "authority": "USER"
//                 }
//             ],
//             "username": "rajsingharia.1234@gmail.com",
//             "accountNonLocked": true,
//             "credentialsNonExpired": true,
//             "accountNonExpired": true
//         },
//         "project": {
//             "projectId": 1,
//             "projectCreator": {
//                 "userId": 1,
//                 "name": "Raj Singharia",
//                 "email": "rajsingharia.1234@gmail.com",
//                 "password": "$2a$10$/xdOxZCIKkwtxP9DK31ntet4MI/qV.qV8j3a29LBbfdmE2W5YqTzG",
//                 "department": {
//                     "departmentId": 7,
//                     "departmentName": "Software Development"
//                 },
//                 "savedPostsId": [
//                     1,
//                     1
//                 ],
//                 "role": "USER",
//                 "enabled": true,
//                 "authorities": [
//                     {
//                         "authority": "USER"
//                     }
//                 ],
//                 "username": "rajsingharia.1234@gmail.com",
//                 "accountNonLocked": true,
//                 "credentialsNonExpired": true,
//                 "accountNonExpired": true
//             },
//             "projectName": "Chat App Backend",
//             "projectDetails": "In the next phase of the chat app backend project, the main objectives are scalability and performance optimization. This involves implementing a distributed architecture to handle increasing user load, improving real-time communication through WebSocket integration, and enhancing database management for efficient data storage and retrieval. Additionally, security measures like encryption and authentication will be strengthened, and new features like message search and user analytics will be developed to further enhance the chat apps functionality and user experience.",
//             "startDate": "2023-06-19T00:00:00.000+00:00",
//             "endDate": "2023-06-30T00:00:00.000+00:00",
//             "isFinished": false,
//             "department": {
//                 "departmentId": 7,
//                 "departmentName": "Software Development"
//             },
//             "usersAssignedProjectList": [
//                 {
//                     "userId": 1,
//                     "name": "Raj Singharia",
//                     "email": "rajsingharia.1234@gmail.com",
//                     "password": "$2a$10$/xdOxZCIKkwtxP9DK31ntet4MI/qV.qV8j3a29LBbfdmE2W5YqTzG",
//                     "department": {
//                         "departmentId": 7,
//                         "departmentName": "Software Development"
//                     },
//                     "savedPostsId": [
//                         1,
//                         1
//                     ],
//                     "role": "USER",
//                     "enabled": true,
//                     "authorities": [
//                         {
//                             "authority": "USER"
//                         }
//                     ],
//                     "username": "rajsingharia.1234@gmail.com",
//                     "accountNonLocked": true,
//                     "credentialsNonExpired": true,
//                     "accountNonExpired": true
//                 },
//                 {
//                     "userId": 2,
//                     "name": "Pragya Kaushal",
//                     "email": "pragya@gmail.com",
//                     "password": "$2a$10$jf/vzRzEDX.BsmE6mNvJGupkPxfJngXBcF1nh2qIhnoxgcJdT/Qf2",
//                     "department": {
//                         "departmentId": 7,
//                         "departmentName": "Software Development"
//                     },
//                     "savedPostsId": [],
//                     "role": "USER",
//                     "enabled": true,
//                     "authorities": [
//                         {
//                             "authority": "USER"
//                         }
//                     ],
//                     "username": "pragya@gmail.com",
//                     "accountNonLocked": true,
//                     "credentialsNonExpired": true,
//                     "accountNonExpired": true
//                 }
//             ]
//         },
//         "listOfSkillsRequired": [
//             "Spring boot",
//             "SQL",
//             "Spring Security"
//         ],
//         "listOfApplicants": [
//             {
//                 "userId": 2,
//                 "name": "Pragya Kaushal",
//                 "email": "pragya@gmail.com",
//                 "password": "$2a$10$jf/vzRzEDX.BsmE6mNvJGupkPxfJngXBcF1nh2qIhnoxgcJdT/Qf2",
//                 "department": {
//                     "departmentId": 7,
//                     "departmentName": "Software Development"
//                 },
//                 "savedPostsId": [],
//                 "role": "USER",
//                 "enabled": true,
//                 "authorities": [
//                     {
//                         "authority": "USER"
//                     }
//                 ],
//                 "username": "pragya@gmail.com",
//                 "accountNonLocked": true,
//                 "credentialsNonExpired": true,
//                 "accountNonExpired": true
//             }
//         ],
//         "totalApplicants": 1,
//         "isOpen": false,
//         "createdOn": "2023-06-19T15:15:30.357+00:00"
//     }
// ]
