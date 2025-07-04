
import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { useCountdown } from '../../../utils/Helper';
import { Avatar, Tooltip } from '@mui/material';

export default function NavItemMyAccount() {

    const expiryDateTime = localStorage.getItem('expiryDateTime');
    const userId = localStorage.getItem('userId');
    const [days, hours, minutes, seconds] = useCountdown(expiryDateTime);
    

    return (
        <div className="my-account">
            <div className='d-flex flex-row align-items-center' >
                <div >
                    {
                        localStorage.getItem('token') && expiryDateTime && userId && seconds >= 0 &&
                        <h6 >
                            <span className="badge badge-pill badge-dark" style={{ 'marginRight': '10px', 'marginLeft': '10px' }}>
                                {days}d {hours}h {minutes}m {seconds}s
                            </span>
                        </h6>
                    }
                </div>
                <div className="btn-group">
                    <Tooltip title={`SSDS${userId}`}>
                        <button
                            type="button"
                            className="btn btn-outline-light"
                            data-toggle="dropdown"
                            aria-haspopup="false"
                            aria-expanded="false"
                            style={{
                                'borderRadius': '50%',
                                'padding': '0.2rem',
                                'marginLeft': '10px',
                                'borderColor': 'lightGreen'
                            }}>
                            <Avatar sx={{ color: 'white', bgcolor: 'green' }} />
                        </button>
                    </Tooltip>

                    <div className="dropdown-menu dropdown-menu-right">
                        <button className="dropdown-item" type="button">
                            <Link className="dropdown-item" to="/account" color='success'>MyAccount</Link>
                        </button>
                        <button className="dropdown-item" type="button">
                            <Link className="dropdown-item" to="/logout" color='success'>Logout</Link>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
