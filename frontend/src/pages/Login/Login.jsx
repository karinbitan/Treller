import { Component } from 'react';
import { userService } from '../../services/userSercvice';
import { connect } from 'react-redux';
import { login, signup } from '../../store/actions/authActions';

import './Login.scss'

export class _Login extends Component {

    state = {
        signup: null,
        loginCred: {
            userName: '',
            password: ''
        },
        isLogin: false,
        isSignup: false
    }

    componentDidMount() {
        const newUser = userService.getEmptyUser();
        this.setState({ signup: newUser })
    }

    componentWillUnmount() {
        this.setState({ isLogin: false, isSignup: false })
    }

    handleChangeSignUp = ({ target }) => {
        const field = target.name;
        const value = target.value;
        this.setState(prevState => ({ signup: { ...prevState.signup, [field]: value } }));
    }

    handleChangeLogin = ({ target }) => {
        const field = target.name;
        const value = target.value;
        this.setState(prevState => ({ loginCred: { ...prevState.loginCred, [field]: value } }));
    }

    closeModal = async () => {
        this.props.history.push('/');
    }

    login = async (ev) => {
        ev.preventDefault();
        const user = await this.props.login(this.state.loginCred);
        if (!user) {
            const loginCred = {
                userName: '',
                password: ''
                
            }
            this.setState({ loginCred })
            alert('Login failed!');
        } else {
            this.props.history.push(`/user/${user._id}/boards`);
            // this.props.history.push(`/user/${user._id}`);
        }
    }

    signup = async (ev) => {
        ev.preventDefault();
        await this.props.signup(this.state.signup);
        this.setState({ signup: null });
        this.props.history.push('/user/id');
    }

    render() {
        const { isLogin, isSignup, loginCred } = this.state;
        return (
            <section className="login-container container">
                <h1 className="logo">Treller</h1>
                <p><span className="cred-type" onClick={() => this.setState({ isSignup: true, isLogin: false })}>Sign Up </span>
                     || <span className="cred-type" onClick={() => this.setState({ isLogin: true, isSignup: false })}>Login</span></p>
                {isLogin && <div className="account login">
                    <h3>Log In To Treller</h3>
                    <form onSubmit={this.login} className="flex column">
                        <input type="text" name="userName" value={loginCred.userName}
                         onChange={this.handleChangeLogin} placeholder="Enter user name" /><br />
                        <input type="password" name="password" value={loginCred.password}
                         onChange={this.handleChangeLogin} placeholder="Enter password" /><br />
                        <button>Login</button>
                    </form>
                </div>}
                {isSignup && <div className="account signup">
                    <h3>Sign Up To Treller</h3>
                    <form onSubmit={this.signup} className="flex column">
                        <input type="text" name="fullName" onChange={this.handleChangeSignUp} placeholder="Enter full name" /><br />
                        <input type="text" name="userName" onChange={this.handleChangeSignUp} placeholder="Enter user name" /><br />
                        <input type="password" name="password" onChange={this.handleChangeSignUp} placeholder="Enter password" /><br />
                        <button>Sign Up</button>
                    </form>
                </div>}
            </section>
        )
    }
}


const mapDispatchToProps = {
    login,
    signup
}
export const Login = connect(null, mapDispatchToProps)(_Login)