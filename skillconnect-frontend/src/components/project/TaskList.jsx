
import { Alert, Button, Dialog, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Paper, Select, Slide, TextField } from '@mui/material'
import React, { useState } from 'react'
import { TimeStampToDate } from '../../utils/Helper'
import { getApi } from '../../utils/axiosConfig'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});


export default function TaskList({ taskList, setRefresh }) {


    const api = getApi();

    const [open, setOpen] = useState(false);
    const [clickedTask, setClickedTask] = useState("");
    const [status, setStatus] = useState();
    const [taskUpdates, setTaskUpdates] = useState([]);
    const [dialogError, setDialogError] = useState("");

    const getTaskUpdates = (taskId) => {
        api.get(`/api/v1/task-updates/get-all/${taskId}`)
            .then((res) => {
                const taskUpdates = res.data;
                // for testing adding same task update 10 times
                // for (let i = 0; i < 10; i++) {
                //     taskUpdates.push(res.data[0]);
                // }
                setTaskUpdates(taskUpdates);
            })
            .catch((error) => {
                console.log(error);
                setDialogError(error?.response?.data?.message ?? "Something went wrong");
            });
    }


    const handelTaskClicked = (task) => () => {
        setClickedTask(task);
        setOpen(true);
        setStatus(task.taskStatus);
        getTaskUpdates(task.taskId);
    }

    const handelOnDialogClose = () => {
        setOpen(false);
        setClickedTask("");
        setStatus("");
    }


    const findTheActiveTask = () => {
        return taskList.findIndex((task) => {
            return task.taskStatus == 'PENDING' || task.taskStatus == 'IN_PROGRESS';
        });
    }

    const handelUpdateStatus = () => {

        api.post(`/api/v1/task/${clickedTask.taskId}/update-status/${status}`)
            .then((res) => {
                setRefresh(true);
                console.log(res.data);
                handelOnDialogClose();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const findStatus = (status) => {
        switch (status) {
            case 'PENDING':
                return '(Pending)';
            case 'IN_PROGRESS':
                return '(In Progress)';
            case 'COMPLETED':
                return '(Completed)';
            default:
                return '(Pending)';
        }
    }

    const minimizeContent = (content) => {
        if (content.length > 100) {
            return content.substring(0, 50) + '...';
        }
        return content;
    }

    const contentStyle = (status) => {
        switch (status) {
            case 'PENDING':
                return { background: 'red', color: 'white' };
            case 'IN_PROGRESS':
                return { background: 'orange', color: 'white' };
            case 'COMPLETED':
                return { background: 'green', color: 'white' };
            default:
                return { background: 'red', color: 'white' };
        }
    }

    const iconStyle = (status) => {
        switch (status) {
            case 'PENDING':
                return { background: 'red', color: 'white' };
            case 'IN_PROGRESS':
                return { background: 'orange', color: 'white' };
            case 'COMPLETED':
                return { background: 'green', color: 'white' };
            default:
                return { background: 'red', color: 'white' };
        }
    }

    const contentArrowStyle = (status) => {
        switch (status) {
            case 'PENDING':
                return { borderRight: '7px solid  red' };
            case 'IN_PROGRESS':
                return { borderRight: '7px solid  orange' };
            case 'COMPLETED':
                return { borderRight: '7px solid  green' };
            default:
                return { borderRight: '7px solid  red' };
        }
    }

    return (
        <div>
            <VerticalTimeline>
                {
                    taskList.map((task) => (
                        <VerticalTimelineElement
                            key={task.taskId}
                            className="vertical-timeline-element--work"
                            contentStyle={contentStyle(task.taskStatus)}
                            contentArrowStyle={contentArrowStyle(task.taskStatus)}
                            date={TimeStampToDate(task.taskCreatedOn)}
                            iconStyle={iconStyle(task.taskStatus)}
                            icon={
                                <div className='d-flex align-items-center justify-content-center h-100'>
                                    <h4 >#{task.taskId}</h4>
                                </div>
                            }>
                            <div className='d-flex flex-row justify-content-between'>
                                <h5 className="vertical-timeline-element-title">{task.taskTitle}</h5>
                                <h6 className="vertical-timeline-element-subtitle">{findStatus(task.taskStatus)}</h6>
                            </div>
                            <div className='d-flex justify-content-end'>
                                <Button
                                    variant="outlined"
                                    style={{ 'color': 'white', 'borderColor': 'white' }}
                                    onClick={handelTaskClicked(task)}
                                    size='small'
                                    className='mt-3'>
                                    View Details
                                </Button>
                            </div>
                        </VerticalTimelineElement>
                    ))
                }
            </VerticalTimeline>
            <TaskDetailAndStatusChangeDialog
                open={open}
                handleClose={handelOnDialogClose}
                task={clickedTask}
                status={status}
                setStatus={setStatus}
                handelUpdateStatus={handelUpdateStatus}
                taskUpdates={taskUpdates}
                setTaskUpdates={setTaskUpdates}
                error={dialogError}
                setError={setDialogError}
            />
        </div>
    )
}


const TaskDetailAndStatusChangeDialog = ({
    task,
    open,
    handleClose,
    status,
    setStatus,
    handelUpdateStatus,
    taskUpdates,
    setTaskUpdates,
    error,
    setError }) => {

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    };

    const api = getApi();
    const [update, setUpdate] = useState("");

    const addNewUpdate = () => {

        const newUpdate = {
            taskUpdateDescription: update
        }

        api.post(`/api/v1/task-updates/add/${task.taskId}`, newUpdate)
            .then((res) => {
                setTaskUpdates([res.data, ...taskUpdates]);
                setUpdate("");
            })
            .catch((error) => {
                console.log(error);
                setError(error?.response?.data?.message ?? "Something went wrong");
            });
    }

    const initialStatus = task.taskStatus;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            TransitionComponent={Transition}
            keepMounted
            aria-describedby="alert-dialog-slide-description"
            scroll='paper'
            maxWidth='md'>
            {
                error &&
                <div className='d-flex justify-content-center mt-5'>
                    <Alert severity="error">{error}</Alert>
                </div >
            }
            <DialogTitle><b>Task Details</b></DialogTitle>
            <DialogContent>
                <div className='d-flex flex-row'>
                    <div
                        className='d-flex flex-column' style={{
                            'flexGrow': '1',
                            'marginRight': '5px'
                        }}>
                        <h5>
                            {task.taskTitle}
                        </h5>
                        <p>
                            {task.taskDescription}
                        </p>
                        <p>
                            <b>Registered On : </b>{TimeStampToDate(task.taskCreatedOn)}
                        </p>
                        <p>
                            <b>Task Status : </b>{task.taskStatus}
                        </p>
                        <p>
                            <b>Task Assigned To : </b>{`#SSDS${task.taskAssignedUserId ?? ''} ${task.taskAssignedUserName ?? ''}`}
                        </p>

                        <FormControl>
                            <InputLabel id="statusChange">Status</InputLabel>
                            <Select
                                id="statusChange"
                                value={status}
                                label="Status"
                                onChange={handleStatusChange}>
                                <MenuItem
                                    disabled={initialStatus == 'PENDING'}
                                    value="PENDING">
                                    PENDING
                                </MenuItem>
                                <MenuItem
                                    disabled={initialStatus == 'IN_PROGRESS'}
                                    value="IN_PROGRESS">
                                    IN PROGRESS
                                </MenuItem>
                                <MenuItem
                                    disabled={initialStatus == 'COMPLETED'}
                                    value="COMPLETED">
                                    COMPLETED
                                </MenuItem>
                            </Select>
                            {
                                status != task.taskStatus &&
                                <Button
                                    variant="contained"
                                    color='success'
                                    onClick={handelUpdateStatus}
                                    className='mt-3'>
                                    Change Status
                                </Button>
                            }
                        </FormControl>
                    </div>
                    <div
                        className='d-flex flex-column'
                        style={{ 'flexGrow': '1', 'marginLeft': '5px' }}>
                        {
                            taskUpdates && taskUpdates.length > 0 ?
                                <div style={{
                                    'minHeight': '400px',
                                    'maxHeight': '400px',
                                    'overflowY': 'scroll',
                                    'background': '#f5f5f5',
                                    'padding': '10px'
                                }}>
                                    {
                                        taskUpdates.map((update) => (
                                            <Paper
                                                className='mt-3'
                                                key={update.taskUpdateId}>
                                                <p className='p-3'>
                                                    {update.taskUpdateDescription}
                                                </p>
                                            </Paper>
                                        ))
                                    }
                                </div>
                                :
                                <div style={{
                                    'minHeight': '400px',
                                    'maxHeight': '400px',
                                    'overflowY': 'scroll',
                                    'background': '#f5f5f5',
                                    'padding': '10px',
                                    'display': 'flex',
                                    'alignItems': 'center',
                                    'justifyContent': 'center'
                                }}>
                                    <p className='text-center'>No Updates</p>
                                </div>
                        }
                        <div className='d-flex flex-row mt-3 align-items-top'>
                            <TextField
                                id="outlined-multiline-static"
                                label="Add Update"
                                variant="outlined"
                                fullWidth
                                value={update}
                                onChange={() => setUpdate(event.target.value)} />
                            <Button
                                variant='contained'
                                color='success'
                                className='ml-3'
                                onClick={addNewUpdate}>
                                Add
                            </Button>
                        </div>
                    </div>
                </div>
                <div className='d-flex justify-content-end mt-3'>
                    <Button
                        onClick={handleClose}
                        color='success'>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
