
import { Card, CardContent, Typography } from '@mui/material';
import React from 'react'
import { Link } from 'react-router-dom';
import { TimeStampToDate } from '../../utils/Helper';

export default function SavedPostCard({ post }) {

    const minimizeText = (text) => {
        if (text.length > 100) {
            return text.substring(0, 300) + ' ......';
        }
        return text;
    }

    return (
        <Link to={`/post/${post?.postId}`} style={{ 'textDecoration': 'none' }}>
            <Card className='p-3'>
                <CardContent >
                    <div className='d-flex justify-content-between align-items-center flex-column'>
                        <h5 className='mb-3'>{post?.postTitle}</h5>
                        <p className='mb-0'>{minimizeText(post?.postDescription)}</p>

                        <div className='d-flex justify-content-between align-items-center w-100 mt-3'>
                            <Typography variant="body" color="text.primary" >
                                <b>Created On: </b>
                                {TimeStampToDate(post.createdOn)}
                            </Typography>
                            <Typography variant="body" color="text.primary">
                                <b> Project: </b>
                                {post?.project?.projectName}
                            </Typography>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
