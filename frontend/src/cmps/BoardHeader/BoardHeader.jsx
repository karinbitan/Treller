import { Component } from 'react';
import Avatar from 'react-avatar';
import { InviteMembers } from '../InviteMembers/InviteMembers';
import { BoardMenu } from '../BoardMenu/BoardMenu';

import './BoardHeader.scss';

export class BoardHeader extends Component {
    state = {
        boardToEdit: null,
        isFavorite: false,
        style: {
            backgroundColor: null
        },
        templateMsg: 'Create Board From Template'
    }

    async componentDidMount() {
        const boardToEdit = this.props.board;
        this.setState({ boardToEdit });
        const field = 'backgroundColor';
        const value = boardToEdit.style.backgroundColor;
        this.setState(({ style: { ...this.state.style, [field]: value } }))
        this.isFavorite()
    }

    isFavorite = () => {
        const { board } = this.props;
        const isFavorite = this.props.user.favoriteBoards.some(favoriteBoardId => {
            return favoriteBoardId === board._id;
        })
        this.setState({ isFavorite })
        return isFavorite;
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
        this.setState({ style }, () => this.props.changeStyle(this.state.style));
    }

    onUpdateBoardTitle = (ev) => {
        ev.preventDefault();
        const { boardToEdit } = this.state;
        this.myTextRef.blur();
        this.props.updateBoardTitle(boardToEdit.title);
    }

    onFavoriteBoard = async () => {
        const { isFavorite } = this.state;
        if (isFavorite) {
            this.props.favoriteBoard(false);
            this.setState({ isFavorite: false })
        } else {
            this.props.favoriteBoard(true);
            this.setState({ isFavorite: true })
        }
    }

    deleteBoard = () => {
        this.props.deleteBoard();
    }


    inviteMemberToBoard = (member) => {
        this.props.inviteMemberToBoard(member);
    }

    onAddBoardWithTemplate = () => {
        const { board } = this.props;
        this.setState({ templateMsg: 'Creating Board' })
        this.props.addBoard(board);
    }

    updateBoardDescription = (ev, description) => {
        ev.preventDefault();
        this.props.updateBoardDescription(description);
    }

    checkIfAdmin = () => {
        const { board, user } = this.props;
        if (user) {
            if (!user.boardsOwner || !user.boardsOwner.length) return
            const isAdmin = user.boardsOwner.some(boardId => {
                if (!boardId) return;
                return boardId === board._id;
            });
            console.log(isAdmin)
            return isAdmin;
        }
    }

    render() {
        const { board, user } = this.props;
        const { boardToEdit, isFavorite, templateMsg } = this.state;
        return (
            <section>
                {(board && boardToEdit) && < section className="board-header flex align-center">
                    {!board.isTemplate ? <form onSubmit={this.onUpdateBoardTitle}>
                        <input type="text" ref={el => this.myTextRef = el}
                            className="board-header-icon board-name" name="title"
                            placeholder="Enter your board name here..."
                            value={boardToEdit.title} onChange={this.handleChangeBoard}
                            onBlur={this.onUpdateBoardTitle} />
                    </form>
                        : <div className="board-header-icon board-name">{boardToEdit.title}</div>}
                    <button onClick={this.onFavoriteBoard} className="board-header-icon favorite-board">
                        <i style={isFavorite ? { color: "#f2d600" } : {}} className="far fa-star"></i></button>
                    <span className="line line1">|</span>
                    <div className="board-header-icon avatar-container flex align-center">
                        {board.members.map(member => {
                            return <Avatar className="member-avatar" name={member.fullName} size="25" round={true} key={member._id} />
                        })}
                    </div>
                    <span className="line line2">|</span>
                    {!board.isTemplate && <InviteMembers board={board} user={user}
                        inviteMemberToBoard={this.inviteMemberToBoard} />}
                    <BoardMenu isAdmin={this.checkIfAdmin() ? true : false} board={board}
                        user={user} onDeleteBoard={this.deleteBoard}
                        onChangeStyle={this.changeStyle} onUpdateBoardDescription={this.updateBoardDescription} />
                    {board.isTemplate && <button className="add-from-template" onClick={this.onAddBoardWithTemplate}>
                        {templateMsg}
                    </button>}
                </section>}
            </section>
        )
    }
}

