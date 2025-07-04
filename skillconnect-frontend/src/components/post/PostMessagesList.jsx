
import React, { useEffect, useState } from 'react'
import { getApi } from '../../utils/axiosConfig';
import { Alert, Avatar, Card, CardContent, IconButton, TextField, Typography, Tooltip } from '@mui/material';
import { TimesAgo } from '../../utils/Helper';
import SendIcon from '@mui/icons-material/Send';
import RefreshIcon from '@mui/icons-material/Refresh';
import UserDetailsDialog from '../UserDetailDialog/UserDetailsDialog';
import './PostMessagesList.css'
import { motion } from 'framer-motion';
import { over } from 'stompjs';
import SockJs from "sockjs-client/dist/sockjs";
import { useNavigate } from 'react-router-dom';

var stompClient = null;

export default function PostMessagesList({ postId }) {


    const api = getApi();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [messageList, setMessageList] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [userDetailDialogOpen, setUserDetailDialogOpen] = useState(false);
    const [userDetailUser, setUserDetailsUser] = useState({});
    const [isConnected, setIsConnected] = useState(false);
    const navigate = useNavigate();

    const handleUserDetailDialogOpen = (user) => {
        setUserDetailsUser(user);
        setUserDetailDialogOpen(true);
    };

    const handleNavigateToLogin = () => {
        navigate('/login', { replace: true, state: { alert: 'You need to login first' } });
    }

    let onConnected = () => {
        console.log("Connected!!")
        setIsConnected(true);
        stompClient.subscribe(`/post-chatroom/${postId}`, onMessageReceived);
    }

    let onDisconnected = () => {
        console.log("Disconnected!!")
        setIsConnected(false);
    }

    let onError = (err) => {
        console.log(err);
        setIsConnected(false);
        setError("Error while connecting to server");
    }

    let onMessageReceived = (payload) => {
        let newMessage = JSON.parse(payload.body);
        console.log("New Message Received");
        console.log(newMessage);
        setMessageList((messageList) => [newMessage, ...messageList]);
    }

    useEffect(() => {

        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }

        const connectToSocket = () => {

            //get url from env
            const REACT_BACK_END_APP_BASE_URL = 'http://localhost:8080' || import.meta.env.VITE_BACK_END_APP_BASE_URL;
            let socket = new SockJs(`${REACT_BACK_END_APP_BASE_URL}/ws`);
            stompClient = over(socket);

            stompClient.connect(headers, onConnected, onError);
        }

        const disconnectFromSocket = () => {
            if (stompClient !== null) {
                stompClient.disconnect(onDisconnected, headers);
            }
        }

        connectToSocket();

        return () => {
            disconnectFromSocket();
        }
    }, []);

    useEffect(() => {
        const fetchPostMessageData = async () => {
            setIsLoading(true);
            api.get(`api/v1/message/${postId}`)
                .then((response) => {
                    const messageList = response.data;
                    console.log(messageList);
                    //For testing add same message 10 times
                    // for (let i = 0; i < 10; i++) {
                    //     messageList.push(messageList[0]);
                    // }
                    setMessageList(messageList);
                })
                .catch((error) => {
                    if (error.response && error.response.status == 403) {
                        handleNavigateToLogin();
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

        fetchPostMessageData();


    }, [refresh]);


    const handelMessageSend = (event) => {

        event.preventDefault();

        setIsLoading(true);

        const message = {
            postId: postId,
            message: event.target.message.value,
        }

        console.log(message);

        api.post(`api/v1/message/${postId}`, message)
            .then(() => {
                console.log("Message Sent");
            })
            .catch((error) => {
                if (error.response && error.response.status == 403) {
                    handleNavigateToLogin();
                    return;
                }
                setError(error.response.data.message);
            })
            .finally(() => {
                setIsLoading(false);
                event.target.message.value = '';
            });

    }


    return (
        <div className='w-100 h-100'>
            {
                isLoading &&
                <div className='d-flex justify-content-center align-items-center w-100 h-100'
                    style={{ 'backgroundColor': 'gray', 'borderRadius': '8px' }}>
                    <Alert severity="info" >Loading Comments</Alert>
                </div>
            }
            {
                error && <Alert severity="error">{error}</Alert>
            }
            {
                !isLoading && !error &&
                <div className='d-flex justify-content-end align-items-center'>
                    <Typography
                        variant="h6">
                        #{postId} Discussion Thread
                    </Typography>
                    <IconButton
                        aria-label="refresh"
                        color="success"
                        onClick={() => setRefresh(true)}>
                        <RefreshIcon />
                    </IconButton>
                </div>
            }
            {
                !isLoading && !error && !isConnected &&
                <div className='d-flex justify-content-center align-items-center w-100 h-100'
                    style={{ 'backgroundColor': 'gray', 'borderRadius': '8px' }}>
                    <Alert severity="info" >Connecting to server</Alert>
                </div>
            }
            {
                !isLoading && !error && isConnected &&
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}>
                    <Card className='message-card'>
                        <CardContent className='message-card-content'>
                            <div className='message-scroll'>
                                {
                                    messageList && messageList.map((message) => (
                                        <div
                                            key={message.messageId}
                                            className={message.isAuthor ? 'd-flex justify-content-start' : 'd-flex justify-content-end'}>
                                            <Card
                                                sx={{ minWidth: '30%', 'maxWidth': '60%', 'padding': '8px 12px', 'marginBottom': '8px' }}>
                                                <div className='d-flex flex-row align-items-center'>
                                                    <Tooltip
                                                        title={`#SSDS ${message?.sender?.userId} ${message?.sender?.name}`}>
                                                        <Avatar
                                                            onClick={() => handleUserDetailDialogOpen(message.sender)}
                                                            style={{ 'cursor': 'pointer' }}
                                                            className='mr-2'>
                                                            {message?.sender?.name[0].toUpperCase() ?? '?'}
                                                        </Avatar>
                                                    </Tooltip>
                                                    <div className='d-flex flex-column'>
                                                        <h6
                                                            fontFamily={'Monospace'}>
                                                            <b>{message.message}</b>
                                                        </h6>
                                                        <h6>{TimesAgo(message.createdOn, true)}</h6>
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>
                                    ))
                                }
                            </div>
                            {
                                <form className='message-send' onSubmit={handelMessageSend}>
                                    <TextField
                                        id="message"
                                        label="Message"
                                        variant="outlined"
                                        color="success"
                                        fullWidth
                                        size='small' />
                                    <div className='d-flex justify-content-end ml-3'>
                                        <IconButton
                                            aria-label="send"
                                            type='submit'
                                            style={{ 'backgroundColor': 'lightgreen', 'padding': '0.6rem' }}>
                                            <SendIcon style={{ 'color': 'green', 'height': '1.5rem', 'width': '1.5rem' }} />
                                        </IconButton>
                                    </div>
                                </form>
                            }
                        </CardContent>
                    </Card>
                </motion.div>
            }
            <UserDetailsDialog
                open={userDetailDialogOpen}
                handleToClose={() => setUserDetailDialogOpen(false)}
                user={userDetailUser}
            />
        </div>
    )

}
