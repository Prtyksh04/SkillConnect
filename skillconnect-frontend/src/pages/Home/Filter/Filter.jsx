
import React, { useEffect, useState } from 'react'
import { getApi, getAuthApi } from '../../../utils/axiosConfig';
import { Alert, Button, Chip, FormControl, IconButton, InputLabel, ListItem, MenuItem, Select, TextField } from '@mui/material';
import Spinner from '../../../components/general/spinner/Spinner';
import { motion } from 'framer-motion';

import HighlightOffIcon from '@mui/icons-material/HighlightOff';

export default function Filter({ filter, setFilter }) {

  const authApi = getAuthApi();
  const api = getApi();


  const [department, setDepartment] = useState(filter.departmentId);
  const [priority, setPriority] = useState(filter.priority);
  const [skill, setSkill] = useState(filter.skill);
  const [sort, setSort] = useState(filter.sort);

  const [skillSuggestions, setSkillSuggestions] = useState([]);


  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [departmentList, setDepartmentList] = useState([]);



  useEffect(() => {

    const fetchDepartmentList = async () => {
      setLoading(true);
      authApi.get('api/v1/department/get-all')
        .then((response) => {
          const lengthOfResponse = response.data.length;
          const responseDepartmentList = [{ departmentId: lengthOfResponse + 1, departmentName: 'All' }, ...response.data];
          setDepartmentList(responseDepartmentList);

          if (department == null) {
            setDepartment(lengthOfResponse + 1);
          }

          if (priority == null) {
            setPriority(3);
          }

        })
        .catch((error) => {
          setError(error.response.data.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }

    fetchDepartmentList();

  }, []);


  useEffect(() => {

    const getSkillSuggestions = async () => {

      const skillName = skill == '' ? null : skill;

      api.get(`api/v1/skill/search/${skillName}`)
        .then(function (response) {
          console.log(response.data);
          setSkillSuggestions(response.data);
        })
        .catch(function (error) {
          if (error.response && error.response.status == 403) {
            handleNavigateToLogin();
            return;
          }
          setError(error.response.data.message);
        });
    }

    getSkillSuggestions();

  }, [skill])

  const handleDepartmentChange = (event) => {
    setDepartment(event.target.value);
  };

  const handleChangePriority = (event) => {
    setPriority(event.target.value);
  };

  const handleChangeSort = (event) => {
    setSort(event.target.value);
  }


  const setFilterVariable = (filter) => {
    setFilter(filter);
  }

  const handleSkillSuggestionsClick = (skill) => {
    setSkill(skill.skillName);
    setSkillSuggestions([]);
  }

  const applyFilter = () => {

    const filter = {
      departmentId: department == departmentList.length ? null : department,
      priority: priority == 3 ? null : priority,
      skill: skill,
      sort: sort
    }

    setFilterVariable(filter)
  }

  const resetFilter = () => {
    setDepartment(null);
    setPriority(null);
    setSkill(null);
    setSort(0);

    const filter = {
      departmentId: null,
      priority: null,
      skill: null,
      sort: 0
    }

    setFilterVariable(filter);
  }

  return (
    <>
      {
        loading &&
        <div className='d-flex justify-content-center'>
          <div className='loading-body'>
            <h6>Loading</h6>
            <Spinner />
          </div>
        </div>
      }
      {
        error && <Alert severity="error">{error}</Alert>
      }
      {
        !loading && !error && departmentList &&
        <motion.div

          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}

          className='filter-body'>
          <div className="d-flex justify-content-between mb-3">
            <h3 className='font-weight-bold'>Filter's</h3>
            <IconButton onClick={() => { resetFilter() }}>
              <HighlightOffIcon color='success' />
            </IconButton>
          </div>

          <div className="mb-4">
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

          <div className="mb-4">
            <FormControl fullWidth>
              <InputLabel id="urgencyLevel">Priority</InputLabel>
              <Select
                labelId="urgencyLevel"
                id="urgencyLevel"
                value={priority}
                label="Priority"
                onChange={handleChangePriority}>
                <MenuItem value={3}>All</MenuItem>
                <MenuItem value={0}>Low</MenuItem>
                <MenuItem value={1}>Medium</MenuItem>
                <MenuItem value={2}>High</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="mb-4">
            <TextField
              id="skill"
              label="Skill"
              variant="outlined"
              fullWidth
              value={skill}
              onChange={(e) => { setSkill(e.target.value) }} />
            {
              skillSuggestions.length > 0 &&
              <div className='mt-1'>Suggestions:</div>
            }
            {
              skillSuggestions.length > 0 &&
              <div className="d-flex flex-row mt-1" style={{ 'maxWidth': '100%', 'flexFlow': 'row wrap', 'backgroundColor': 'lightGray' }}>
                {
                  skillSuggestions.map((skill) => (
                    <ListItem key={skill.skillId} style={{ 'width': 'fit-content' }}>
                      <Chip
                        label={skill.skillName}
                        color="success"
                        onClick={() => handleSkillSuggestionsClick(skill)}
                      />
                    </ListItem>
                  ))
                }
              </div>
            }
          </div>

          <div className="mb-4">
            {/* sort aceding or descending */}
            <FormControl fullWidth>
              <InputLabel id="sort">Sort By Created Date</InputLabel>
              <Select
                labelId="sort"
                id="sort"
                value={sort}
                label="Sort By Created Date"
                onChange={handleChangeSort}>
                <MenuItem value={0}>Descending</MenuItem>
                <MenuItem value={1}>Ascending</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="mb-0">
            <Button variant="contained" fullWidth color='success' onClick={applyFilter}>Apply</Button>
          </div>
        </motion.div>
      }
    </>
  )
}
