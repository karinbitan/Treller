import { useState } from 'react';
import Avatar from 'react-avatar';
import './BoardMenu.scss';

export function BoardMenu(props) {
    const [description, setDescription] = useState(props.board.description)
    const [menuType, toggleMenuType] = useState('');
    const [onForm, toggleOnForm] = useState(false);

    return (
        <section className="board-menu pop-up">
            {menuType === '' && <div>
                <button onClick={props.closeMenu} className="close-btn"><i className="fas fa-times"></i></button>
                <p className="headline">Menu</p>
                <div className="main-menu">
                    <ul>
                        <li onClick={() => toggleMenuType('about')}><i className="fab fa-trello"></i>
                            <p className="menu-option">About Board</p>
                        </li>
                        <li className="relative" onClick={() => toggleMenuType('style')}>
                            <div className="color-sample" style={{ backgroundColor: props.board.style.backgroundColor }}></div>
                            <p className="menu-option">Change Style</p>
                        </li>
                        {props.isAdmin && <li onClick={props.onDeleteBoard}>
                            <i className="fas fa-trash"></i>
                            <p className="menu-option">Delete Board</p>
                        </li>}
                    </ul>
                </div>
            </div>}
            {menuType === 'about' && <div className="about-board-container">
                <button className="go-back" onClick={() => toggleMenuType('')}><i className="fas fa-arrow-left"></i></button>
                <p className="headline">About Board</p>
                <div className="about-board">
                    <button className="no-button"><i className="fas fa-user"></i></button><p className="bold inline">Created by</p>
                    <div className="relative">
                        <Avatar className="avatar-member-popup" name={props.user.fullName} size="40" round={true} />
                        <p className="full-name flex">{props.user.fullName}</p>
                        <p className="user-name flex">{props.user.userName}</p>
                    </div>
                    <button className="no-button"><i className="fas fa-align-left icon"></i></button><p className="bold inline">Description</p>
                    <form onSubmit={(ev) => props.onUpdateBoardDescription(ev, description)}>
                        <textarea className="board-description" name="description" onChange={(ev) => setDescription(ev.target.value)}
                            value={description}
                            placeholder="Write here your board description..." onFocus={() => toggleOnForm(true)}></textarea>
                        {onForm && <button className="description-save-btn">Save</button>}
                    </form>
                </div>
            </div>}
            {menuType === 'style' && <div className="style-change-container">
                <button className="go-back" onClick={() => toggleMenuType('')}><i className="fas fa-arrow-left"></i></button>
                <p className="headline">Change Style</p>
                <div className="style-change flex">
                    <div onClick={() => props.onChangeStyle('rgb(0, 121, 191)')} className="color-picker blue" ></div>
                    <div onClick={() => props.onChangeStyle('rgb(81, 152, 57)')} className="color-picker green" ></div>
                    <div onClick={() => props.onChangeStyle('rgb(210, 144, 52)')} className="color-picker orange" ></div>
                    <div onClick={() => props.onChangeStyle('rgb(176, 70, 50)')} className="color-picker red" ></div>
                    <div onClick={() => props.onChangeStyle('rgb(137, 96, 158)')} className="color-picker purple" ></div>
                </div>
            </div>}
        </section>
    )
}

