import { connect } from 'react-redux';
import { logout } from '../../store/actions/authActions';
import { addBoard } from '../../store/actions/boardActions';
import { Link, NavLink } from 'react-router-dom';
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

    useEffect(() => {
        if (isAvatarOptionsOpen) {
            toggleNotificationsOptions(false);
        }
    }, [isAvatarOptionsOpen])

    const logout = async () => {
        await props.logout();
        toggleAvatarOptions(false)
    }

    const { user, board, isHomePage, isUserPage, boardNotifications, userNotifications } = props;
    return (
        <header style={{ backgroundColor: board ? 'rgba(0,0,0,.15)' : (isHomePage || isUserPage) ? 'rgb(5, 97, 150)' : '' }}>
            {user && <section className="main-header flex align-center">
                {!isHomePage && <div className="menu-container flex align-center">
                    <button className="icon-container no-button">
                        <NavLink to="/"><img className="icon" src={Home} alt="home" /></NavLink>
                    </button>
                    <div>
                        <button className="icon-container no-button">
                            <Link to={`/user/${user._id}/boards`}><img className="icon" src={Logo} alt="boards" /></Link>
                        </button>
                    </div>
                    <Filter />
                </div>}
                <div className="logo">
                    {board ?
                        <Link to={`/treller/board/${board._id}`} className="logo"><img className="icon" src={Logo} alt="logo" />Treller</Link>
                        : user ? <Link to={`/user/${user._id}/boards`} className="logo"><img className="icon" src={Logo} alt="logo" />Treller</Link>
                            : <Link to="/"></Link>
                    }
                </div>
                <div className="menu-container flex flex-end align-center">
                    {!isHomePage && <div className="flex">
                        <button className="icon-container no-button" onClick={() => toggleNotificationsOptions(!isNotificationOptionOpen)}>
                            <img className="icon" src={Notification} alt="notifications" />
                        </button>
                        {isNotificationOptionOpen && <Notifications
                            closePopUp={() => toggleNotificationsOptions(false)}
                            boardNotifications={boardNotifications}
                            userNotifications={userNotifications}
                        />}
                    </div>}
                    {user && <Avatar className="avatar-member" name={user.fullName} size="40" round={true}
                        onClick={() => toggleAvatarOptions(!isAvatarOptionsOpen)} />}
                    {(user && isAvatarOptionsOpen) && <div className="avatar-options">
                        <h4 className="options-headline">Account</h4>
                        <ul>
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