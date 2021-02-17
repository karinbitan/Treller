import { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getLoggedInUser } from '../../store/actions/authActions';

import { MainHeader } from '../../cmps/MainHeader/MainHeader';
import Banner from './../../assets/home-banner.png';

import './HomePage.scss';

export class _HomePage extends Component {

    // async componentDidMount() {
    //     await this.props.getLoggedInUser();
    // }

    render() {
        const { user } = this.props;
        return (
            <section className="home-page">
                <div className="home-page-container flex space-between">
                    <p>
                        <span className="head-line">Treller helps your team achieve more.</span>
                        <br />
                        Organize, manage and connect with Treller! <br />
                        <Link className="start-now-link" to="/login">Start now</Link>
                    </p>
                    <img src={Banner} alt="banner" />
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