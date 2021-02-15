import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { eventBus } from '../../services/eventBusService';
import './Notifications.scss';

export function Notifications(props) {
    const location = useLocation();

    useEffect(() => {
        eventBus.on('closeModal', () => {
            props.closePopUp();
        })
    }, [props]);


    return (
        <div className="notifications-container">
            <button onClick={props.closePopUp} className="close-btn"><i className="fas fa-times"></i></button>
            <p>Notifications</p>
            {(props.boardNotifications && props.boardNotifications.length > 0) &&
                <div className="board-notifications">
                    <h5>Board Notifications</h5>
                    <ul>
                        {props.boardNotifications.map((notification, idx) => {
                            return <li key={idx}>
                                <span onClick={props.closePopUp}><Link to={{
                                    pathname: `/treller/card/${notification.id}`,
                                    state: { background: location }
                                }}>{`${notification.message}`}</Link></span>
                            </li>
                        })}
                    </ul>
                </div>}
            {(props.userNotifications && props.userNotifications.length > 0) &&
                <div className="user-notifications">
                    <h5>User Notifications</h5>
                    <ul>
                        {props.userNotifications.map((notification, idx) => {
                            return <li key={idx}>
                                <span onClick={props.closePopUp}>
                                    <Link to={`/treller/board/${notification.id}`}>
                                        {`${notification.message}`}
                                    </Link>
                                </span>
                            </li>
                        })}
                    </ul>
                </div>}
            {/* {((!props.boardNotifications && !props.boardNotifications.length > 0)
                && (!props.userNotifications && props.userNotifications.length > 0))}
            <span>No notifications yet...</span> */}
        </div>)
}