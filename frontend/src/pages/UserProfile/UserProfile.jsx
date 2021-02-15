import { Component } from 'react';
import { connect } from 'react-redux';
import { setUser, updateUser } from '../../store/actions/userActions';
import { getLoggedInUser } from '../../store/actions/authActions';
import { uploadImg } from './../../services/img-upload-service';
import Avatar from 'react-avatar';

import { MainHeader } from '../../cmps/MainHeader/MainHeader';
import Loading from './../../assets/loading.gif';
import profilePic from './../../assets/profile-logo.png';

import './UserProfile.scss';

export class _UserProfile extends Component {

    state = {
        userToEdit: null,
        isLoading: false
    }

    async componentDidMount() {
        await this.props.getLoggedInUser();
        let { user } = this.props;
        this.setState({ userToEdit: user });
    }

    uploadImgProfile = async (ev) => {
        this.setState({ isLoading: true });
        const res = await uploadImg(ev);
        const field = 'imgUrl';
        const value = res.url;
        this.setState(prevState => ({ userToEdit: { ...prevState.userToEdit, [field]: value } }));
        this.setState({ isLoading: false })
    }

    handleChange = ({ target }) => {
        const field = target.name;
        const value = target.value;
        this.setState(prevState => ({ userToEdit: { ...prevState.userToEdit, [field]: value } }));
    }

    updateUser = async (ev) => {
        ev.preventDefault();
        await this.props.updateUser(this.state.userToEdit)
    }


    render() {
        const { user } = this.props;
        const { isLoading, userToEdit } = this.state;
        return (
            <section className="user-profile">
                <MainHeader isUserPage={true} user={user} />
                {user && <section className="user-profile-container container">
                    <h1 className="headline flex justify-center">
                        <Avatar name={user.fullName} round={true} size={40} />
                        {user.fullName}
                    </h1>
                    <div className="info-container flex column align-center">
                        <h3>Your personal info:</h3>
                        <form onSubmit={this.updateUser} className="flex column">
                            {!isLoading ?
                                <label>Choose your profile picture:
                                <br />
                                    {userToEdit && <img className="profile-picture"
                                        src={userToEdit.imgUrl ? userToEdit.imgUrl : profilePic} alt="profile-pic" />}
                                    <br />
                                    <input type="file" name="imgUrl" id="imgUploader" onChange={this.uploadImgProfile} />
                                </label>
                                : <img src={Loading} width="200" height="200" alt="loading-gif" />}
                            <br />
                            <label>Full name:
                            <input type="text" value={user.fullName} onChange={this.handleChange}
                                    name="fullName" />
                            </label>
                            <br />
                            <label>User name:
                            <input type="text" value={user.userName} onChange={this.handleChange}
                                    name="userName" />
                            </label>
                            <br />
                            <button className="save-profile">Save</button>
                        </form>
                    </div>
                </section>}
            </section>
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
    updateUser
}
export const UserProfile = connect(mapStateToProps, mapDispatchToProps)(_UserProfile)