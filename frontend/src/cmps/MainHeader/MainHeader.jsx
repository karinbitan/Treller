import { connect } from 'react-redux';
import { logout } from '../../store/actions/authActions';
import { addBoard } from '../../store/actions/boardActions';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Avatar from 'react-avatar';
import Logo from './../../assets/treller-logo.png';
import Home from './../../assets/home-icon.png';
import Notification from './../../assets/bell-icon.png';
import LoginIcon from './../../assets/login-icon.png';
import { Notifications } from '../Notifications/Notifications';
import { Filter } from '../Filter/Filter';

import './MainHeader.scss';

function _MainHeader(props) {
    const [isAvatarOptionsOpen, toggleAvatarOptions] = useState(false);
    const [isNotificationOptionOpen, toggleNotificationsOptions] = useState(false);
    const { user, board, isUserPage } = props;

    useEffect(() => {
        unreadNotificationNumber();
        if (isAvatarOptionsOpen) {
            toggleNotificationsOptions(false);
        }
    }, [isAvatarOptionsOpen])

    const logout = async () => {
        await props.logout();
        toggleAvatarOptions(false)
    }

    const unreadNotificationNumber = () => {
        if (user.notifications && user.notifications.length > 0) {
            let notifications = user.notifications;
            const unreadNotifications = notifications.filter(notification => {
                return notification.status.isSeen === false;
            })
            return unreadNotifications.length;
        }
    }

    return (
        <header style={{ backgroundColor: board ? 'rgba(0,0,0,.15)' : isUserPage ? 'rgb(5, 97, 150)' : '' }}>
            {user && <section className="main-header flex align-center">
                <div className="menu-container flex align-center">
                    <button className="icon-container no-button">
                        <Link to={`/user/${user._id}/boards`}><img className="icon" src={Home} alt="home" /></Link>
                    </button>
                    <div>
                        <button className="icon-container no-button">
                            <Link to={`/user/${user._id}/boards`}><img className="icon" src={Logo} alt="boards" /></Link>
                        </button>
                    </div>
                    <Filter user={user} />
                </div>
                <div className="logo">
                    {board ?
                        <Link to={`/treller/board/${board._id}`} className="logo"><img className="icon" src={Logo} alt="logo" />Treller</Link>
                        : user ? <Link to={`/user/${user._id}/boards`} className="logo"><img className="icon" src={Logo} alt="logo" />Treller</Link>
                            : <Link to="/"></Link>
                    }
                </div>
                <div className="menu-container flex flex-end align-center">
                    <div className="flex relative">
                        {unreadNotificationNumber() ? <span className="notification-badge">{unreadNotificationNumber()}</span> : ''}
                        <button className="icon-container no-button" onClick={() => toggleNotificationsOptions(!isNotificationOptionOpen)}>
                            <img className="icon" src={Notification} alt="notifications" />
                        </button>
                        {isNotificationOptionOpen && <Notifications
                            closePopUp={() => toggleNotificationsOptions(false)}
                            user={user}
                        />}
                    </div>
                    {user && <Avatar className="avatar-member" name={user.fullName} size="40" round={true}
                        onClick={() => toggleAvatarOptions(!isAvatarOptionsOpen)} />}
                    {(user && isAvatarOptionsOpen) && <div className="avatar-options">
                        <button onClick={() => toggleAvatarOptions(false)} className="close-btn"><i className="fas fa-times"></i></button>
                        <p className="options-headline">Account</p>
                        <Avatar className="avatar-member-popup" name={user.fullName} size="40" round={true} />
                        <ul>
                            <div className="account-info">
                                <li className="full-name flex">{user.fullName}</li>
                                <li className="user-name flex">{user.userName}</li>
                            </div>
                            <li><Link to={`/user/${user._id}/boards`}>Boards</Link></li>
                            <li onClick={() => toggleAvatarOptions(false)}><Link to={`/user/${user._id}`}>Profile</Link></li>
                            <li onClick={logout}><Link to="/">Log Out</Link></li>
                        </ul>
                    </div>}
                    {!user && <div>
                        <button className="icon-container no-button">
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