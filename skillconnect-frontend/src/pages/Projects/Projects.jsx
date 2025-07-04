import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getApi, getAuthApi } from '../../utils/axiosConfig';
import CreateProjectForm from '../../components/project/CreateProjectForm';
import CustomButtonGroup from '../../components/general/buttonGroup/CustomButtonGroup';
import { IoAddCircleOutline } from "react-icons/io5"
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Alert, Slide, Pagination } from '@mui/material'
import ListOfProject from './ListOfProject/ListOfProject';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default function MyProjects() {

  const api = getApi();
  const authApi = getAuthApi();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [userProjects, setUserProjects] = useState([]);
  const [projectType, setProjectType] = useState('user');
  const [projectTypeToggleState, setProjectTypeToggleState] = useState('My');
  const [open, setOpen] = useState(false);
  const [projectCreated, setProjectCreated] = useState(false);
  const [departmentList, setDepartmentList] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalNumberOfPages, setTotalNumberOfPages] = useState(0);

  const navigate = useNavigate();


  const handleClickToOpen = () => {
    setOpen(true);
  };

  const handleToClose = () => {
    setOpen(false);
  };

  const handleNavigateToLogin = () => {
    //send alert to login page to show alert
    navigate('/login', { replace: true, state: { alert: 'You need to login first' } });
  }

  useEffect(() => {

    const fetchAllDepartment = async () => {
      authApi.get('api/v1/department/get-all')
        .then(function (response) {
          setDepartmentList(response.data);
        })
        .catch(function (error) {
          if (error.response && error.response.status == 403) {
            handleNavigateToLogin()
            return;
          }
          setError(error.response.data.message);
        });
    }

    fetchAllDepartment();

  }, []);

  const changeProjectToggle = (event) => {
    setProjectTypeToggleState(event.target.name);
    if (event.target.name === 'My') {
      setProjectType('user')
      setPageNumber(0);
    } else if (event.target.name === 'All') {
      setProjectType('all');
      setPageNumber(0);
    }
  };


  return (
    <>
      {
        !error && !isLoading &&
        <div className="d-flex justify-content-between mb-3">
          <CustomButtonGroup
            buttons={["My", "All"]}
            changeProjectToggle={changeProjectToggle}
            projectTypeToggleState={projectTypeToggleState}
          />

          <Button
            className="btn btn-outline-dark"
            type="button"
            onClick={handleClickToOpen}
            startIcon={<IoAddCircleOutline />}
            variant="outlined"
            color="success">
            Create New Project
          </Button>
        </div >
      }

      {/* {
        isLoading &&
        <div className='d-flex justify-content-center'>
          <div className='loading-body'>
            <h6>Loading</h6>
            <Spinner />
          </div>
        </div>
      } */}

      {
        error &&
        <div className='d-flex justify-content-center mt-5'>
          <Alert severity="error">{error}</Alert>
        </div>
      }
      {
        !isLoading && !error &&
        <ListOfProject 
          projectType={projectType}
          projectCreated={projectCreated}
          pageNumber={pageNumber}
          handleNavigateToLogin={handleNavigateToLogin}
          setTotalNumberOfPages={setTotalNumberOfPages}
        />
      }
      {
        !isLoading && !error && totalNumberOfPages > 0 &&
        <Pagination
          count={totalNumberOfPages}
          variant="outlined"
          shape="rounded"
          color='success'
          className='d-flex justify-content-end'
          onChange={(event, page) => setPageNumber(page - 1)} />
      }
      {
        !isLoading && !error &&
        <CreateProjectDialog
          open={open}
          handleToClose={handleToClose}
          setProjectCreated={setProjectCreated}
          setError={setError}
          handleNavigateToLogin={handleNavigateToLogin}
          departmentList={departmentList}
        />
      }
    </>
  )

}

function CreateProjectDialog({
  open,
  handleToClose,
  setProjectCreated,
  setError,
  handleNavigateToLogin,
  departmentList
}) {
  return (
    <div >
      <Dialog
        open={open}
        onClose={handleToClose}
        fullWidth={true}
        maxWidth='lg'
        TransitionComponent={Transition}>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <CreateProjectForm
              setProjectCreated={setProjectCreated}
              setError={setError}
              handleNavigateToLogin={handleNavigateToLogin}
              handleToClose={handleToClose}
              departmentList={departmentList} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleToClose}
            color="success">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

