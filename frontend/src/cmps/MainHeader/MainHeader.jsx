import { Component } from 'react';
import Avatar from 'react-avatar';
import Logo from './../../assets/treller-logo.png';
// import Menu from './../../assets/menu-icon.png';
import Home from './../../assets/home-icon.png';
import Add from './../../assets/add-icon.png';
import Notification from './../../assets/bell-icon.png';
import LoginIcon from './../../assets/login-icon.png';

import { connect } from 'react-redux';
import { setUser } from '../../store/actions/userActions';
import { getLoggedInUser, logout } from '../../store/actions/authActions';
import { Link, NavLink } from 'react-router-dom';

import './MainHeader.scss';
import { MainHeaderOptions } from '../MainHeaderOptions/MainHeaderOptions';
import { Filter } from '../Filter/Filter';

class _MainHeader extends Component {

    state = {
        isAvatarOptionsOpen: false,
        isMainHeaderOptionsOpen: false,
        mainHeaderOptionsType: ''
    }

    async componentDidMount() {
        await this.props.getLoggedInUser();
        await this.props.setUser(this.props.user._id);
    }

    toggleAvatarOptions = () => {
        if (this.state.mainHeaderOptionsType) {
            this.setState({ isMainHeaderOptionsOpen: false })
        }
        this.setState({ isAvatarOptionsOpen: !this.state.isAvatarOptionsOpen })
    }

    toggleMainHeaderOptions = () => {
        this.setState({ isMainHeaderOptionsOpen: !this.state.isMainHeaderOptionsOpen })
    }

    openMainHeaderOptions = (type) => {
        this.toggleMainHeaderOptions();
        this.setState({ mainHeaderOptionsType: type })
    }

    logout = async () => {
        await this.props.logout();
        this.setState({ isAvatarOptionsOpen: !this.state.isAvatarOptionsOpen })
    }

    render() {
        const { user } = this.props;
        const { isAvatarOptionsOpen, isMainHeaderOptionsOpen, mainHeaderOptionsType } = this.state;
        return (
            <header>
                <section className="main-header flex align-center">
                    <div className="menu-container flex align-center">
                        <button className="icon-container no-button">
                            <NavLink to="/treller"><img className="icon" src={Home} alt="home" /></NavLink>
                        </button>
                        <button className="icon-container no-button" onClick={() => this.openMainHeaderOptions('Boards')}>
                            <img className="icon" src={Logo} alt="boards" />
                        </button>
                        <Filter />
                    </div>
                    <div className="logo">
                        <NavLink to="/treller" className="logo"><img className="icon" src={Logo} alt="logo" />Treller</NavLink>
                    </div>
                    <div className="menu-container flex flex-end align-center">
                        <button className="icon-container no-button" onClick={() => this.openMainHeaderOptions('Create')}>
                            <img className="icon" src={Add} alt="add" />
                        </button>
                        <button className="icon-container no-button" onClick={() => this.openMainHeaderOptions('Notifications')}>
                            <img className="icon" src={Notification} alt="notifications" />
                        </button>
                        {user && <Avatar name={user.fullName} size="40" round={true} onClick={this.toggleAvatarOptions} />}
                        {(user && isAvatarOptionsOpen) && <div className="avatar-options">
                            <p>Account</p>
                            <ul>
                                <li onClick={this.toggleAvatarOptions}><Link to={`/user/${user._id}`}>Profile</Link></li>
                                <li onClick={this.logout}><Link to="/">Log Out</Link></li>
                            </ul>
                        </div>}
                        {!user && <div>
                            <button className="icon-container no-button">
                                <Link to="/login"><img className="icon" src={LoginIcon} alt="login icon" /></Link>
                            </button>
                        </div>}
                        {(isMainHeaderOptionsOpen && user) && <MainHeaderOptions type={mainHeaderOptionsType} boards={user.boardsMember} closePopUp={this.toggleMainHeaderOptions} />}
                    </div>
                </section>
            </header>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.userReducer.loggedInUser
    }
}
const mapDispatchToProps = {
    setUser,
    getLoggedInUser,
    logout
}
export const MainHeader = connect(mapStateToProps, mapDispatchToProps)(_MainHeader)