import { Button } from '@mui/material';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { getAuthApi } from '../../utils/axiosConfig'
import { motion } from 'framer-motion';

export default function Logout() {

  const navigate = useNavigate();
  const authApi = getAuthApi();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expiryDateTime');
    navigate('/login', { replace: true });
  }

  const handelLogoutClick = () => {
    authApi.post('/logout')
      .then(res => {
        console.log(res);
        logout();
      })
      .catch(err => {
        console.log(err);
      });
  }

  const cancel = () => {
    navigate('/home', { replace: true });
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        delay={{ duration: 1.0, delay: 1.0 }}>
        <div className='d-flex justify-content-center align-items-center flex-column' >
          <h1>Are you sure you want to logout ?</h1>
          <div style={{ 'display': 'flex', 'gap': '20px', 'marginTop': '20px' }}>
            <Button onClick={handelLogoutClick} variant="contained" color="error">Yes</Button>
            <Button onClick={cancel} variant="contained" color="success">No</Button>
          </div>
        </div>
      </motion.div>
    </>
  )
}
