import { useEffect, useState } from 'react';
import { eventBus } from '../../services/eventBusService';
import { connect } from 'react-redux';
import { addMemberToBoard } from '../../store/actions/boardActions';
import { updateUserCollection } from '../../store/actions/userActions';
import './Notifications.scss';

export function _Notifications(props) {
    const [showMoreNum, showMore] = useState(3)

    useEffect(() => {
        eventBus.on('closeModal', () => {
            props.closePopUp();
        })
    }, [props]);

    const onApprove = async (notification, notificationIdx) => {
        let notifications = props.user.notifications;
        notification.status = { isSeen: true, msg: 'You approve the invitation' };
        notifications.splice(notificationIdx, 1, notification)
        await props.updateUserCollection(props.user._id, { notifications })
        await props.addMemberToBoard(notification.id, props.user);
        eventBus.emit('loadUser');
    }

    const onDecline = async (notification, notificationIdx) => {
        let notifications = props.user.notifications;
        notification.status = { isSeen: true, msg: 'You decline the invitation' };
        notifications.splice(notificationIdx, 1, notification)
        await props.updateUserCollection(props.user._id, { notifications })
    }

    const notificationsToDisplay = () => {
        let notifications = props.user.notifications;
        if (notifications.length > 3) {
            return notifications.slice(0, showMoreNum);
        }
    }

    return (
        <div className="notifications-container">
            <button onClick={props.closePopUp} className="close-btn"><i className="fas fa-times"></i></button>
            <p className="headline">Notifications</p>
            {props.user.notifications &&
                <ul>
                    {notificationsToDisplay().map((notification, idx) => {
                        return <li className="notification" key={idx}>
                            {!notification.status.isSeen && <i className="fas fa-circle circle"></i>}
                            <p className="notification-message">{notification.message}</p>
                            {!notification.status.isSeen ? <div>
                                <button className="notification-action approve"
                                    onClick={() => onApprove(notification, idx)}>Approve</button>
                                <button className="notification-action decline"
                                    onClick={() => onDecline(notification, idx)}>Decline</button>
                            </div>
                                : <p className="notification-status bold">{notification.status.msg}</p>}
                            {/* <Link to={`/treller/board/${notification.id}`}>
                                        {`${notification.message}`}
                                    </Link> */}
                        </li>
                    })}
                    <li className="show-more" onClick={() => showMore(showMoreNum + 3)}>...</li>
                </ul>}
            {!props.user.notifications &&
                <span>No notifications yet...</span>}
        </div>)
}

const mapDispatchToProps = {
    addMemberToBoard,
    updateUserCollection
}
export const Notifications = connect(null, mapDispatchToProps)(_Notifications)
