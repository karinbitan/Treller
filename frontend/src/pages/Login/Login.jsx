import { useRef, useState } from 'react';
import { userService } from '../../services/userSercvice';
import { connect } from 'react-redux';
import { login, signup } from '../../store/actions/authActions';

import './Login.scss'

export function _Login(props) {
    const loginRef = useRef();
    const signUpRef = useRef();
    const newUser = userService.getEmptyUser();
    const [signUpCred, setSignUpCred] = useState(newUser)
    const [loginCred, setLoginCred] = useState({ userName: '', password: '' })
    const [loginType, setLoginType] = useState('');
    const [isLoginFailed, toggleIsLoginFailed] = useState(false);
    const [isSignUpFailed, toggleIsSignUpFailed] = useState(false);


    const login = async (ev) => {
        ev.preventDefault();
        const user = await props.login(loginCred);
        if (!user) {
            const emptyLoginCred = {
                userName: '',
                password: ''

            }
            setLoginCred(emptyLoginCred)
            toggleIsLoginFailed(true)
        } else {
            props.history.push(`/user/${user._id}/boards`);
        }
    }

    const signup = async (ev) => {
        ev.preventDefault();
        const user = await props.signup(signUpCred);
        if (!user) {
            setSignUpCred(newUser)
            toggleIsSignUpFailed(true)
        } else {
            props.history.push(`/user/${user._id}/boards`);
        }
    }

    return (
        <section className="login-container">
            <h1 className="logo">Treller</h1>
            <p><span className="cred-type" onClick={() => setLoginType('signUp')}>Sign Up </span>
                     || <span className="cred-type" onClick={() => setLoginType('login')}>Login</span></p>
            {loginType === 'signUp' && <div className="account signup">
                <h3>Sign Up To Treller</h3>
                <form onSubmit={signup} className="flex column">
                    <input type="text" name="fullName" onChange={(ev) => setSignUpCred({ ...signUpCred, [ev.target.name]: ev.target.value })}
                        placeholder="Enter full name" ref={signUpRef} value={signUpCred.fullName} /><br />
                    <input type="text" name="userName" onChange={(ev) => setSignUpCred({ ...signUpCred, [ev.target.name]: ev.target.value })}
                        placeholder="Enter user name" value={signUpCred.userName} /><br />
                    <input type="password" name="password" onChange={(ev) => setSignUpCred({ ...signUpCred, [ev.target.name]: ev.target.value })}
                        placeholder="Enter password" value={signUpCred.password} /><br />
                        {isSignUpFailed && <p className="login-failed">Sign Up failed, please try again</p>}
                    <button>Sign Up</button>
                </form>
            </div>}
            {loginType === 'login' && <div className="account login">
                <h3>Log In To Treller</h3>
                <form onSubmit={login} className="flex column">
                    <input type="text" name="userName" value={loginCred.userName} ref={loginRef}
                        onChange={(ev) => setLoginCred({ ...loginCred, [ev.target.name]: ev.target.value })} placeholder="Enter user name" /><br />
                    <input type="password" name="password" value={loginCred.password}
                        onChange={(ev) => setLoginCred({ ...loginCred, [ev.target.name]: ev.target.value })} placeholder="Enter password" /><br />
                    {isLoginFailed && <p className="login-failed">Login failed, please try again</p>}
                    <button>Login</button>
                </form>
            </div>}
        </section>
    )
}


const mapDispatchToProps = {
    login,
    signup
}
export const Login = connect(null, mapDispatchToProps)(_Login)