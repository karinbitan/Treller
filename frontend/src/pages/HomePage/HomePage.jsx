import { Component } from 'react';
import { Link } from 'react-router-dom';
import { MainHeader } from '../../cmps/MainHeader/MainHeader';
import Banner from './../../assets/home-banner.png';

import './HomePage.scss';

export class HomePage extends Component {

    render() {
        return (
            <section className="home-page">
                <MainHeader isHomePage={true} />
                <div className="home-page-container flex space-between">
                    <p>
                        <span className="head-line">Treller helps your team achieve more.</span>
                        <br />
                        Organize, manage and connect with Treller! <br />
                        <button><Link to="/login">Start now</Link></button>
                    </p>
                    <img src={Banner} alt="banner" />
                </div>
            </section>
        )
    }
}

