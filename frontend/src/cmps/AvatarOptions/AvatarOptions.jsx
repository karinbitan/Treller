import { useEffect, useRef } from 'react';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';
import './AvatarOptions.scss';

export function AvatarOptions(props) {
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
        props.closePopUp();

    };
 
    return (
        <section ref={node} className="avatar-options">
            <button onClick={() => props.closePopUp(false)} className="close-btn"><i className="fas fa-times"></i></button>
            <p className="options-headline">Account</p>
            <Avatar className="avatar-member-popup" name={props.user.fullName} size="40" round={true} />
            <ul>
                <div className="account-info">
                    <li className="full-name flex">{props.user.fullName}</li>
                    <li className="user-name flex">{props.user.userName}</li>
                </div>
                <li><Link to={`/user/${props.user._id}/boards`}>Boards</Link></li>
                <li onClick={() => props.closePopUp(false)}><Link to={`/user/${props.user._id}`}>Profile</Link></li>
                <li onClick={props.logout}>Log Out</li>
            </ul>
        </section>
    )
}

