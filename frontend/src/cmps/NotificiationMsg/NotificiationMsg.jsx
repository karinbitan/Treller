import { useEffect, useState } from 'react';
import './NotificiationMsg.scss';

export function NotificiationMsg({ notification, user }) {
    const [isTimePass, setTime] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setTime(true)
        }, 4000);
        setTime(false)
    }, [notification]);

    const isUser = () => {
        if (notification.byUser) {
            const isUser = (notification.byUser._id === user._id ? 'You' : notification.byUser.fullName);
            return isUser;
        } else return ''
    }

    return (
        <section>
            {(notification && !isTimePass) && <div className="notification-msg">
                <p>{`${notification.message} ${notification.byUser ? 'by' : ''} ${isUser()}`}</p>
            </div>}
        </section>
    )
}
