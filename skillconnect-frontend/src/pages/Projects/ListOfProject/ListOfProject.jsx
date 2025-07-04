
import React, { useEffect, useState } from 'react'
import ProjectRow from '../../../components/project/ProjectRow'
import { motion } from 'framer-motion'
import { getApi } from '../../../utils/axiosConfig';
import Spinner from '../../../components/general/spinner/Spinner';
import { Alert } from '@mui/material';


export default function ListOfProject({
    projectType,
    projectCreated,
    pageNumber,
    handleNavigateToLogin,
    setTotalNumberOfPages}) {

    const api = getApi();
    const [userProjects, setUserProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {

        const fetchUserProjects = async () => {
            setIsLoading(true);

            const pageNumberParam = {
                params: {
                    pageNumber: pageNumber
                }
            }

            api.get(`api/v1/project/${projectType}`, pageNumberParam)
                .then(function (response) {
                    console.log(response.data);
                    setUserProjects(response.data);
                    setTotalNumberOfPages(response.data[0]?.totalNumberOfPages ?? 1);
                })
                .catch(function (error) {
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
        }

        fetchUserProjects();

    }, [projectType, projectCreated, pageNumber]);

    return (
        <div>
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
                </div>
            }
            {
                !error && !isLoading &&
                userProjects.map((project, idx) => {
                    return <motion.div
                        key={project.projectId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * idx }}>
                        <ProjectRow project={project} />
                    </motion.div>
                })
            }
        </div>
    )
}
