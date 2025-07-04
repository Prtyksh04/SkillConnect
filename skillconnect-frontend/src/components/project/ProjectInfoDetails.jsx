
import { Alert, Box, Card, CardContent, CardHeader, Chip, Container, Grid, Typography } from '@mui/material';
import Text from '@mui/material/Typography';
import React from 'react'
import { TimeStampToDate } from '../../utils/Helper';
import TaskList from "../../components/project/TaskList"
import { motion } from 'framer-motion';

export default function ProjectInfoDetails({ isLoading, error, project, taskList, setRefresh }) {

    return (
        <div>
            {
                isLoading &&
                <div className='d-flex justify-content-center align-items-center w-100 h-100' style={{ 'backgroundColor': 'gray', 'borderRadius': '8px' }}>
                    <Alert severity="info" >Loading Project Details</Alert>
                </div>
            }
            {
                error &&
                <div className='d-flex justify-content-center align-items-center w-100 h-100' style={{ 'backgroundColor': 'gray', 'borderRadius': '8px' }}>
                    <Alert severity="error" >{error}</Alert>
                </div>
            }
            {
                !isLoading && !error &&
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}>
                    <Card>
                        <CardContent>

                            <div >
                                <div className='d-flex justify-content-between'>
                                    <h5 className="card-title">{project?.projectName}</h5>
                                    <h5
                                        className="card-title"
                                        style={{ 'color': project?.isFinished ? 'red' : 'green', 'fontFamily': 'monospace', 'fontSize': '1rem', 'fontWeight': 'bold', 'letterSpacing': '1px' }}>
                                        {project?.isFinished ? " (Finished)" : " (Ongoing)"}
                                    </h5>
                                </div>

                                <p className="card-text">{project?.projectDetails}</p>
                                <b>Start Date: </b>
                                <Text component="span" variant="body2" color="text.primary" >
                                    {TimeStampToDate(project?.startDate)}
                                </Text>
                                <b className='ml-3'>End Date: </b>
                                <Text component="span" variant="body1" color="text.primary">
                                    {TimeStampToDate(project?.endDate)}
                                </Text>
                            </div>



                            <div className='d-flex flex-row justify-content-start align-items-center mt-4'>
                                <b>Department: </b>
                                <Chip
                                    className='ml-3'
                                    label={project?.department?.departmentName}
                                    color='success' />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            }
            {
                taskList && taskList.length > 0 &&
                <Card className='mt-3'>
                    <div className='d-flex justify-content-center mt-3 ml-3 mb-2'>
                        <h5><b>Task Timeline</b></h5>
                    </div>
                    <div className="slider-container">
                        <TaskList
                            taskList={taskList}
                            setRefresh={setRefresh} />
                    </div>
                </Card>
            }
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