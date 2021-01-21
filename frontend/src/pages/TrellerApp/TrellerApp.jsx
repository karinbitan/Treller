import { Component } from 'react';
import { connect } from 'react-redux';
import { setBoard, addBoard, updateBoard, addList, deleteList, favoriteBoard } from '../../store/actions/boardActions';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { boardService } from '../../services/boardService';
import { deleteCard, updateCard } from '../../store/actions/cardActions';

import Avatar from 'react-avatar';
import { ListPreview } from './../../cmps/ListPreview';

import './TrellerApp.scss';

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone[0].cards.splice(droppableSource.index, 1);

    destClone[0].cards.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

//
const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? '#6a7eb4' : 'rgb(178, 185, 224)',
    // display: 'flex',
});

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',

    // change background colour if dragging
    background: isDragging ? '' : 'rgb(178, 185, 224)',

    // styles we need to apply on draggables
    ...draggableStyle,
});
//

class _TrellerApp extends Component {

    state = {
        boardToEdit: null,
        listToEdit: null,
        showingAddListForm: false,
        isStarred: null,
        isMenuOpen: false,
        isInviteMenuOpen: false
    }

    async componentDidMount() {
        // const user = this.props.user;
        const boardId = this.props.match.params.id;
        await this.props.setBoard(boardId);
        await this.setState({ boardToEdit: this.props.board })
        // if (!user) {
        //     await this.props.setBoard("60040605a5297b5978123a93");
        //     this.setState({ boardToEdit: this.props.board })
        // } else {
        //     if (user.boardsMember.length > 0) {
        //         this.props.history.push(`/user/${user._id}`)
        //     } else {
        //         const emptyBoard = boardService.getEmptyBoard();
        //         const board = await this.props.addBoard(emptyBoard);
        //         // await this.props.setBoard('5ff1b13c36eed552e70fec47');
        //         this.setState({ boardToEdit: board });
        //     }
        // }
        const listToEdit = boardService.getEmptyList();
        this.setState({ listToEdit });
        this.setState({ isStarred: this.state.boardToEdit.isFavorite });
    }

    // componentDidUpdate(prevProps, prevState) {
    //     if (prevProps.board !== this.props.board) {
    //         this.props.setBoard('5ff1b13c36eed552e70fec47');
    //     }
    // }

    handleChangeBoard = ({ target }) => {
        const field = target.name;
        const value = target.value;
        this.setState(prevState => ({ boardToEdit: { ...prevState.boardToEdit, [field]: value } }));
    }

    handleChangeList = ({ target }) => {
        const field = target.name;
        const value = target.value;
        this.setState(prevState => ({ listToEdit: { ...prevState.listToEdit, [field]: value } }));
    }

    favoriteBoard = async () => {
        await this.setState({ isStarred: !this.state.isStarred }, async () => {
            await this.props.favoriteBoard(this.props.board._id, this.state.isStarred);
        });
        console.log(this.state.isStarred)
    }

    updateBoard = async (ev) => {
        ev.preventDefault();
        const { boardToEdit } = this.state;
        this.myTextRef.blur();
        await this.props.updateBoard(boardToEdit);
    }

    toggleMenu = () => {
        this.setState({ isMenuOpen: !this.state.isMenuOpen })
    }

    toggleInviteMenu = () => {
        this.setState({ isInviteMenuOpen: !this.state.isInviteMenuOpen })
    }

    // LIST//
    toggleForm = (ev) => {
        ev.stopPropagation();
        this.setState({ showingAddListForm: !this.state.showing })
    }

    addList = async (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        const { board } = this.props;
        const { listToEdit } = this.state;
        await this.props.addList(board._id, listToEdit);
        await this.props.setBoard(board._id)
        this.setState(({ listToEdit: { ...this.state.listToEdit, title: '' } }));
        this.setState({ showingAddListForm: false })
    }

    copyList = (list) => {

    }

    onUpdateList = async (listToEdit) => {
        const { boardToEdit } = this.state;
        const lists = boardToEdit.lists;
        const idx = lists.findIndex(list => {
            return list._id === listToEdit._id;
        })
        lists.splice(idx, 1, listToEdit);
        boardToEdit.lists = lists;
        this.setState({ boardToEdit }, async () => {
            await this.props.updateBoard(boardToEdit)
        })
    }

    onDeleteList = async (listId) => {
        const { board } = this.props;
        await this.props.deleteList(board._id, listId);
        await this.props.setBoard(board._id)
    }

    // CARD //
    onDeleteCard = async (listIdx, cardId) => {
        const { board } = this.props;
        await this.props.deleteCard(this.props.board._id, listIdx, cardId);
        await this.props.setBoard(board._id)
    }

    onUpdateCard = async (card) => {
        const { board } = this.props;
        await this.props.updateCard(card);
        await this.props.setBoard(board._id)
    }

