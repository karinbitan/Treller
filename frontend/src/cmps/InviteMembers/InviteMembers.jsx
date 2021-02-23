import { useEffect, useRef, useState } from 'react';
import Avatar from 'react-avatar';
import { connect } from 'react-redux';
import { getUserSearchResult } from '../../store/actions/searchActions';

import './InviteMembers.scss';

function _InviteMembers(props) {
    const [filter, setFilter] = useState({ txt: '' });
    const [isInvitePopUpOpen, togglePopUp] = useState(false);
    const [searchResult, setSearchResult] = useState([])
    const [onForm, toggleOnForm] = useState(false);
    const [onSearch, toggleOnSearch] = useState(false);

    const node = useRef();

    useEffect(() => {
        // add when mounted
        document.addEventListener("mousedown", handleClick);
        // return function to be called when unmounted
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);

    const handleClick = e => {
        if (node.current.contains(e.target)) {
            return;
        }
        togglePopUp(false);
        setFilter({txt: ''})
    };

    const filterUsers = async (ev) => {
        if (ev) ev.preventDefault();
        if (!filter.txt || filter.txt.length < 0) return;
        const res = await props.getUserSearchResult(filter);
        setSearchResult(res);
        toggleOnSearch(true);
    }

    const onInviteMember = (member) => {
        if (isMember(member._id)) return;
        togglePopUp(false);
        props.inviteMemberToBoard(member);
    }

    const isMember = (userId) => {
        const { board } = props;
        const isMember = board.members.some(member => {
            return member._id === userId
        })
        return isMember;
    }

    const isUser = (userId) => {
        const { user } = props;
        if (user._id === userId) return true;
        else return false;
    }

    return (
        <section ref={node} className="invite-container" >
            <button onClick={() => togglePopUp(!isInvitePopUpOpen)} className="board-header-icon invite-btn">Invite</button>
            { isInvitePopUpOpen && <div className="invite pop-up">
                <button onClick={() => togglePopUp(false)} className="close-btn"><i className="fas fa-times"></i></button>
                <p className="headline">Invite</p>
                <form onSubmit={(ev)=>filterUsers(ev)} className="invite-form">
                    <input className="invite-search" type="search" name="txt"
                        onChange={(ev) => setFilter({ ...filter, [ev.target.name]: ev.target.value })}
                        onKeyUp={filterUsers} value={filter.txt}
                        placeholder="Enter full name or user name" onFocus={() => toggleOnForm(true)}
                        onBlur={() => toggleOnForm(false)} />
                    {!onForm && <button type="button" className="search-btn">
                        <i className="fa fa-search search-icon"></i>
                    </button>}
                </form>
                {onSearch && <div>
                    {(searchResult && searchResult.length > 0) ?
                        <ul className="result-container">
                            {searchResult.map(user => {
                                if (isUser(user._id)) return;
                                return (
                                    <li onClick={() => onInviteMember(user)}
                                        className={`flex align-center ${isMember(user._id) ? 'already-member' : ''}`}
                                        title={`${isMember(user._id) ? 'This user is already a member in this board' : ''}`}
                                        key={user._id}>
                                        <Avatar name={user.fullName} size={20} round={true} />
                                        <span className="user-name">{user.fullName}</span>
                                    </li>)
                            })}
                        </ul>
                        : <p>We couldnt fount any match...</p>}
                </div>}
            </div>}
        </section>
    )
}

const mapDispatchToProps = {
    getUserSearchResult
}

export const InviteMembers = connect(null, mapDispatchToProps)(_InviteMembers)