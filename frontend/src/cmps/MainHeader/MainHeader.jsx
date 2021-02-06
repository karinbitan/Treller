import { Component } from 'react';
import Avatar from 'react-avatar';
import Logo from './../../assets/treller-logo.png';
// import Menu from './../../assets/menu-icon.png';
import Home from './../../assets/home-icon.png';
import Notification from './../../assets/bell-icon.png';
import LoginIcon from './../../assets/login-icon.png';

import { connect } from 'react-redux';
import { logout } from '../../store/actions/authActions';
import { addBoard } from '../../store/actions/boardActions';
import { Link, NavLink } from 'react-router-dom';

import './MainHeader.scss';
import { MainHeaderOptions } from '../MainHeaderOptions/MainHeaderOptions';
import { Filter } from '../Filter/Filter';
import { boardService } from '../../services/boardService';
import { eventBus } from '../../services/eventBusService';

class _MainHeader extends Component {

    state = {
        isAvatarOptionsOpen: false,
        isBoardOptionOpen: false,
        isNotifOptionOpen: false,
        mainHeaderOptionsType: '',
    }

    async componentDidMount() {
        // await this.props.getLoggedInUser();
    }

    toggleAvatarOptions = () => {
        this.setState({ isAvatarOptionsOpen: !this.state.isAvatarOptionsOpen })
    }

    toggleMainHeaderOptions = (type) => {
        if (type === 'Board') {
            this.setState({ isBoardOptionOpen: !this.state.isBoardOptionOpen })
        } else {
            this.setState({ isNotifOptionOpen: !this.state.isNotifOptionOpen })
        }
    }

    openMainHeaderOptions = (type) => {
        this.toggleMainHeaderOptions(type);
        this.setState({ mainHeaderOptionsType: type })
    }

    logout = async () => {
        await this.props.logout();
        this.setState({ isAvatarOptionsOpen: !this.state.isAvatarOptionsOpen })
    }

    onAddBoard = async () => {
        const emptyBoard = boardService.getEmptyBoard();
        const board = await this.props.addBoard(emptyBoard);
        eventBus.emit('newBoardAddes', board._id)
    }

    test = () => {
        console.log('!')
    }

    render() {
        const { user, board, isHomePage, isUserPage } = this.props;
        const { isAvatarOptionsOpen, isBoardOptionOpen, isNotifOptionOpen, mainHeaderOptionsType } = this.state;
        return (
            <header style={{ backgroundColor: board ? 'rgba(0,0,0,.15)' : (isHomePage || isUserPage) ? 'rgb(5, 97, 150)' : '' }}>
                <section className="main-header flex align-center">
                    {!isHomePage && <div className="menu-container flex align-center">
                        <button className="icon-container no-button">
                            <NavLink to={`/user/${user._id}/boards`}><img className="icon" src={Home} alt="home" /></NavLink>
                        </button>
                        <div>
                            <button className="icon-container no-button" onClick={() => this.openMainHeaderOptions('Boards')}>
                                <img className="icon" src={Logo} alt="boards" />
                            </button>
                            {(isBoardOptionOpen && user) && <MainHeaderOptions
                                type={mainHeaderOptionsType} boards={user.boardsMember}
                                closePopUp={this.toggleMainHeaderOptions} />}
                        </div>
                        <Filter />
                    </div>}
                    <div className="logo">
                        {!isHomePage ?
                            <Link to="/treller" className="logo"><img className="icon" src={Logo} alt="logo" />Treller</Link>
                            : <Link to="/" className="logo"><img className="icon" src={Logo} alt="logo" />Treller</Link>
                        }
                    </div>
                    <div className="menu-container flex flex-end align-center">
                        {!isHomePage && <div className="flex">
                            <button className="icon-container no-button" onClick={() => this.openMainHeaderOptions('Notifications')}>
                                <img className="icon" src={Notification} alt="notifications" />
                            </button>
                            {(isNotifOptionOpen && user) && <MainHeaderOptions
                                type={mainHeaderOptionsType}
                                boards={user.boardsMember}
                                closePopUp={this.toggleMainHeaderOptions}
                                onAddBoard={this.onAddBoard}
                            />}
                        </div>}
                        {user && <Avatar className="avatar-member" name={user.fullName} size="40" round={true} onClick={this.toggleAvatarOptions} />}
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
                    </div>
                </section>
            </header>
        )
    }
}

const mapDispatchToProps = {
    logout,
    addBoard
}
export const MainHeader = connect(null, mapDispatchToProps)(_MainHeader)