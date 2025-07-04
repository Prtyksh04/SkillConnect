
import { Dialog, DialogTitle } from '@mui/material'
import React from 'react'

export default function UserDetailsDialog({ open, handleToClose, user }) {
  return (
    <Dialog open={open} onClose={handleToClose}>

      <DialogTitle className='d-flex justify-content-center align-items-center'>
        <h3>
          <b>User Details</b>
        </h3>
      </DialogTitle>
      <div className='p-3 d-flex flex-column justify-content-center align-items-center'>
        <p style={{ 'textAlign': 'center' }}>
          <b>UserId: </b>
          {`#SSDS ${user?.name}`}
        </p>
        <p style={{ 'textAlign': 'center' }}>
          <b>Name: </b>
          {user?.name}
        </p>
        <p style={{ 'textAlign': 'center' }}>
          <b>Email: </b>
          {user?.email}
        </p>
        <p style={{ 'textAlign': 'center' }}>
          <b>Department: </b>
          {user?.department?.departmentName}
        </p>
        <p style={{ 'textAlign': 'center' }}>
          <b>Experience: </b>
          {user?.experience}
        </p>
        <p style={{ 'textAlign': 'center' }}>
          <b>Skills: </b>
          {
            user?.listOfSkills?.map((skill) => (
              <span key={skill.skillId}>{skill.skillName}, </span>
            ))
          }
        </p>
      </div>
    </Dialog>
  )
}

// {
//     "userId": 1,
//     "name": "Raj Singharia",
//     "email": "rajsingharia.1234@gmail.com",
//     "password": "$2a$10$/xdOxZCIKkwtxP9DK31ntet4MI/qV.qV8j3a29LBbfdmE2W5YqTzG",
//     "department": {
//         "departmentId": 7,
//         "departmentName": "Software Development"
//     },
//     "savedPostsId": [
//         1,
//         1
//     ],
//     "experience": null,
//     "listOfSkills": null,
//     "role": "USER",
//     "enabled": true,
//     "credentialsNonExpired": true,
//     "accountNonExpired": true,
//     "username": "rajsingharia.1234@gmail.com",
//     "authorities": [
//         {
//             "authority": "USER"
//         }
//     ],
//     "accountNonLocked": true
// }
