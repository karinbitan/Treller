import { connect } from 'react-redux';
import { logout } from '../../store/actions/authActions';
import { addBoard } from '../../store/actions/boardActions';
import { Link, useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Logo from './../../assets/treller-logo.png';
import Home from './../../assets/home-icon.png';
import Notification from './../../assets/bell-icon.png';
import LoginIcon from './../../assets/login-icon.png';
import { Notifications } from '../Notifications/Notifications';
import { Filter } from '../Filter/Filter';

import './MainHeader.scss';
import { AvatarOptions } from '../AvatarOptions/AvatarOptions';

function _MainHeader(props) {
    const [isNotificationOptionOpen, toggleNotificationsOptions] = useState(false);
    const { user, board, isUserPage } = props;
    const history = useHistory();

    const logout = async () => {
        await props.logout();
        history.push('/')
    }

    const unreadNotificationNumber = () => {
        if (user) {
            if (user.notifications && user.notifications.length > 0) {
                let notifications = user.notifications;
                const unreadNotifications = notifications.filter(notification => {
                    return notification.status.isSeen === false;
                })
                return unreadNotifications.length;
            }
        }
    }

    return (
        <header style={{ backgroundColor: board ? 'rgba(0,0,0,.15)' : isUserPage ? 'rgb(5, 97, 150)' : '' }}>
            {user && <section className="main-header flex align-center">
                <div className="menu-container flex align-center">
                    <button className="icon-container">
                        <Link to={`/user/${user._id}/boards`}><img className="icon" src={Home} alt="home" /></Link>
                    </button>
                    <div>
                        <button className="icon-container">
                            <Link to={`/user/${user._id}/boards`}><img className="icon" src={Logo} alt="boards" /></Link>
                        </button>
                    </div>
                    <Filter user={user} />
                </div>
                <div className="logo">
                    {board ?
                        <Link to={`/treller/board/${board._id}`} className="logo"><img className="icon" src={Logo} alt="logo" />Treller</Link>
                        : user ? <Link to={`/user/${user._id}/boards`} className="logo"><img className="icon" src={Logo} alt="logo" />Treller</Link>
                            : <Link to="/" className="logo"><img className="icon" src={Logo} alt="logo" />Treller</Link>
                    }
                </div>
                <div className="menu-container flex flex-end align-center">
                    <div className="flex relative">
                        {unreadNotificationNumber() ? <span className="notification-badge">{unreadNotificationNumber()}</span> : ''}
                        <button className="icon-container" onClick={() => toggleNotificationsOptions(!isNotificationOptionOpen)}>
                            <img className="icon" src={Notification} alt="notifications" />
                        </button>
                        {isNotificationOptionOpen && <Notifications
                            closePopUp={() => toggleNotificationsOptions(false)}
                            user={user}
                        />}
                    </div>
                    {user ? <AvatarOptions user={user} onLogout={logout} />
                    : <div>
                        <button className="icon-container">
                            <Link to="/login"><img className="icon" src={LoginIcon} alt="login icon" /></Link>
                        </button>
                    </div>}
                </div>
            </section>}
        </header>
    )
}

const mapDispatchToProps = {
    logout,
    addBoard
}
export const MainHeader = connect(null, mapDispatchToProps)(_MainHeader)