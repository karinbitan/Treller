import { Component } from 'react';
import { connect } from 'react-redux';
import { setBoard, addBoard, updateBoard, addList, deleteList, favoriteBoard } from '../../store/actions/boardActions';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { deleteCard, updateCard } from '../../store/actions/cardActions';
import { getUsers, updateUser } from './../../store/actions/userActions';
import { getLoggedInUser } from '../../store/actions/authActions';
import { eventBus } from '../../services/eventBusService';
import { socketService } from '../../services/socketService.js';

import { ListPreview } from './../../cmps/ListPreview';
import { AddList } from '../../cmps/AddList/AddList';
import { BoardHeader } from '../../cmps/BoardHeader/BoardHeader';
import { MainHeader } from '../../cmps/MainHeader/MainHeader';

import './TrellerApp.scss';
import { userService } from '../../services/userSercvice';
import { boardService } from '../../services/boardService';

class _TrellerApp extends Component {

    state = {
        boardToEdit: null,
    }

    async componentDidMount() {
        const boardId = this.props.match.params.id;
        await this.props.setBoard(boardId);
        this.setState({ boardToEdit: this.props.board })
        await this.props.getLoggedInUser();

        eventBus.on('newBoardAdded', async (boardId) => {
            await this.props.setBoard(boardId);
            this.props.history.push(`/treller/board/${boardId}`);
        })

        socketService.setup();
        socketService.emit('register board', boardId);
        socketService.on('newBoard', (boardId) => this.setBoard(boardId));
    }

    async componentDidUpdate(prevProps, prevState) {
        const boardId = this.props.match.params.id;
        if (prevProps.match.params.id !== this.props.match.params.id) {
            await this.props.setBoard(boardId)
        }
    }

    componentWillUnmount() {
        console.log('unmount')
        socketService.off('newBoard');
        socketService.terminate();
    }

    setBoard = async (boardId) => {
        console.log(boardId);
        await this.props.setBoard(boardId);
        this.setState({ boardToEdit: this.props.board })
    }

    onUpdateBoard = async (boardToEdit) => {
        await this.props.updateBoard(boardToEdit);
        await this.props.setBoard(boardToEdit._id)
    }

    onChangeStyle = async (style) => {
        const { boardToEdit } = this.state;
        boardToEdit.style = style;
        this.setState({ boardToEdit });
        await this.props.updateBoard(boardToEdit);
        await this.props.setBoard(boardToEdit._id);
    }

    onFavoriteBoard = async (isStarred) => {
        const { board } = this.props;
        await this.props.favoriteBoard(board._id, isStarred);
        await this.props.setBoard(board._id);
    }

    // Why it stop after add board? //
    onAddBoard = async (boardToAdd = null) => {
        if (!boardToAdd) {
            boardToAdd = boardService.getEmptyBoard();
        }
        debugger
        const board = await this.props.addBoard(boardToAdd);
        await this.props.setBoard(board._id);
        this.props.history.push(`/treller/board/${board._id}`);

    }

    onAddMemberToBoard = async (member) => {
        let { boardToEdit } = this.state;
        let members = boardToEdit.members;
        members.push({ _id: member._id, fullName: member.fullName });
        boardToEdit.members = members;
        await this.props.updateBoard(boardToEdit);
        let user = await userService.getUserById(member._id);
        user.boardsMember = boardToEdit._id;
        await this.props.updateUser(user);
    }


    // LIST //
    onAddList = async (list) => {
        const { board } = this.props;
        await this.props.addList(board._id, list);
        await this.props.setBoard(board._id);
        // eventBus.emit('notification', {
        //     title: 'List added',
        // })
    }

    onCopyList = async (list) => {
        const { board } = this.props;
        await this.props.addList(board._id, list);
        await this.props.setBoard(board._id);
    }

    onUpdateList = async (savedList) => {
        const { board } = this.props;
        const lists = board.lists;
        const idx = lists.findIndex(list => {
            return list._id === savedList._id;
        })
        lists.splice(idx, 1, savedList);
        board.lists = lists;
        this.setState({ board }, async () => {
            await this.props.updateBoard(board)
        })
        eventBus.emit('notification', {
            title: 'List updated',
            list: savedList,
            by: this.props.user
        })
    }

