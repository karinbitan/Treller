import { Component } from 'react';
import Avatar from 'react-avatar';
import { connect } from 'react-redux';
import { getUsers } from '../../store/actions/userActions';

import './InviteMembers.scss';

class _InviteMembers extends Component {
    state = {
        isInviteMenuOpen: false,
        filter: {
            txt: ''
        },
        searchResult: []
    }

    componentWillUnmount() {
        const emptyFilter = { txt: '' }
        this.setState({ filter: emptyFilter })
    }

    toggleInviteMenu = () => {
        this.setState({ isInviteMenuOpen: !this.state.isInviteMenuOpen })
    }

    handleChangeInvite = ({ target }) => {
        const field = target.name;
        const value = target.value;
        this.setState(prevState => ({ filter: { ...prevState.filter, [field]: value } }), () => {
            this.filterUsers(this.state.filter)
        });
    }

    filterUsers = async (filter) => {
        const res = await this.props.getUsers(filter);
        this.setState({ searchResult: res })
    }

    onInviteMember = (member) => {
        if (this.isMember(member._id)) return;
        this.setState({ isInviteMenuOpen: false })
        this.props.inviteMemberToBoard(member);
    }

    isMember = (userId) => {
        const { board } = this.props;
        const isMember = board.members.some(member => {
            return member._id === userId
        })
        return isMember;
    }

    isUser = (userId) => {
        const { user } = this.props;
        if (user._id === userId) return true;
        else return false;
    }

    render() {
        const { isInviteMenuOpen, searchResult } = this.state;
        return (
            <section className="invite-container" >
                <button onClick={this.toggleInviteMenu} className="board-header-icon invite-btn">Invite</button>
                { isInviteMenuOpen && <div className="invite pop-up">
                    <button onClick={this.toggleInviteMenu} className="close-btn"><i className="fas fa-times"></i></button>
                    <p className="headline">Invite</p>
                    <form className="invite-form">
                        <input className="invite-search" type="search" name="txt" onChange={this.handleChangeInvite}
                            placeholder="Enter full name or user name" />
                        {/* <button>
                            <i className="fa fa-search search-icon"></i>
                        </button> */}
                    </form>
                    {(searchResult && searchResult.length > 0) && <div>
                        <ul className="result-container">
                            {searchResult.map(user => {
                                if (this.isUser(user._id)) return;
                                return (
                                    <li onClick={() => this.onInviteMember(user)}
                                        className={`flex align-center ${this.isMember(user._id) ? 'already-member' : ''}`}
                                        title={`${this.isMember(user._id) ? 'This user is already a member in this board' : ''}`}
                                        key={user._id}>
                                        <Avatar name={user.fullName} size={20} round={true} />
                                        <span className="user-name">{user.fullName}</span>
                                    </li>)
                            })}
                        </ul>
                    </div>}
                </div>}
            </section>
        )
    }
}

const mapDispatchToProps = {
    getUsers
}

export const InviteMembers = connect(null, mapDispatchToProps)(_InviteMembers)