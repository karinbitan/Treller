import { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getLoggedInUser } from '../../store/actions/authActions';
import LoginIcon from './../../assets/login-icon.png';
import Logo from './../../assets/treller-logo.png';

import Banner from './../../assets/home-banner.png';

import './HomePage.scss';

export class _HomePage extends Component {

    // async componentDidMount() {
    //     await this.props.getLoggedInUser();
    // }

    render() {
        return (
            <section className="home-page">
                <header className="flex space-between">
                <div className="logo">
                    <Link className="logo" to="/"><img width="20" src={Logo} alt="logo" />Treller</Link>
                </div>
                    <Link to="/login" className="loggin-btn"><img width="20" src={LoginIcon} alt="login-icon" /></Link>
                </header>
                <div className="home-page-container flex space-between">
                    <p>
                        <span className="head-line">Treller helps your team achieve more.</span>
                        <br />
                        Organize, manage and connect with Treller! <br />
                        <Link className="start-now-link" to="/login">Start now</Link>
                    </p>
                    <img className="banner" src={Banner} alt="banner" />
                </div>
            </section>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.userReducer.loggedInUser,
    }
}

const mapDispatchToProps = {
    getLoggedInUser
}
export const HomePage = connect(mapStateToProps, mapDispatchToProps)(_HomePage)