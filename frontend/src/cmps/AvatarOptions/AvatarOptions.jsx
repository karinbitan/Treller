import { useEffect, useRef, useState } from 'react';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';
import './AvatarOptions.scss';

export function AvatarOptions(props) {
    const [isAvatarOptionsOpen, toggleAvatarOptions] = useState(false);
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
        toggleAvatarOptions(false);
    };

    return (
        <section ref={node} className="avatar-options-container">
            <Avatar className="avatar-member" name={props.user.fullName} size="40" round={true}
                onClick={() => toggleAvatarOptions(!isAvatarOptionsOpen)} />
            {isAvatarOptionsOpen && <div className="avatar-options">
                <button onClick={() => toggleAvatarOptions(false)} className="close-btn"><i className="fas fa-times"></i></button>
                <p className="options-headline">Account</p>
                <Avatar className="avatar-member-popup" name={props.user.fullName} size="40" round={true} />
                <ul>
                    <div className="account-info">
                        <li className="full-name flex">{props.user.fullName}</li>
                        <li className="user-name flex">{props.user.userName}</li>
                    </div>
                    <li><Link to={`/user/${props.user._id}/boards`}>Boards</Link></li>
                    <li onClick={() => toggleAvatarOptions(false)}><Link to={`/user/${props.user._id}`}>Profile</Link></li>
                    <li onClick={props.onLogout}>Log Out</li>
                </ul>
            </div>}
        </section>
    )
}

