import { Component } from 'react';
import Avatar from 'react-avatar';
import { InviteMembers } from '../InviteMembers/InviteMembers';

import './BoardHeader.scss';

export class BoardHeader extends Component {
    state = {
        boardToEdit: null,
        isStarred: false,
        isMenuOpen: false,
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

        console.log('mount', this.props.board.title)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.board !== this.props.board) {
            const boardToEdit = this.props.board;
            this.setState({ boardToEdit });
        }
    }

    handleChangeBoard = ({ target }) => {
        const field = target.name;
        const value = target.value;
        this.setState(prevState => ({ boardToEdit: { ...prevState.boardToEdit, [field]: value } }));
    }

    changeStyle = (color) => {
        const { style } = this.state;
        style.backgroundColor = color;
        style.backgroundColor = color;
        // this.setState(prevState => ({ style: { ...prevState.style, [field]: color } }), () =>
        //     this.props.onChangeStyle(this.state.style);
        // );
        this.setState({ style }, () => this.props.onChangeStyle(this.state.style));
    }

    onUpdateBoard = (ev) => {
        ev.preventDefault();
        const { boardToEdit } = this.state;
        this.myTextRef.blur();
        this.props.onUpdateBoard(boardToEdit);
    }

    onFavoriteBoard = async () => {
        this.setState({ isStarred: !this.state.isStarred }, () => {
            this.props.onFavoriteBoard(this.state.isStarred);
        });
    }

    toggleMenu = () => {
        this.setState({ isMenuOpen: !this.state.isMenuOpen })
    }

    toggleStyleMenu = () => {
        this.setState({ isStyleMenuOpen: !this.state.isStyleMenuOpen })
    }

    onDeleteBoard() {
        this.props.onDeleteBoard();
    }

    onAddMemberToBoard = (member) => {
        this.props.onAddMemberToBoard(member);
    }

    onAddBoardWithTemplate = () => {
        const { board } = this.props;
        this.props.onAddBoard(board);
    }

    render() {
        const { board } = this.props;
        const { boardToEdit, isStarred, isMenuOpen, isStyleMenuOpen } = this.state;
        return (
            <section>
                {(board && boardToEdit) && < section className="board-header flex align-center">
                    <form onSubmit={this.onUpdateBoard}>
                        <input type="text" ref={el => this.myTextRef = el} className="board-header-icon board-name" name="title"
                            placeholder="Enter your board name here..."
                            value={boardToEdit.title} onChange={this.handleChangeBoard} />
                    </form>
                    <button onClick={this.onFavoriteBoard} className="board-header-icon favorite-board">
                        <i style={isStarred ? { color: "#f2d600" } : {}} className="far fa-star"></i></button>
                         |
                <div className="board-header-icon avatar-container">
                        {board.members.map(member => {
                            return <Avatar className="member-avatar" name={member.fullName} size="25" round={true} key={member._id} />
                        })}
                    </div>
        |
        <InviteMembers board={board} onAddMemberToBoard={this.onAddMemberToBoard} />
                    <div className="menu-container flex">
                        <button className="board-header-icon show-menu-icon" onClick={this.toggleMenu}>
                            <i className="fas fa-ellipsis-h"></i><span>Show Menu</span>
                        </button>
                        {isMenuOpen && <div className="menu pop-up">
                            <button onClick={this.toggleMenu}>X</button>
                            {!isStyleMenuOpen ? <div>
                                <p className="headline">Menu</p>
                                <ul>
                                    <li onClick={this.toggleStyleMenu}>Change Style
                                     <div className="color-sample" style={{ backgroundColor: board.style.backgroundColor }}></div>
                                    </li>
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
                                        <div onClick={() => this.changeStyle('rgb(176, 70, 50)')} className="color-picker red" ></div>
                                        <div onClick={() => this.changeStyle('rgb(137, 96, 158)')} className="color-picker purple" ></div>
                                    </div>
                                </div>}
                        </div>}
                    </div>
                   {board.isTemplate &&  <button className="add-from-template" onClick={this.onAddBoardWithTemplate}>
                        Create Board From Template
                        </button>}
                </section>}
            </section>
        )
    }
}

