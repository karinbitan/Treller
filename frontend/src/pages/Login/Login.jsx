import { Component } from 'react';
import { userService } from '../../services/userSercvice';
import { connect } from 'react-redux';
import { login, signup } from '../../store/actions/authActions';

import './Login.scss'

export class _Login extends Component {

    state = {
        signup: null,
        login: {
            userName: '',
            password: ''
        }
    }

    componentDidMount() {
        const newUser = userService.getEmptyUser();
        this.setState({ signup: newUser })
    }

    handleChangeSignUp = ({ target }) => {
        const field = target.name;
        const value = target.value;
        this.setState(prevState => ({ signup: { ...prevState.signup, [field]: value } }));
    }

    handleChangeLogin = ({ target }) => {
        const field = target.name;
        const value = target.value;
        this.setState(prevState => ({ login: { ...prevState.login, [field]: value } }));
    }

    closeModal = async ()=>{
        this.props.history.push('/');
    }

    login = async (ev) => {
        ev.preventDefault();
        try {
            const user = await this.props.login(this.state.login);
            this.setState({ login: { userName: '', password: '' } });
            if(user){
                this.props.history.push(`/user/${user._id}`);
            } else {
                alert('Login failed!')
            }
        } catch (err) {
            alert('Login failed!!!')
        }
    }

    signup = async (ev) => {
        ev.preventDefault();
        await this.props.signup(this.state.signup);
        this.setState({ signup: null });
        this.props.history.push('/user/id');
    }



    render() {
        return (
            <section className="login modal">
                <div className="modal-content">
                    <button className="modal-close-btn" onClick={this.closeModal}><i className="fas fa-times"></i></button>
                    <h1>Welcome to Treller!</h1>
                    <div className="flex justify-center">
                        <div className="signup-container">
                            <p>If you don't have an account yet..</p>
                            <h3>Sign up</h3>
                            <form onSubmit={this.signup}>
                                <label>Full name: <input type="text" name="fullName" onChange={this.handleChangeSignUp} /></label><br />
                                <label>User name: <input type="text" name="userName" onChange={this.handleChangeSignUp} /></label><br />
                                <label>Password: <input type="password" name="password" onChange={this.handleChangeSignUp} /></label><br />
                                <button>Sign Up</button>
                            </form>

                        </div>
                        <div className="login-container">
                            <p>If you already have an account..</p>
                            <h3>Login</h3>
                            <form onSubmit={this.login}>
                                <label>User name: <input type="text" name="userName" onChange={this.handleChangeLogin} /></label><br />
                                <label>Password: <input type="password" name="password" onChange={this.handleChangeLogin} /></label><br />
                                <button>Login</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}


const mapDispatchToProps = {
    login,
    signup
}
export const Login = connect(null, mapDispatchToProps)(_Login)