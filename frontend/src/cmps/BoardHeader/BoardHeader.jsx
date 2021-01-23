import { Component } from 'react';
import Avatar from 'react-avatar';

import './BoardHeader.scss';

export class BoardHeader extends Component {
    state = {
        boardToEdit: null,
        isStarred: false,
        isMenuOpen: false,
        isInviteMenuOpen: false,
        isStyleMenuOpen: false,
        style: {
            backgroundColor: null
        }
    }

    async componentDidMount() {
        const boardToEdit = this.props.board;
        this.setState({ boardToEdit });
        const field = 'backgroundColor';
        const value = boardToEdit.style.backgroundColor;
        this.setState(({ style: { ...this.state.style, [field]: value } }))
        this.setState({ isStarred: this.props.board.isFavorite });
    }

    handleChangeBoard = ({ target }) => {
        const field = target.name;
        const value = target.value;
        this.setState(prevState => ({ boardToEdit: { ...prevState.boardToEdit, [field]: value } }));
    }

    changeStyle = (color) => {
        const field = 'backgroundColor';
        this.setState(prevState => ({ style: { ...prevState.style, [field]: color } }), () =>
            this.props.onChangeStyle(this.state.style)
        );
    }

    onUpdateBoard = (ev) => {
        ev.preventDefault();
        const { boardToEdit } = this.state;
        this.myTextRef.blur();
        this.props.onUpdateBoard(boardToEdit);
    }

    favoriteBoard = async () => {
        this.setState({ isStarred: !this.state.isStarred }, async () => {
            await this.props.favoriteBoard(this.props.board._id, this.state.isStarred);
        });
    }

    toggleMenu = () => {
        this.setState({ isMenuOpen: !this.state.isMenuOpen })
    }

    toggleInviteMenu = () => {
        this.setState({ isInviteMenuOpen: !this.state.isInviteMenuOpen })
    }

    toggleStyleMenu = () => {
        this.setState({ isStyleMenuOpen: !this.state.isStyleMenuOpen })
    }

    onDeleteBoard() {
        this.props.onDeleteBoard();
    }

    render() {
        const { board } = this.props;
        const { boardToEdit, isStarred, isMenuOpen, isInviteMenuOpen, isStyleMenuOpen } = this.state;
        return (
            <section>
                {(board && boardToEdit) && < section className="board-header flex align-center">
                    <form onSubmit={this.updateBoard}>
                        {boardToEdit && <input type="text" ref={el => this.myTextRef = el} className="board-header board-name" name="title"
                            placeholder="Enter your board name here..."
                            value={boardToEdit.title} onChange={this.handleChangeBoard} />}
                    </form>
                    <button onClick={this.favoriteBoard} className="icon-container board-header-icon no-button">
                        <i style={isStarred ? { color: "goldenrod" } : {}} className="far fa-star"></i></button> |
                <div className="avatar-container board-header-icon">
                        {board.members.map(member => {
                            return <Avatar name={member.fullName} size="25" round={true} key={member._id} />
                        })}
                    </div>
        |
                <div className="invite-container">
                        <button onClick={this.toggleInviteMenu} className="invite-btn no-button">Invite</button>
                        {isInviteMenuOpen && <div className="invite pop-up">
                            <button onClick={this.toggleInviteMenu}>X</button>
                            <p>Invite</p>
                            <form>
                                <input type="search" /><i className="fa fa-search search-icon"></i>
                            </form>
                        </div>}
                    </div>
                    <div className="menu-container">
                        <button className="show-menu-icon" onClick={this.toggleMenu}>
                            <i className="fas fa-ellipsis-h"></i><span>Show Menu</span>
                        </button>
                        {isMenuOpen && <div className="menu pop-up">
                            <button onClick={this.toggleMenu}>X</button>
                            {!isStyleMenuOpen ? <div>
                                <p>Menu</p>
                                <ul>
                                    <li onClick={this.toggleStyleMenu}>Change Style</li>
                                    <li onClick={this.onDeleteBoard}>Delete Board</li>
                                </ul>
                            </div>
                                : <div className="style-change-container">
                                    <button onClick={this.toggleStyleMenu}><i className="fas fa-arrow-left"></i></button>
                                    <p>Change Style</p>
                                    <div className="flex">
                                        <div onClick={() => this.changeStyle('rgb(0, 121, 191)')} className="color-picker blue" ></div>
                                        <div onClick={() => this.changeStyle('rgb(81, 152, 57)')} className="color-picker green" ></div>
                                        <div onClick={() => this.changeStyle('rgb(210, 144, 52)')} className="color-picker orange" ></div>
                                    </div>
                                </div>}
                        </div>}
                    </div>
                </section>}
            </section>
        )
    }
}