    onDragEnd = async (result) => {
        debugger
        if (!result.destination) {
            return;
        }

        // ??
        // if (result.destination.droppableId === result.source.droppableId &&
        //     result.destination.index === result.source.index) {
        //     return;
        // };
        const { boardToEdit } = this.state;
        if (result.type === 'list') {
            const lists = reorder(
                this.state.boardToEdit.lists,
                result.source.index,
                result.destination.index
            );
            boardToEdit.lists = lists;
            this.setState({ boardToEdit }, async () => {
                await this.props.updateBoard(boardToEdit)
            })
        } else if (result.type === 'card') {
            const destListId = result.destination.droppableId;
            const sourceListId = result.source.droppableId;
            let lists = this.state.boardToEdit.lists;
            if (destListId === sourceListId) {
                // Filter to find the curr list
                let list = this.state.boardToEdit.lists.filter(list => {
                    return list._id === destListId;
                })
                // List = list[0] because the filter return array
                list = list[0];
                // Assign var to list.cards
                let cardsList = list.cards;
                // Re order
                const cardsListReorder = reorder(
                    cardsList,
                    result.source.index,
                    result.destination.index
                );
                // List.cards = Re orderd list after the changes
                list.cards = cardsListReorder;
                // Find the curr list idx to do the splice
                const listIdx = lists.findIndex(list => {
                    return list._id === destListId;
                })
                // Change the list to the curr list with the right card order
                lists.splice(listIdx, 1, list);
            } else {
                let destList = boardToEdit.lists.filter(list => {
                    return list._id === destListId;
                })
                let sourceList = boardToEdit.lists.filter(list => {
                    return list._id === sourceListId;
                })
                move(
                    sourceList,
                    destList,
                    result.source,
                    result.destination
                );
                const destListIdx = lists.findIndex(list => {
                    return list._id === destListId;
                })
                const sourceListIdx = lists.findIndex(list => {
                    return list._id === sourceListId;
                })
                destList = destList[0];
                sourceList = sourceList[0];
                lists.splice(destListIdx, 1, destList);
                lists.splice(sourceListIdx, 1, sourceList);
            }
            boardToEdit.lists = lists;

            await this.setState({ boardToEdit }, async () => {
                await this.props.updateBoard(boardToEdit)
            })
        }
    };


    render() {
        const { board } = this.props;
        const { boardToEdit, isStarred, listToEdit, showingAddListForm, isMenuOpen, isInviteMenuOpen } = this.state;
        return (
            <section className="treller-app">
                {board && <section>
                    <div className="board-header flex align-center">
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
                                <p>Menu</p>
                                <ul>
                                    <li>Add Description To Board</li>
                                    <li>Change Background</li>
                                    <li>Delete Board</li>
                                </ul>
                            </div>}
                        </div>
                    </div>
                    <section className="lists flex column">
                        <DragDropContext onDragEnd={this.onDragEnd}>
                            <Droppable droppableId="dropable-list" direction="horizontal" type="list">
                                {(provided, snapshot) => (
                                    <div className="droppable-container flex"
                                        style={getListStyle(snapshot.isDraggingOver)}
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}>
                                        {board.lists.map((list, idx) => {
                                            return (
                                                <Draggable draggableId={list._id} key={list._id} index={idx}>
                                                    {(provided, snapshot) => (
                                                        <div className="list"
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={getItemStyle(
                                                                snapshot.isDragging,
                                                                provided.draggableProps.style
                                                            )}
                                                            ref={provided.innerRef}>
                                                            <Droppable droppableId={list._id} direction="vertical" type="card">
                                                                {(provided, snapshot) => (
                                                                    <div className="card-list flex column"
                                                                        style={getListStyle(snapshot.isDraggingOver)}
                                                                        {...provided.droppableProps}
                                                                        ref={provided.innerRef}>
                                                                        <ListPreview list={list} idx={idx} key={idx} board={this.props.board}
                                                                            innerRef={provided.innerRef}
                                                                            provided={provided}
                                                                            isDraggingOver={snapshot.isDraggingOver}
                                                                            copyList={this.copyList}
                                                                            onDeleteList={this.onDeleteList}
                                                                            onUpdateList={this.onUpdateList}
                                                                            onDeleteCard={this.onDeleteCard}
                                                                            onUpdateCard={this.onUpdateCard} />
                                                                    </div>
                                                                )}
                                                            </Droppable>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            )
                                        })}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                        {/* 
                {lists.map((list, idx) => {
                    return (
                        <ListPreview list={list} idx={idx} key={idx} />
                    )
                })} */}
                        {!showingAddListForm ? <div className="add-container" onClick={this.toggleForm}><i className="fas fa-plus"></i> Add another list</div>
                            : <form onSubmit={this.addList} className="add-list-form">
                                <input type="text" className="add-form" name="title"
                                    value={listToEdit.title} onChange={this.handleChangeList} placeholder="Enter a title for this card" />
                                <br />
                                <button className="add-form-btn">Add list</button>
                                <button className="exit-btn" onClick={this.toggleForm}><i className="fas fa-times"></i></button>
                            </form>}
                    </section>
                    {/* <TrellerLists onAddList={this.onAddList} lists={board.lists} onUpdateBoard={this.onUpdateBoard} /> */}
                </section>}
            </section>
        )
    }
}

function mapStateToProps(state) {
    return {
        board: state.boardReducer.currBoard,
        user: state.userReducer.currUser
    }
}
const mapDispatchToProps = {
    setBoard,
    addBoard,
    updateBoard,
    addList,
    deleteList,
    deleteCard,
    updateCard,
    favoriteBoard
}
export const TrellerApp = connect(mapStateToProps, mapDispatchToProps)(_TrellerApp)