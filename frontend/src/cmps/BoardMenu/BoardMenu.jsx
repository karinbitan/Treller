import { useEffect, useRef, useState } from 'react';
import Avatar from 'react-avatar';
import './BoardMenu.scss';

export function BoardMenu(props) {
    const [description, setDescription] = useState(props.board.description)
    const [isMenuOpen, toggleMenu] = useState(false)
    const [menuType, toggleMenuType] = useState('');
    const [onForm, toggleOnForm] = useState(false);
    const node = useRef()

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
        toggleMenu(false);
    };

    return (
        <section ref={node} className="board-menu-container">
            <button className="board-header-icon show-menu-icon" onClick={() => toggleMenu(!isMenuOpen)}>
                <i className="fas fa-ellipsis-h"></i><span>Show Menu</span>
            </button>
            {isMenuOpen && <div className="board-menu pop-up">
                <button onClick={() => toggleMenu(false)} className="close-btn"><i className="fas fa-times"></i></button>
                {menuType === '' && <div className="main-menu">
                    <p className="headline">Menu</p>
                    <ul className="main-menu-options">
                        <li onClick={() => toggleMenuType('about')}><i className="fab fa-trello"></i>
                            <p className="menu-option">About Board</p>
                        </li>
                        {!props.board.isTemplate && <li className="relative" onClick={() => toggleMenuType('style')}>
                            <div className="color-sample"
                                style={{
                                    backgroundColor: props.board.style.backgroundColor,
                                    backgroundImage: `url(${props.board.style.backgroundImg})`
                                }}>
                            </div>
                            <p className="menu-option">Change Style</p>
                        </li>}
                        {props.isAdmin && <li onClick={props.onDeleteBoard}>
                            <i className="fas fa-trash"></i>
                            <p className="menu-option">Delete Board</p>
                        </li>}
                    </ul>
                </div>}
                {menuType === 'about' && <div className="about-board-container">
                    <button className="go-back" onClick={() => toggleMenuType('')}><i className="fas fa-arrow-left"></i></button>
                    <p className="headline">About Board</p>
                    <div className="about-board">
                        <div className="created-by">
                            <button className="no-button"><i className="fas fa-user"></i></button><p className="bold inline">Created by</p>
                            <div className="relative">
                                <Avatar className="avatar-member-popup" name={props.board.createdBy.fullName} size="40" round={true} />
                                <p className="full-name flex">{props.board.createdBy.fullName}</p>
                            </div>
                        </div>
                        <div className="board-description">
                            <button className="no-button"><i className="fas fa-align-left icon"></i></button><p className="bold inline">Description</p>
                            <form onSubmit={(ev) => props.onUpdateBoardDescription(ev, description)}>
                                <textarea className="board-description-textarea" name="description" onChange={(ev) => setDescription(ev.target.value)}
                                    value={description}
                                    placeholder="Write here board description..." onFocus={() => toggleOnForm(true)}
                                    onBlur={() => toggleOnForm(false)}></textarea>
                                {onForm && <button className="description-save-btn">Save</button>}
                            </form>
                        </div>
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
            </div>}
        </section>
    )
}

