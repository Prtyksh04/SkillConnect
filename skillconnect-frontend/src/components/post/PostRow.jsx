import React from 'react'
import { useNavigate } from 'react-router-dom'
import './postRow.css'
import { TimesAgo, TimeStampToDate } from '../../utils/Helper';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Text from '@mui/material/Typography';
import { Button } from '@mui/material';

export default function PostRow({ post, saveOrUnsavePost }) {


    const navigate = useNavigate();

    const navigateToPostDetails = () => {
        navigate(`/post/${post.postId}`);
    }

    const findUrgencyLevel = (urgencyLevel) => {
        if (urgencyLevel == 0)
            return "Low";
        else if (urgencyLevel == 1)
            return "Medium";
        else
            return "High";
    }

    const minimizeText = (text) => {
        if (text.length > 100) {
            return text.substring(0, 300) + ' ......';
        }
        return text;
    }

    //for testing adding 10 same list of skills
    // post.listOfSkillsRequired = [...post.listOfSkillsRequired, ...post.listOfSkillsRequired, ...post.listOfSkillsRequired, ...post.listOfSkillsRequired];


    return (
        <div className="post-card" >

            <div className='d-flex justify-content-between'>
                <div className='post-card-header' style={{ 'padding': '10px' }} onClick={navigateToPostDetails}>
                    <h5 className="card-title">{post.postTitle}</h5>
                    <h6 className="card-subtitle"
                        style={{ 'color': 'grey', 'fontWeight': '400' }}>● {TimesAgo(post.createdOn)}
                    </h6>
                </div>
                <div >
                    <Button aria-label="save" size="large" variant="outlined" color='success' onClick={() => { saveOrUnsavePost(post.postId) }}>
                        {
                            post.isSaved ? <BookmarkIcon color='success' /> : <BookmarkBorderIcon color='success' />
                        }
                    </Button>
                </div>
            </div>
            <div style={{ 'padding': '0px 10px 10px 10px', 'cursor': 'pointer' }} onClick={navigateToPostDetails}>
                <p className="card-text">{minimizeText(post.postDescription)}</p>
                <div className='d-flex justify-content-between'>
                    <div className='d-flex flex-column'>
                        <p className="card-text">
                            <b>Project Name: </b>
                            <Text component="span" variant="body2" color="text.primary" >
                                {post.projectName}
                            </Text>
                        </p>
                        <p className="card-text">
                            <b>Created On: </b>
                            <Text component="span" variant="body2" color="text.primary" >
                                {TimeStampToDate(post.createdOn)}
                            </Text>
                        </p>
                    </div>
                    <div className='d-flex flex-column'>
                        <p className="card-text">
                            <b>Department: </b>
                            <Text component="span" variant="body2" color="text.primary" >
                                {post.departmentName}
                            </Text>
                        </p>
                        <p className="card-text">
                            <b>Urgency Level: </b>
                            <Text component="span" variant="body2" color="text.primary" >
                                {
                                    findUrgencyLevel(post.urgencyLevel)
                                }
                            </Text>
                        </p>
                    </div>
                </div>

            </div>


            <div style={{ 'padding': '0px 10px 10px 10px' }}>
                <Grid container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    gap={1}>
                    {
                        post.listOfSkillsRequired && post.listOfSkillsRequired.map((skill) => {
                            return <Grid >
                                <Chip
                                    key={skill.skillId}
                                    label={skill.skillName}
                                    color='success' />
                            </Grid>
                        })
                    }
                </Grid>
            </div>
        </div>
    );
}


/*

[
    {
        "postId": 2,
        "postTitle": "Need Android Dev",
        "postDescription": "We are currently seeking an experienced Android developer to join our team and contribute to the development of our Android clock app. The ideal candidate should have a strong understanding of Android development principles and be proficient in Java or Kotlin.\nResponsibilities will include designing and implementing new features for the clock app, improving the user interface and user experience, and ensuring compatibility with a wide range of Android devices. The developer will work closely with the backend team to integrate the app with various timekeeping functionalities, such as alarms, timers, and a world clock.",
        "urgencyLevel": 1,
        "projectName": "Andorid Clock App",
        "departmentName": "Software Development",
        "listOfSkillsRequired": [
            "Android",
            "Room DB",
            "Retrofit"
        ],
        "createdOn": "2023-06-21T10:47:48.148+00:00"
    },
    {
        "postId": 1,
        "postTitle": "Need Spring boot Dev",
        "postDescription": "We are currently seeking a skilled Spring developer to join our team and contribute to the development of the backend for our chat app. The ideal candidate should have experience in building scalable and high-performance applications using Spring Boot and related technologies.\nResponsibilities will include designing and implementing the backend architecture, integrating with third-party APIs for real-time communication, and ensuring efficient data management and storage. The developer will collaborate closely with the frontend team to establish smooth communication channels and implement necessary features.",
        "urgencyLevel": 2,
        "projectName": "Chat App Backend",
        "departmentName": "Software Development",
        "listOfSkillsRequired": [
            "Spring boot",
            "SQL",
            "Spring Security"
        ],
        "createdOn": "2023-06-19T15:15:30.357+00:00"
    }
]

*/
