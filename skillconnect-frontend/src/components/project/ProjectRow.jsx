import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { TimeStampToDate } from '../../utils/Helper';
import Text from '@mui/material/Typography';
import './projectRow.css'
import LabelIcon from '@mui/icons-material/Label';
import { Chip, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';

export default function ProjectRow({ project }) {

    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');


    const navigateToProjectDetails = () => {
        navigate(`/project/${project.projectId}`);
    }


    return (
        <div className="project-card" onClick={navigateToProjectDetails}>
            <div className='d-flex justify-content-between'>
                <div className="project-card-header">
                    <h5>
                        #{project.projectId} {project.projectName}
                    </h5>
                </div>
                {
                    project.isCreator &&
                    <Tooltip title="You are the creator of this project">
                        <LabelIcon color='success' />
                    </Tooltip>
                }
            </div>


            <div className="card-body">
                <p className="card-text">{project.projectDetails}</p>
                <div className="card-text">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <b>Duration: </b>
                            <Text component="span" variant="body2" color="text.primary" >
                                {TimeStampToDate(project.startDate)}
                            </Text>
                            <Text className='mr-3 ml-3' component="span" variant="body2" color="text.primary">
                                <b>to</b>
                            </Text>
                            <Text component="span" variant="body2" color="text.primary">
                                {TimeStampToDate(project.endDate)}
                            </Text>
                        </div>
                        <div className='d-flex flex-row'>
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}>
                                <Chip label={`Tasks: ${project.countOfTaskTypes.tasksCount ?? 0}`} />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}>
                                <Chip className='ml-3' label={`Completed: ${project.countOfTaskTypes.tasksCompleted ?? 0}`} color='success' />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}>
                                <Chip className='ml-3' label={`Pending: ${project.countOfTaskTypes.tasksPending ?? 0}`} color='warning' />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}>
                                <Chip className='ml-3' label={`In Progress: ${project.countOfTaskTypes.tasksInProgress ?? 0}`} color='error' />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


/*
[
    {
        "projectId": 1,
        "projectName": "Chat App Backend",
        "projectDetails": "In the next phase of the chat app backend project, the main objectives are scalability and performance optimization. This involves implementing a distributed architecture to handle increasing user load, improving real-time communication through WebSocket integration, and enhancing database management for efficient data storage and retrieval. Additionally, security measures like encryption and authentication will be strengthened, and new features like message search and user analytics will be developed to further enhance the chat apps functionality and user experience.",
        "startDate": "2023-06-19T00:00:00.000+00:00",
        "endDate": "2023-06-30T00:00:00.000+00:00",
        "isFinished": false,
        "departmentName": "Software Development",
        "isCreator": true,
        "countOfTaskTypes": {
            "tasksCount": 3,
            "tasksCompleted": 2,
            "tasksPending": 1,
            "tasksInProgress": null
        }
    }
]
*/

