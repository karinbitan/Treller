import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { eventBus } from '../../services/eventBusService';
import './MainHeaderOptions.scss';

function _MainHeaderOptions(props) {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        eventBus.on('notification', notification => {
            setNotifications(notification)
        })
    });

    return (
        <div className="main-header-options">
            <button onClick={props.closePopUp} className="close-btn"><i className="fas fa-times"></i></button>
            <div>
                <p>{props.type}</p>
                <ul>
                    {notifications.map(notification => {
                        if (notification) {
                            return <li>
                                <span><a href="#">{notification.title}</a></span>
                            </li>
                        }
                    })}
                </ul>
            </div>
        </div>)
}

export const MainHeaderOptions = withRouter(_MainHeaderOptions)