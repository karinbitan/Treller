import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { socketService } from '../../services/socketService';
import './MainHeaderOptions.scss';

function _MainHeaderOptions(props) {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        socketService.on('getNotification', (msg => {
            const msgs = [];
            msgs.push(msg);
            setNotifications(msgs);
            console.log(msg, msgs)
        }))
    });

    return (
        <div className="main-header-options">
            <button onClick={props.closePopUp} className="close-btn"><i className="fas fa-times"></i></button>
            <div>
                <p>{props.type}</p>
                {notifications && <ul>
                    {notifications.map(notification => {
                        return <li>
                            <span><a href="/">{notification.title}</a></span>
                        </li>
                    })}
                </ul>}
            </div>
        </div>)
}

export const MainHeaderOptions = withRouter(_MainHeaderOptions)