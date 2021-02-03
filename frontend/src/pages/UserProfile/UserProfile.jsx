import { Component } from 'react';
import { connect } from 'react-redux';
import { setUser, updateUser } from '../../store/actions/userActions';
import { getLoggedInUser } from '../../store/actions/authActions';
import { Link } from 'react-router-dom';
import { uploadImg } from './../../services/img-upload-service';

import { MainHeader } from '../../cmps/MainHeader/MainHeader';
import Loading from './../../assets/loading.gif';
import profilePic from './../../assets/profile-logo.png';

import './UserProfile.scss';
import { eventBus } from '../../services/eventBusService';

export class _UserProfile extends Component {

    state = {
        userToEdit: null,
        isLoading: false
    }

    async componentDidMount() {
        // const userId = this.props.match.params.id;
        // console.log(this.props.user)
        // const user = await this.props.setUser(userId);
        await this.props.getLoggedInUser();
        let { user } = this.props;
        this.setState({ userToEdit: user });

        eventBus.on('invite-to-card', (info => {
            if (info.member._id === user._id) {
                user.cardMember = info.card._id;
                this.setState({ userToEdit: user }, async () => {
                    await this.props.updateUser(user)
                })
                // eventBus.emit('add-to-notification', {txt: `You were added to card - ${info.card.title}
                // as a member`});
            }
        }))
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
        console.log(this.state.userToEdit)
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
                {user && <section className="user-profile-container">
                    <h1 className="headline">Welcome {user.fullName}!</h1>
                    <h2>Your personal info:</h2>
                    <form onSubmit={this.updateUser}>
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
                        <button>Save</button>
                    </form>
                    <h3>Your Boards:</h3>
                    {user.boardsMember && user.boardsMember.length ? <ul>
                        {user.boardsMember.map((board, idx) => {
                            return <li key={idx}>
                                Board title: <Link to={`/treller/board/${board._id}`}>{board.title}</Link></li>
                        })}
                    </ul>
                        : <p>You don't have any board yet.. <Link to="/treller">Add one!</Link></p>}
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