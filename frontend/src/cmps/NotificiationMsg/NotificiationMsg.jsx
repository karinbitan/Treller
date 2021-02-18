import { useEffect, useState } from 'react';
import './NotificiationMsg.scss';

export function NotificiationMsg({ notification, user }) {
    const [isTimePass, setTime] = useState(false)
    let interval = null;

    useEffect(() => {
        interval = setTimeout(() => {
            setTime(true)
        }, 4000);
    }, []);

    const isUser = () => {
        if (notification.user) {
            if (notification.user.id === user._id) return true;
            else return false;
        }
    }

    return (
        <section>
            {(notification && !isTimePass) && <div className="notification-msg">
                <p>{`${notification.message} ${isUser? 'You' : notification.user.fullName}`}</p>
            </div>}
        </section>
    )
}
