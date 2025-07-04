import React, { useEffect, useState } from 'react'
import { getApi } from '../../utils/axiosConfig'
import { useNavigate } from 'react-router-dom';
import UserData from '../../components/userData/UserData';
import Spinner from '../../components/general/spinner/Spinner';
import { Alert } from '@mui/material';
import { motion } from 'framer-motion';

export default function Account() {


  const api = getApi();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate('/login', { replace: true, state: { alert: 'You need to login first' } });
  }


  useEffect(() => {

    const fetchUserDetails = async () => {

      setIsLoading(true);

      api.get('api/v1/user/get')
        .then((response) => {
          console.log(response.data);
          setUserData(response.data);
        })
        .catch((error) => {
          if (error.response && error.response.status == 403) {
            navigateToLogin();
            return;
          }
          setError(error.response.data.message);
        })
        .finally(() => {
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        });
    }

    fetchUserDetails();

  }, [])

  const updateUserData = (newUser) => {
    api.put('/api/v1/user/update', newUser)
      .then((response) => {
        console.log(response.data);
        setUserData(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status == 403) {
          navigateToLogin();
          return;
        }
        setError(error.response.data.message);
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      });

  }


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
        </div>
      }
      {
        !isLoading && !error && userData &&
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          delay={{ duration: 0.5, delay: 0.5 }}
          className='d-flex justify-content-center'>
          <UserData userData={userData} updateUserData={updateUserData} />
        </motion.div>
      }
    </>
  )
}

