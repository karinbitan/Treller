import { Component } from 'react';
import { connect } from 'react-redux';
import {
    setBoard, addBoard, updateBoard, addList, deleteList, updateBoardCollection,
    inviteMemberToBoard, deleteBoard
} from '../../store/actions/boardActions';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { addCard, deleteCard, updateCard, updateCardCollection } from '../../store/actions/cardActions';
import { getUsers, updateUser, updateUserCollection } from './../../store/actions/userActions';
import { getLoggedInUser } from '../../store/actions/authActions';
import { eventBus } from '../../services/eventBusService';
import { socketService } from '../../services/socketService.js';
import { boardService } from '../../services/boardService';

import { ListPreview } from './../../cmps/ListPreview';
import { AddList } from '../../cmps/AddList/AddList';
import { BoardHeader } from '../../cmps/BoardHeader/BoardHeader';
import { MainHeader } from '../../cmps/MainHeader/MainHeader';
import { NotificiationMsg } from '../../cmps/NotificiationMsg/NotificiationMsg';

import './TrellerApp.scss';

class _TrellerApp extends Component {

    state = {
        boardToEdit: null,
        notification: null
    }

    async componentDidMount() {
        const boardId = this.props.match.params.id;
        await this.props.setBoard(boardId);
        this.setState({ boardToEdit: this.props.board })
        await this.props.getLoggedInUser();

        eventBus.on('onSetBoard', async (boardId) => {
            await this.props.setBoard(boardId);
            this.props.history.push(`/treller/board/${boardId}`);
        })
        const userId = this.props.user._id;
        socketService.setup();
        socketService.emit('register board', boardId);
        socketService.emit('register user', userId);
        socketService.on('updatedBoard', (boardId) => {
            this.setBoard(boardId)
        });
        socketService.on('newNotification', (msg) => {
            this.setState({ notification: msg })
            console.log(msg)
        })

        // Move to app //
        // socketService.on('newUserNotification', (msg) => {
        //     this.addUserNotification(msg);
        // })
    }

    async componentDidUpdate(prevProps, prevState) {
        const boardId = this.props.match.params.id;
        if (prevProps.match.params.id !== this.props.match.params.id) {
            await this.props.setBoard(boardId);
            this.props.history.push(`/treller/board/${boardId}`)
        }
    }

    // componentWillUnmount() {
    //     socketService.off('register board', boardId);
    //     socketService.terminate();
    // }

    setBoard = async (boardId) => {
        await this.props.setBoard(boardId);
        this.setState({ boardToEdit: this.props.board })
    }

    updateBoardTitle = async (title) => {
        const { board } = this.props;
        await this.props.updateBoardCollection(board._id, { title });
        await this.props.setBoard(board._id);
    }

    changeStyle = async (style) => {
        const { board } = this.props;
        await this.props.updateBoardCollection(board._id, { style });
        await this.props.setBoard(board._id);
    }

    favoriteBoard = async (isFavorite) => {
        const { board, user } = this.props;
        const favoriteBoards = [];
        if (isFavorite) favoriteBoards.push(board._id);
        else {
            const idx = favoriteBoards.findIndex(favoriteBoard => {
                return favoriteBoard._id === board._id;
            })
            favoriteBoards.splice(idx);
        }
        await this.props.updateUserCollection(user._id, { favoriteBoards });
        await this.props.setBoard(board._id);
    }

    addBoard = async (boardToAdd = null) => {
        if (!boardToAdd) {
            boardToAdd = boardService.getEmptyBoard();
        }
        const board = await this.props.addBoard(boardToAdd);
        await this.props.setBoard(board._id);
        this.props.history.push(`/treller/board/${board._id}`);
    }

    inviteMemberToBoard = async (member) => {
        const { board } = this.props;
        await this.props.inviteMemberToBoard(board, member);
        await this.props.setBoard(board._id);
    }

    deleteBoard = async () => {
        const { board, user } = this.props;
        await this.props.deleteBoard(board._id);
        this.props.history.push(`/user/${user._id}/boards`);
    }

    // LIST //
    addList = async (list) => {
        const { board } = this.props;
        await this.props.addList(board._id, list);
        await this.props.setBoard(board._id);
    }

    updateListTitle = async (listIdx, listTitle) => {
        let { board } = this.props;
        let lists = board.lists;
        let list = lists[listIdx];
        list.title = listTitle;
        lists.splice(listIdx, 1, list);
        board.lists = lists;
        await this.props.updateBoard(board);
        await this.props.setBoard(board._id);
    }

    deleteList = async (listId) => {
        const { board } = this.props;
        await this.props.deleteList(board._id, listId);
        await this.props.setBoard(board._id);
    }

    // CARD //
    addCard = async (listId, listIdx, card) => {
        const { board } = this.props;
        await this.props.addCard(board._id, listId, listIdx, card);
        await this.props.setBoard(board._id);
    }

    deleteCard = async (listIdx, cardId) => {
        const { board } = this.props;
        await this.props.deleteCard(board._id, listIdx, cardId);
        await this.props.setBoard(board._id);
    }

    updateCardTitle = async (cardId, cardTitle) => {
        const { board } = this.props;
        const title = cardTitle;
        await this.props.updateCardCollection(board._id, cardId, { title });
        await this.props.setBoard(board._id)
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
        background: isDraggingOver ? 'rgba(0,0,0,.15)' : this.props.board.style.backgroundColor
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

            this.setState({ boardToEdit }, async () => {
                await this.props.updateBoard(boardToEdit)
            })
        }
    };

    render() {
        const { board, user } = this.props;
        const { boardToEdit, notification } = this.state;
        return (
            <section>
                {((board && boardToEdit) && user) && <section className="background" style={{
                    backgroundColor: board.style.backgroundColor ? board.style.backgroundColor : '',
                    backgroundImage: board.style.backgroundImg ? `url(${board.style.backgroundImg})` : ''
                }}>
                    <MainHeader
                        board={board}
                        user={user}
                    />
                    <BoardHeader
                        user={user}
                        updateBoardTitle={this.updateBoardTitle}
                        favoriteBoard={this.favoriteBoard}
                        board={board}
                        changeStyle={this.changeStyle}
                        inviteMemberToBoard={this.inviteMemberToBoard}
                        addBoard={this.addBoard}
                        onDeleteBoard={this.deleteBoard}
                    />
                    <div>
                        {notification && <NotificiationMsg notification={notification} user={user} />}
                    </div>
                    <section className="treller-app">
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
                                                                                deleteList={this.deleteList}
                                                                                updateListTitle={this.updateListTitle}
                                                                                deleteCard={this.deleteCard}
                                                                                updateCardTitle={this.updateCardTitle}
                                                                                addCard={this.addCard} />
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
                            <AddList addList={this.addList} />
                        </section>
                    </section>
                </section>}
            </section>
        )
    }
}

function mapStateToProps(state) {
    return {
        board: state.boardReducer.currBoard,
        user: state.userReducer.loggedInUser
    }
}
const mapDispatchToProps = {
    setBoard,
    addBoard,
    updateBoard,
    addList,
    deleteList,
    addCard,
    deleteCard,
    updateCard,
    updateBoardCollection,
    inviteMemberToBoard,
    getUsers,
    getLoggedInUser,
    updateUser,
    updateUserCollection,
    updateCardCollection,
    deleteBoard
}
export const TrellerApp = connect(mapStateToProps, mapDispatchToProps)(_TrellerApp)