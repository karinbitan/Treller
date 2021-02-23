import { useEffect, useState } from 'react';
import './NotificiationMsg.scss';

export function NotificiationMsg({ notification, user }) {
    const [isTimePass, setTime] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setTime(true)
        }, 4000);
    }, [notification]);

    const isUser = () => {
        if (notification.byUser) {
            if (notification.byUser.id === user._id) return true;
            else return false;
        }
    }

    return (
        <section>
            {(notification && !isTimePass) && <div className="notification-msg">
                <p>{`${notification.message} ${notification.byUser ? 'by' : ''} ${isUser() ? 'You' : notification.byUser.fullName}`}</p>
            </div>}
        </section>
    )
}
