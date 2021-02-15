import { Link, useLocation } from 'react-router-dom';
import './Notifications.scss';

export function Notifications(props) {
    const location = useLocation();

    return (
        <div className="main-header-options">
            <button onClick={props.closePopUp} className="close-btn"><i className="fas fa-times"></i></button>
            <div>
                <p>{props.type}</p>
                {(props.notifications && props.notifications.length > 0) && <ul>
                    {props.notifications.map((notification, idx) => {
                        return <li key={idx}>
                            <span onClick={props.closePopUp}><Link to={{
                                pathname: `/treller/card/${notification.cardId}`,
                                state: { background: location }
                            }}>{`${notification.message}`}</Link></span>
                        </li>
                    })}
                </ul>}
            </div>
        </div>)
}