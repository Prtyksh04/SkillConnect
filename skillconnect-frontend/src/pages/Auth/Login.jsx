import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getAuthApi } from '../../utils/axiosConfig';
import Spinner from '../../components/general/spinner/Spinner';

import Alert from '@mui/material/Alert';


export default function Login() {

  const authApi = getAuthApi();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedin, setIsLoggedin] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.alert) {
      setError(location.state.alert);
    }
  }, [])

  const navigateToRegister = () => {
    navigate('/register', { replace: true });
  }

  function redirectToHome() {
    navigate('/', { replace: true });
  }

  function isInputValidity({ email, password }) {
    if (email == "" || password == "") {
      setError("Fields Empty");
      return false;
    }
    return true;
  }

  async function loginUser(userData) {

    setIsLoading(true);

    const newUserData = {
      'email': userData.email,
      'password': userData.password
    }

    authApi.post("api/v1/auth/authenticate", newUserData)
      .then(function (response) {
        setIsLoggedin(true);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('expiryDateTime', response.data.expiryDateTime);

        redirectToHome();
      })
      .catch(function (error) {
        setError(error.message);
      })
      .finally(function () {
        setIsLoading(false);
      });

  }

  function onFormSubmit(e) {

    e.preventDefault();

    setError('')
    setIsLoggedin(false);

    const formData = new FormData(e.currentTarget);
    const newUserData = Object.fromEntries(formData);

    if (isInputValidity(newUserData)) {
      loginUser(newUserData);
      e.currentTarget.reset();
    }

  }


  return (

    <div className="auth-wrapper">

      {isLoggedin && <Alert severity="success">Login Successful</Alert>}

      {isLoading && <Spinner />}

      {error && <Alert severity="error">{error}</Alert>}

      <div className='d-flex mt-5 pt-5 justify-content-center w-100'>
        <LoginForm onFormSubmit={onFormSubmit} navigateToRegister={navigateToRegister} />
      </div>

    </div>
  );
}

function LoginForm({ onFormSubmit, navigateToRegister }) {
  return (
    <form className="auth-inner" onSubmit={onFormSubmit}>
      <h3>Login In</h3>
      <div className="form-group">
        <label htmlFor="loginEmail">Email address</label>
        <input
          type="email"
          className="form-control"
          id="loginEmail"
          aria-describedby="emailHelp"
          placeholder="Enter email"
          name='email'
        />

      </div>
      <div className="form-group">
        <label htmlFor="loginPassword">Password</label>
        <input
          type="password"
          className="form-control"
          id="loginPassword"
          placeholder="Password"
          name='password'
        />
      </div>
      <div>
        <button type="submit" className="btn btn-primary">Login</button>
      </div>
      <div>
        <button type="button" className="btn btn-link" onClick={navigateToRegister}>Register</button>
      </div>
    </form>
  )
}
