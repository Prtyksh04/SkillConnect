import { useEffect, useState } from 'react'
import { getAuthApi } from '../../utils/axiosConfig'
import Spinner from '../../components/general/spinner/Spinner'
import { Form, Link, useNavigate } from 'react-router-dom'

import Alert from '@mui/material/Alert';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';


export default function Register() {

  const authApi = getAuthApi();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  const [department, setDepartment] = useState('');
  const [departmentList, setDepartmentList] = useState([]);
  const navigate = useNavigate();


  const handleDepartmentChange = (event) => {
    setDepartment(event.target.value);
  };

  useEffect(() => {
    authApi.get('api/v1/department/get-all')
      .then(function (response) {
        setDepartmentList(response.data);
        setDepartment(response.data[0].departmentId);
      })
      .catch(function (error) {
        setError(error.message);
      });
  }, []);


  function redirectToHome() {
    navigate('/', { replace: true });
  }

  const navigateToLogin = () => {
    navigate('/login');
  }

  function isInputValidity({ name, email, password, confirmPassword, departmentName }) {
    if (name == "" || email == "" || password == "" || confirmPassword == "" || departmentName == "") {
      setError("Fields Empty");
      return false;
    }
    else if (password != confirmPassword) {
      setError("Password Mismatch");
      return false;
    }
    return true;
  }

  async function registerUser(userData) {

    setIsLoading(true);

    const newUserData = {
      'name': userData.name,
      'email': userData.email,
      'password': userData.password,
      'departmentId': userData.departmentId,
    }

    console.log(newUserData);

    authApi.post("api/v1/auth/register", newUserData)
      .then(function (response) {
        setIsRegistered(true);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('expiryDateTime', response.data.expiryDateTime);
        redirectToHome();
      })
      .catch(function (error) {
        setError(error.response.data.message);
      })
      .finally(function () {
        setIsLoading(false);
      });

  }

  function onFormSubmit(e) {

    e.preventDefault();

    setError('')
    setIsRegistered(false);

    const formData = new FormData(e.currentTarget);
    const newUserData = Object.fromEntries(formData);

    if (isInputValidity(newUserData)) {
      registerUser(newUserData);
      e.currentTarget.reset();
    }

  }


  return (
    <div className="auth-wrapper">

      {isRegistered && <Alert variant="success">Registered Successfully</Alert>}

      {isLoading && <Spinner />}

      {error && <Alert severity="error">{error}</Alert>}

      <div className='d-flex mt-4 justify-content-center w-100'>
        <RegisterForm
          onFormSubmit={onFormSubmit}
          navigateToLogin={navigateToLogin}
          department={department}
          departmentList={departmentList}
          handleDepartmentChange={handleDepartmentChange} />
      </div>

    </div>
  );
}


function RegisterForm({
  onFormSubmit,
  navigateToLogin,
  department,
  departmentList,
  handleDepartmentChange
}) {

  return (
    <form className="auth-inner" onSubmit={onFormSubmit}>
      <h3>Sign Up</h3>
      <div className="form-group">
        <label htmlFor="registerName">Name</label>
        <input
          type="text"
          className="form-control"
          id="registerName"
          placeholder="Enter Name"
          name='name'
        />
      </div>
      <div className="form-group">
        <label htmlFor="registerEmail">Email address</label>
        <input
          type="email"
          className="form-control"
          id="registerEmail"
          aria-describedby="emailHelp"
          placeholder="Enter email"
          name='email'
        />
      </div>
      <div className="form-group">
        <label htmlFor="registerPassword">Password</label>
        <input
          type="password"
          className="form-control"
          id="registerPassword"
          placeholder="Password"
          name='password'
        />
      </div>
      <div className="form-group">
        <label htmlFor="registerConfirmPassword">Confirm Password</label>
        <input
          type="password"
          className="form-control"
          id="registerConfirmPassword"
          placeholder="Confirm Password"
          name='confirmPassword'
        />
      </div>
      {/* <div className="form-group">
        <label htmlFor="registerDepartment">Department</label>
        <input
          type="text"
          className="form-control"
          id="registerDepartment"
          placeholder="Enter Department"
          name='departmentName'
        />
      </div> */}

      <div className="form-group">
        <FormControl fullWidth>
          <InputLabel id="departmentId">Department</InputLabel>
          <Select
            id="departmentId"
            value={department}
            label="Department"
            onChange={handleDepartmentChange}
            name='departmentId'>
            {
              departmentList?.map((department) => (
                <MenuItem key={department.departmentId} value={department.departmentId}>
                  {department.departmentName}
                </MenuItem>
              ))
            }
          </Select>
        </FormControl>
      </div>

      <div>
        <button type="submit" className="btn btn-primary">Register</button>
      </div>
      <div>
        <button type="button" className="btn btn-link" onClick={navigateToLogin}>Login</button>
      </div>
    </form >
  );
}
