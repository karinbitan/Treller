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

    toggleInviteMenu = () => {
        this.setState({ isInviteMenuOpen: !this.state.isInviteMenuOpen })
    }

    handleChangeInvite = ({ target }) => {
        const field = target.name;
        const value = target.value;
        this.setState(prevState => ({ filter: { ...prevState.filter, [field]: value } }), () => {
            this.filterUsers(this.state.filter);
        });
        const emptyFilter = { txt: '' }
        this.setState({ filter: emptyFilter })
    }

    filterUsers = async (filter) => {
        const res = await this.props.getUsers(filter);
        this.setState({ searchResult: res })
    }

    inviteMember = (member) => {
        this.props.onAddMemberToBoard(member);
    }

    render() {
        const { board } = this.props;
        const { isInviteMenuOpen, searchResult } = this.state;
        return (
            <section className="invite-container">
                <button onClick={this.toggleInviteMenu} className="board-header-icon invite-btn">Invite</button>
                {isInviteMenuOpen && <div className="invite pop-up">
                    <button onClick={this.toggleInviteMenu}><i className="fas fa-times"></i></button>
                    <p>Invite</p>
                    <form className="invite-form">
                        <input className="invite-search" type="search" name="txt" onChange={this.handleChangeInvite}
                            placeholder="Enter full name or user name" />
                        {/* <button>
                            <i className="fa fa-search search-icon"></i>
                        </button> */}
                    </form>
                    {(searchResult && searchResult.length > 0) && <div>
                        <ul className="result-container">
                            {searchResult.map(result => {
                                return (
                                    <li onClick={() => this.inviteMember(result)} className="flex align-center"
                                        key={result._id}>
                                        <Avatar name={result.fullName} size={20} round={true} />
                                        <span className="user-name">{result.fullName}</span>
                                        {board.members.find(member => {
                                            return member._id === result._id
                                        }) && <i className="fas fa-check" title="This user is already a member"></i>}
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