    onDeleteList = async (list) => {
        const { board } = this.props;
        await this.props.deleteList(board._id, list._id);
        await this.props.setBoard(board._id);
        eventBus.emit('notification', {
            title: 'List deleted',
            list: list,
            by: this.props.user
        })
    }

    // CARD //
    onDeleteCard = async (listIdx, cardId) => {
        const { board } = this.props;
        await this.props.deleteCard(board._id, listIdx, cardId);
        await this.props.setBoard(board._id);
    }

    onUpdateCard = async (card) => {
        const { board } = this.props;
        await this.props.updateCard(card);
        await this.props.setBoard(board._id)
        eventBus.emit('notification', {
            title: 'Card updated',
            card: card,
            by: this.props.user
        })
    }

    // DRAG AND DROP //
    reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    move = (source, destination, droppableSource, droppableDestination) => {
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
    getListStyle = isDraggingOver => ({
        background: isDraggingOver ? 'rgba(0,0,0,.15)' : this.props.board.style.backgroundColor,
        // display: 'flex',
    });

    getItemStyle = (isDragging, draggableStyle) => ({
        // some basic styles to make the items look a bit nicer
        userSelect: 'none',

        // change background colour if dragging
        background: isDragging ? '' : this.props.board.style.backgroundColor,

        // styles we need to apply on draggables
        ...draggableStyle,
    });
    //

    onDragEnd = async (result) => {
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
            const lists = this.reorder(
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
                const cardsListReorder = this.reorder(
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
                this.move(
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
        const { board, user } = this.props;
        const { boardToEdit } = this.state;
        return (
            <section>
                {(board && boardToEdit) && <section className="treller-app"
                    style={{
                        backgroundColor: board.style.backgroundColor ? board.style.backgroundColor : '',
                        backgroundImage: board.style.backgroundImg ? `url(${board.style.backgroundImg})` : ''
                    }}>
                    {(board && user) && <MainHeader board={board} user={user} />}
                    <BoardHeader onUpdateBoard={this.onUpdateBoard}
                        onFavoriteBoard={this.onFavoriteBoard}
                        board={board}
                        onChangeStyle={this.onChangeStyle}
                        onAddMemberToBoard={this.onAddMemberToBoard}
                        onAddBoard={this.onAddBoard}
                    />
                    <section className="lists flex column">
                        <DragDropContext onDragEnd={this.onDragEnd}>
                            <Droppable droppableId="dropable-list" direction="horizontal" type="list">
                                {(provided, snapshot) => (
                                    <div className="droppable-container flex"
                                        style={this.getListStyle(snapshot.isDraggingOver)}
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}>
                                        {board.lists.map((list, idx) => {
                                            return (
                                                <Draggable draggableId={list._id} key={list._id} index={idx}>
                                                    {(provided, snapshot) => (
                                                        <div className="list"
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={this.getItemStyle(
                                                                snapshot.isDragging,
                                                                provided.draggableProps.style
                                                            )}
                                                            ref={provided.innerRef}>
                                                            <Droppable droppableId={list._id} direction="vertical" type="card">
                                                                {(provided, snapshot) => (
                                                                    <div className="card-list flex column"
                                                                        style={this.getListStyle(snapshot.isDraggingOver)}
                                                                        {...provided.droppableProps}
                                                                        ref={provided.innerRef}>
                                                                        <ListPreview list={list} listIdx={idx} key={idx} board={this.props.board}
                                                                            innerRef={provided.innerRef}
                                                                            provided={provided}
                                                                            isDraggingOver={snapshot.isDraggingOver}
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
                        <AddList onAddList={this.onAddList} />
                    </section>
                </section>}
            </section>
        )
    }
}

function mapStateToProps(state) {
    return {
        board: state.boardReducer.currBoard,
        user: state.userReducer.loggedInUser,
        users: state.userReducer.users
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
    favoriteBoard,
    getUsers,
    getLoggedInUser,
    updateUser
}
export const TrellerApp = connect(mapStateToProps, mapDispatchToProps)(_TrellerApp)