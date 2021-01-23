import { Component } from 'react';
import { connect } from 'react-redux';
import { setBoard, addBoard, updateBoard, addList, deleteList, favoriteBoard } from '../../store/actions/boardActions';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { boardService } from '../../services/boardService';
import { deleteCard, updateCard } from '../../store/actions/cardActions';

import { ListPreview } from './../../cmps/ListPreview';

import './TrellerApp.scss';
import { BoardHeader } from '../../cmps/BoardHeader/BoardHeader';
import { MainHeader } from '../../cmps/MainHeader/MainHeader';

class _TrellerApp extends Component {

    state = {
        boardToEdit: null,
        listToEdit: null,
        showingAddListForm: false
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
    }

    // componentDidUpdate(prevProps, prevState) {
    //     if (prevProps.board !== this.props.board) {
    //         this.props.setBoard('5ff1b13c36eed552e70fec47');
    //     }
    // }

    onUpdateBoard = async (boardToEdit) => {
        await this.props.updateBoard(boardToEdit);
    }

    onChangeStyle = async (style) => {
        const { boardToEdit } = this.state;
        boardToEdit.style = style;
        this.setState({ boardToEdit });
        await this.props.updateBoard(boardToEdit);
        await this.props.setBoard(boardToEdit._id);
    }

    // LIST//
    handleChangeList = ({ target }) => {
        const field = target.name;
        const value = target.value;
        this.setState(prevState => ({ listToEdit: { ...prevState.listToEdit, [field]: value } }));
    }

    toggleListForm = (ev) => {
        ev.stopPropagation();
        this.setState({ showingAddListForm: !this.state.showingAddListForm })
    }

    addList = async (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        const { board } = this.props;
        const { listToEdit } = this.state;
        await this.props.addList(board._id, listToEdit);
        await this.props.setBoard(board._id);
        this.setState(({ listToEdit: { ...this.state.listToEdit, title: '' } }));
        this.setState({ showingAddListForm: false });
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
        background: isDraggingOver ? '#6a7eb4' : this.props.board.style.backgroundColor,
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
        const { board } = this.props;
        const { boardToEdit, isStarred, listToEdit, showingAddListForm,
            isMenuOpen, isInviteMenuOpen } = this.state;
        return (
            <section>
                <MainHeader board={board} />
                {board && <section className="treller-app" style={{ backgroundColor: board.style.backgroundColor.app }}>
                    <BoardHeader onUpdateBoard={this.onUpdateBoard}
                        board={board} boardToEdit={boardToEdit}
                        isStarred={isStarred}
                        isMenuOpen={isMenuOpen}
                        isInviteMenuOpen={isInviteMenuOpen}
                        onChangeStyle={this.onChangeStyle} />
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
                        {!showingAddListForm ? <div className="add-container" onClick={this.toggleListForm}><i className="fas fa-plus"></i> Add another list</div>
                            : <form onSubmit={this.addList} className="add-list-form">
                                <input type="text" className="add-form" name="title"
                                    value={listToEdit.title} onChange={this.handleChangeList}
                                    placeholder="Enter a title for this card" onBlur={this.toggleListForm} />
                                <br />
                                <button className="add-form-btn">Add list</button>
                                <button className="exit-btn" onClick={this.toggleListForm}><i className="fas fa-times"></i></button>
                            </form>}
                    </section>
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