import { Component } from 'react';
import Banner from './../../assets/home-banner.png';

import './HomePage.scss';

export class HomePage extends Component {

    render() {
        return (
            <section className="home-page">
                <h1 className="head-line">Welcome to Treller!</h1>
                <div className="flex space-between">
                    <p className="text">Organize, manage and connect with Treller! Log in now..<br />
                    </p>
                    <img src={Banner} alt="banner" />
                </div>
            </section>
        )
    }
}

