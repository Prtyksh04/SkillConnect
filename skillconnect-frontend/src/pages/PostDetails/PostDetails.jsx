import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import PostInfoDetails from '../../components/post/PostInfoDetails';
import PostMessagesList from '../../components/post/PostMessagesList';
import { Card, CardContent } from '@mui/material';
import './postDetails.css';
import { getApi } from '../../utils/axiosConfig';

export default function PostDetails() {

  const api = getApi();
  const navigate = useNavigate();
  const location = useLocation();


  const postId = location.pathname.split('/')[2];


  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [post, setPost] = useState(null);


  useEffect(() => {

    const fetchPostData = async () => {

      setIsLoading(true);

      //Post Details

      api.get(`api/v1/post/${postId}`)
        .then(function (response) {
          console.log(response);
          setPost(response.data);
        })
        .catch(function (error) {
          if (error.response && error.response.status == 403) {
            handleNavigateToLogin();
            return;
          }
          setError(error.response.data.message);
        })
        .finally(function () {
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
          //setIsLoading(false);
        });

    }

    fetchPostData();

  }, []);


  const handleNavigateToLogin = () => {
    navigate('/login', { replace: true, state: { alert: 'You need to login first' } });
  }

  return (
    <>
      {
        <div className='post-detail-body'>

          <div className='post-details'>
            <PostInfoDetails isLoading={isLoading} error={error} post={post} />
          </div>

          <div className='post-message'>
            <PostMessagesList postId={postId} />
          </div>

          {/* <div className='other-details'>
            <PostOtherDetails isLoading={isLoading} error={error} post={post} />
          </div> */}



        </div>
      }
    </>
  )
}





// [
//     {
//         "postId": 1,
//         "user": {
//             "userId": 2,
//             "name": "test",
//             "email": "test@gmail.com",
//             "password": "***********",
//             "departmentName": "IT",
//             "joiningDate": "2023-06-15",
//             "role": "USER",
//             "enabled": true,
//             "authorities": [
//                 {
//                     "authority": "USER"
//                 }
//             ],
//             "username": "test@gmail.com",
//             "accountNonExpired": true,
//             "credentialsNonExpired": true,
//             "accountNonLocked": true
//         },
//         "project": {
//             "projectId": 1,
//             "projectName": "Skill Connect",
//             "projectDetails": "Help connect specific skilled people within organisation",
//             "startDate": "2023-06-10",
//             "endDate": "2023-06-10",
//             "isFinished": false,
//             "departmentName": "IT",
//             "usersAssignedProjectList": []
//         },
//         "listOfSkillsRequired": [
//             "Spring Boot",
//             "SQL",
//             "React"
//         ],
//         "listOfApplicants": [],
//         "totalApplicants": 0,
//         "isOpen": true,
//         "createdOn": "2023-06-10"
//     }
// ]
