
import React, { useEffect, useState } from 'react'
import PostRow from '../../../components/post/PostRow'
import { Alert } from '@mui/material'
import { motion } from 'framer-motion'
import { getApi } from '../../../utils/axiosConfig';
import Spinner from '../../../components/general/spinner/Spinner';

export default function ListOfPost({ saveOrUnsavePost,
    posts,
    setPosts,
    filter,
    postCreated,
    postSaved,
    pageNumber,
    handleNavigateToLogin,
    setTotalNumberOfPages }) {

    const api = getApi();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');


    useEffect(() => {

        console.log('postSaved', postSaved);

        const fetchData = async () => {

            setIsLoading(true);

            const paramFilterAndPageNumber = {
                params: {
                    ...filter,
                    pageNumber: pageNumber
                }
            }


            api.get('/api/v1/post/all', paramFilterAndPageNumber)
                .then(function (response) {
                    console.log(response.data);
                    setPosts(response.data);
                    setTotalNumberOfPages(response.data[0]?.totalNumberOfPages ?? 1);
                })
                .catch(function (error) {
                    console.log(error);
                    if (error.response && error.response.status == 403) {
                        handleNavigateToLogin()
                        return;
                    }
                    setError(error.response.data.message);
                })
                .finally(function () {
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 1000);
                    // setIsLoading(false);
                });
        };

        fetchData();

    }, [filter, postCreated, postSaved, pageNumber]);


    //for testing adding 10 same posts
    // posts = [...posts, ...posts, ...posts, ...posts];

    return (

        <div className='list-of-post-body'>
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

                !isLoading && !error &&
                <div>
                    {
                        posts && posts?.length == 0 ?
                            <div className='d-flex justify-content-center m-2'>
                                <Alert severity="info">No post found</Alert>
                            </div>
                            :
                            posts?.map((post, idx) => {
                                return <motion.div
                                    key={post.postId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * idx }}>
                                    <PostRow post={post} saveOrUnsavePost={saveOrUnsavePost}></PostRow>
                                </motion.div>
                            })

                    }
                </div>
            }

        </div>

    )
}
