import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getLoggedInUser } from '../../store/actions/authActions';
import {
    setCard, updateCard, updateCardCollection, deleteCard, addCard,
    addComment, deleteComment, addTodo, deleteTodo, addCardMember
} from '../../store/actions/cardActions';
import { getBoardById } from '../../store/actions/boardActions';
import Avatar from 'react-avatar';
import { socketService } from '../../services/socketService';

import { CardComments } from '../../cmps/CardComments/CardComments';
import { CardOptions } from '../../cmps/CardOptions/CardOptions';
import { CardChecklists } from '../../cmps/CardChecklists/CardChecklists';
import { CardDescription } from '../../cmps/CardDescription/CardDescription';

import './CardDetails.scss';

export class _CardDetails extends Component {
    state = {
        cardToEdit: null,
        isCardOptionOpen: false,
        cardOptionType: '',
        cardOptionFunc: '',
        listIdx: null,
        listTitle: null
    }

    async componentDidMount() {
        const cardId = this.props.match.params.id;
        await this.props.setCard(cardId);
        await this.props.getLoggedInUser();
        this.setState({ cardToEdit: this.props.card });
        this.getListIdx();

        socketService.setup();
        socketService.emit('register card', cardId);
        socketService.on('updatedBoard', (boardId) => this.setCard(boardId));
        socketService.on('updatedCard', (cardId) => this.setCard(cardId));
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.card !== this.props.card) {
            const cardToEdit = this.props.card;
            this.setState({ cardToEdit });
        }
    }

    // componentWillUnmount() {
    //     socketService.off('updatedCard');
    //     socketService.off('updatedBoard');
    //     socketService.terminate();
    // }

    getListIdx = async () => {
        const { card } = this.props;
        if (card) {
            let board = await this.props.getBoardById(card.createdBy.boardId);
            let listId = card.createdBy.listId;
            const listIdx = board.lists.findIndex(list => {
                return list._id === listId;
            })
            this.setState({ listIdx })
        }
        this.getList();
    }

    getList = async () => {
        let { listIdx } = this.state;
        const { card, board } = this.props;
        if (board) {
            let board = await this.props.getBoardById(card.createdBy.boardId);
            const list = board.lists[listIdx]
            this.setState({ listTitle: list.title })
        }
    }

    // CARD //
    setCard = async (cardId) => {
        await this.props.setCard(cardId);
        this.setState({ cardToEdit: this.props.card });
    }

    onCloseModal = () => {
        this.props.history.goBack();
    }

    handleChangeCard = ({ target }) => {
        const field = target.name;
        const value = target.value;
        this.setState(prevState => ({ cardToEdit: { ...prevState.cardToEdit, [field]: value } }));
    }

    onEnterPress = async (ev) => {
        if (ev.keyCode === 13 && ev.shiftKey === false) {
            ev.preventDefault();
            this.handleChangeCard(ev);
            this.updateTitle();
        }
    }

    updateTitle = async () => {
        const { cardToEdit } = this.state;
        const title = cardToEdit.title;
        await this.props.updateCardCollection(cardToEdit._id, { title });
        this.myTextareaRef.blur();
    }

    deleteCard = async () => {
        const { card, board } = this.props;
        const { listIdx } = this.state;
        await this.props.deleteCard(board._id, listIdx, card._id);
        this.onCloseModal();
    }

    copyCard = async () => {
        const { card, board } = this.props;
        const { listIdx } = this.state;
        await this.props.addCard(board._id, card.createdBy.listId, listIdx, card);
    }

    // DESCRIPTION //
    updateDescription = async (description) => {
        const { card } = this.props;
        await this.props.updateCardCollection(card._id, { description });
    }

    // MEMBERS //
    addMember = async (member) => {
        const { card } = this.props;
        await this.props.addCardMember(card._id, member);
        this.setState({ isCardOptionOpen: false });
    }

    // CHECKLIST //
    addChecklist = async (ev, checklist) => {
        ev.preventDefault();
        const { card } = this.props;
        let checklists = card.checklists;
        checklists.push(checklist);
        await this.props.updateCardCollection(card._id, { checklists });
        this.setState({ isCardOptionOpen: false });
    }

    deleteChecklist = async (checklistIdx) => {
        const { card } = this.props;
        let checklists = card.checklists;
        checklists.splice(checklistIdx, 1);
        await this.props.updateCardCollection(card._id, { checklists });
    }

    addTodo = async (checklistIdx, todo) => {
        const { card } = this.props;
        await this.props.addTodo(card._id, checklistIdx, todo);
    }

    handleCheckChecklist = async (todo, checklistIdx, todoIdx) => {
        const { card } = this.props;
        let checklists = card.checklists;
        let checklist = checklists[checklistIdx]
        checklist.todos.splice(todoIdx, 1, todo);
        checklists.splice(checklistIdx, 1, checklist);
        await this.props.updateCardCollection(card._id, { checklists });
    }

    deleteTodo = async (checklistIdx, todoId) => {
        const { card } = this.props;
        await this.props.deleteTodo(card._id, checklistIdx, todoId);
    }

    // DUE DATE //
    setDate = async (ev, dueDate) => {
        ev.preventDefault();
        const { card } = this.props;
        await this.props.updateCardCollection(card._id, { dueDate })
        this.setState({ isCardOptionOpen: false });
    }

    handleCheckDueDate = async ({ target }) => {
        const {card} = this.props;
        let isComplete = null;
        if (target.checked) {
           isComplete = true;
        } else {
            isComplete = false;
        }
        await this.props.updateCardCollection(card._id, { isComplete });
    }

    onDeleteDueDate = async () => {
        const { card } = this.props;
        const dueDate = '';
        const isComplete = false;
        await this.props.updateCardCollection(card._id, { dueDate, isComplete })
    }

    // LABEL //
    addLabel = async (addedLabel) => {
        const { card } = this.props;
        let labels = card.labels;
        if (labels.some(label => {
            return label === addedLabel;
        })) return;
        labels.push(addedLabel);
        await this.props.updateCardCollection(card._id, { labels });
        this.setState({ isCardOptionOpen: false });
    }

    // COVER //
    addCover = async (cover) => {
        const { card } = this.props;
        const style = { cover };
        await this.props.updateCardCollection(card._id, { style });
        this.setState({ isCardOptionOpen: false });
    }

    // COMMENTS //
    addComment = async (comment) => {
        const { card } = this.props;
        await this.props.addComment(card._id, comment);
    }

    deleteComment = async (commentId) => {
        const cardId = this.props.card._id;
        await this.props.deleteComment(cardId, commentId);
    }

    // CARD OPTIONS //

    openPopUp = (type, func) => {
        this.setState({ isCardOptionOpen: true })
        this.setState({ cardOptionType: type })
        this.setState({ cardOptionFunc: func })
    }

    closePopUp = () => {
        this.setState({ isCardOptionOpen: false })
    }

    render() {
        const { user, board, card } = this.props;
        const { cardToEdit, isCardOptionOpen, cardOptionType, cardOptionFunc, listTitle } = this.state;

        return (
            <section className="card-details modal">
                {(card && cardToEdit && user) && <section className="modal-content">
                    <button className="close-btn close-details-modal" onClick={this.onCloseModal}>
                        <i className="fas fa-times"></i>
                    </button>
                    {card.style.cover &&
                        <div className={`cover ${card.style.cover.color ?
                            card.style.cover.color : card.style.cover.picture}`}>
                        </div>}
                    <div className="title-container">
                        <div className="headline flex align-center">
                            <i className="far fa-file-alt icon"></i>
                           {!board.isTemplate ? <form className="card-title-form">
                                <textarea className="card-title" ref={el => this.myTextareaRef = el}
                                    name="title" value={cardToEdit.title}
                                    onChange={this.handleChangeCard} onKeyDown={this.onEnterPress}
                                    onBlur={this.updateTitle}>
                                </textarea>
                            </form>
                            :<div className="card-title">{cardToEdit.title}</div>}
                        </div>
                        <p className="list-name">in list {listTitle}</p>
                    </div>
                    <div className="flex">
                        <div className="main-container">
                            <div className="other-details flex">
                                {(card.members && card.members.length > 0) &&
                                    <div className="members-container">
                                        <h5 className="other-details-headline">Members</h5>
                                        <div className="flex">
                                            {card.members.map(member => {
                                                return <Avatar name={member.fullName}
                                                    size="30" round={true} key={member._id} />
                                            })}
                                        </div>
                                    </div>
                                }
                                {(card.labels && card.labels.length > 0) &&
                                    <div className="labels-container">
                                        <h5 className="other-details-headline">Labels</h5>
                                        <div className="flex">
                                            {card.labels.map(label => {
                                                return <div className={`label ${label}`}
                                                    key={label}></div>
                                            })}
                                        </div>
                                    </div>}
                                {card.dueDate && <div className="due-date-container">
                                    <h5 className="other-details-headline">Due Date</h5>
                                    <input type="checkbox" onChange={this.handleCheckDueDate} checked={card.isComplete ? true : false} />
                                    <button className="due-date">
                                        {card.dueDate.replace('T', ' at ')}
                                        {card.isComplete && <span className="due-status complete">Complete</span>}
                                        {new Date() > new Date(card.dueDate) &&
                                            <span className="due-status over-due">Over Due</span>}
                                    </button>
                                    <button className="delete-due-date" onClick={this.onDeleteDueDate} title="Delete due date">
                                        <i className="far fa-calendar-times"></i>
                                    </button>
                                </div>}
                            </div>
                            <CardDescription description={card.description} updateDescription={this.updateDescription}
                            board={board} />
                            {(card.checklists && card.checklists.length > 0) &&
                                <CardChecklists checklists={card.checklists} addTodo={this.addTodo} onDeleteTodo={this.deleteTodo}
                                    handleCheckChecklist={this.handleCheckChecklist} onDeleteChecklist={this.deleteChecklist} 
                                    board={board} />}
                            {!board.isTemplate && <CardComments comments={card.comments} user={user}
                                addComment={this.addComment}
                                onDeleteComment={this.deleteComment} />}
                        </div>
                       {!board.isTemplate && <div className="side-container flex column align-center">
                            <h5>ADD TO CARD</h5>
                            <button onClick={() => this.openPopUp('Members', this.addMember)} className="card-details-btn">
                                <i className="fas fa-user-friends"></i> Members</button>
                            <button onClick={() => this.openPopUp('Cover', this.addCover)} className="card-details-btn">
                                <i className="fas fa-palette"></i> Cover</button>
                            <button onClick={() => this.openPopUp('Labels', this.addLabel)} className="card-details-btn">
                                <i className="fas fa-tags"></i> Labels</button>
                            <button onClick={() => this.openPopUp('Checklists', this.addChecklist)} className="card-details-btn">
                                <i className="fas fa-tasks"></i> Checklist</button>
                            <button onClick={() => this.openPopUp('Due Date', this.setDate)} className="card-details-btn">
                                <i className="fas fa-calendar-week"></i> Due Date</button>
                            <br />
                            <h5>ACTIONS</h5>
                            <button onClick={this.copyCard} className="card-details-btn">
                                <i className="fas fa-copy"></i> Copy</button>
                            <button onClick={this.deleteCard} className="card-details-btn">
                                <i className="fas fa-trash"></i> Delete</button>
                        </div> }
                    </div>
                    {isCardOptionOpen && <CardOptions board={board} type={cardOptionType} card={card}
                        closePopUp={this.closePopUp} func={cardOptionFunc} />}
                </section>}
            </section>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.userReducer.loggedInUser,
        card: state.cardReducer.currCard,
        board: state.boardReducer.currBoard
    }
}
const mapDispatchToProps = {
    getLoggedInUser,
    setCard,
    updateCard,
    updateCardCollection,
    addCardMember,
    deleteCard,
    addCard,
    addComment,
    deleteComment,
    addTodo,
    deleteTodo,
    getBoardById
}
export const CardDetails = connect(mapStateToProps, mapDispatchToProps)(_CardDetails)