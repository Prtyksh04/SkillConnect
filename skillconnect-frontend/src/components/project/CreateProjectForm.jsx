import { Button, Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select } from "@mui/material";
import { getApi } from "../../utils/axiosConfig";

import React, { useEffect } from 'react'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};



export default function CreateProjectForm({
    setProjectCreated,
    setError,
    handleNavigateToLogin,
    handleToClose,
    departmentList
}) {

    const api = getApi();

    const [department, setDepartment] = React.useState('')
    const [potentialUsers, setPotentialUsers] = React.useState([])
    const [userIdsAssignedProjectList, setUserIdsAssignedProjectList] = React.useState([])

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        console.log(userIdsAssignedProjectList);
        setUserIdsAssignedProjectList(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    useEffect(() => {

        if (department == '') {
            setDepartment(departmentList[0].departmentId);
        } else {
            api.get(`api/v1/user/get-all-users/${department}`)
                .then(function (response) {
                    console.log('potential users');
                    console.log(response.data);
                    setPotentialUsers(response.data);
                })
                .catch(function (error) {
                    if (error.response && error.response.status == 403) {
                        handleNavigateToLogin();
                        return;
                    }
                    setError(error.response.data.message);
                });
        }
    }, [department])

    const handleDepartmentChange = (event) => {
        setDepartment(event.target.value);
    };

    const createNewProject = (event) => {
        event.preventDefault();

        const projectName = event.target.projectName.value;
        const projectDescription = event.target.projectDescription.value;
        const startDate = event.target.startDate.value;
        const endDate = event.target.endDate.value;

        const project = {
            projectName: projectName,
            projectDetails: projectDescription,
            startDate: startDate,
            endDate: endDate,
            isFinished: false,
            departmentId: department,
            userIdsAssignedProjectList: userIdsAssignedProjectList
        }

        console.log(project);

        api.post(`api/v1/project/create`, project)
            .then(function (response) {
                setProjectCreated(true);
                handleToClose();
            })
            .catch(function (error) {
                if (error.response && error.response.status == 403) {
                    handleNavigateToLogin();
                    return;
                }
                setError(error.response.data.message);
            });

    }

    return (
        <form onSubmit={createNewProject}>
            <div className='d-flex flex-row justify-content-between'>
                <div className='d-flex flex-column w-100 mr-3'>
                    <div className="mb-3">
                        <label
                            htmlFor="projectName"
                            className="form-label">Project Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="projectName" />
                    </div>
                    <div className="mb-3">
                        <label
                            htmlFor="projectDescription"
                            className="form-label">Project Description</label>
                        <textarea
                            className="form-control"
                            id="projectDescription"
                            rows="3"
                        />
                    </div>
                    <div className="mb-3">
                        <label
                            htmlFor="startDate"
                            className="form-label">Start Date</label>
                        <input
                            type="date"
                            className="form-control"
                            id="startDate" />
                    </div>
                    <div className="mb-3">
                        <label
                            htmlFor="endDate"
                            className="form-label">End Date</label>
                        <input
                            type="date"
                            className="form-control"
                            id="endDate" />
                    </div>
                    <div className="mb-3">
                        <FormControl sx={{ m: 1, width: 300 }}>
                            <InputLabel id="departmentId">Department</InputLabel>
                            <Select
                                id="departmentId"
                                value={department}
                                label="Department"
                                onChange={handleDepartmentChange}>
                                {
                                    departmentList.map((department) => (
                                        <MenuItem
                                            key={department.departmentId}
                                            value={department.departmentId}>
                                            {department.departmentName}
                                        </MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </div>
                    <Button
                        variant="contained"
                        type="submit"
                        color="success">
                        Create
                    </Button>
                </div>
                <div className="mb-3">
                    <FormControl sx={{ m: 1, width: 300 }}>
                        <InputLabel id="userIdsAssignedProjectList">Users Assigned Project List</InputLabel>
                        <Select
                            id="userIdsAssignedProjectList"
                            multiple
                            value={userIdsAssignedProjectList}
                            onChange={handleChange}
                            input={<OutlinedInput label=' Users Assigned Project List' />}
                            renderValue={(selected) => selected.join( ', ')}
                            MenuProps={MenuProps}>
                            {
                                potentialUsers.map((user) => (
                                    <MenuItem
                                        key={user.userId}
                                        value={user.name}>
                                        <Checkbox
                                            checked={userIdsAssignedProjectList.indexOf(user.name) > -1} />
                                        <ListItemText
                                            secondary={user.name}
                                            primary={`SSDS ${user.userId}`} />
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </div>
            </div>
        </form>
    )
}



