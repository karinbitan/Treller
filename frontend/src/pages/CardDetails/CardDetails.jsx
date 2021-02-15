import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getLoggedInUser } from '../../store/actions/authActions';
import {
    setCard, updateCard, updateCardCollection, deleteCard, addCard,
    addComment, deleteComment, addTodo, deleteTodo
} from '../../store/actions/cardActions';
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
        isCardComplete: false,
        listIdx: null
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
        // socketService.emit('savedBoard', this.props.card.boardId);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.card !== this.props.card) {
            const cardToEdit = this.props.card;
            this.setState({ cardToEdit });
        }
    }

    componentWillUnmount() {
        console.log('unmount')
        socketService.off('updatedCard');
        socketService.off('updatedBoard');
        socketService.terminate();
    }

    getListIdx = () => {
        let { card, board } = this.props;
        let listId = card.createdBy.listId;
        const listIdx = board.lists.findIndex(list => {
            return list._id === listId;
        })
        this.setState({ listIdx })
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
            this.updateTitle(ev);
        }
    }

    updateTitle = async (ev) => {
        ev.preventDefault();
        const { cardToEdit } = this.state;
        const { board } = this.props;
        const title = cardToEdit.title;
        await this.props.updateCardCollection(board._id, cardToEdit._id, { title });
        await this.props.setCard(cardToEdit._id);
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
        const { board, card } = this.props;
        await this.props.updateCardCollection(board._id, card._id, { description });
        await this.props.setCard(card._id);
    }

    // MEMBERS //
    addMember = async (member) => {
        const { board, card } = this.props;
        let members = card.members;
        members.push(member);
        await this.props.updateCardCollection(board._id, card._id, { members });
        await this.props.setCard(card._id);
        this.setState({ isCardOptionOpen: false });
    }

    // CHECKLIST //
    addChecklist = async (ev, checklist) => {
        ev.preventDefault();
        const { board, card } = this.props;
        let checklists = card.checklists;
        checklists.push(checklist);
        await this.props.updateCardCollection(board._id, card._id, { checklists });
        await this.props.setCard(card._id);
        this.setState({ isCardOptionOpen: false });
    }

    deleteChecklist = async (checklistIdx) => {
        const { board, card } = this.props;
        let checklists = card.checklists;
        checklists.splice(checklistIdx, 1);
        await this.props.updateCardCollection(board._id, card._id, { checklists });
        await this.props.setCard(card._id);
    }

    addTodo = async (checklistIdx, todo) => {
        const { card } = this.props;
        await this.props.addTodo(card._id, checklistIdx, todo);
        await this.props.setCard(card._id);
    }

    handleCheckChecklist = async (todo, checklistIdx, todoIdx) => {
        const { board, card } = this.props;
        let checklists = card.checklists;
        let checklist = checklists[checklistIdx]
        checklist.todos.splice(todoIdx, 1, todo);
        checklists.splice(checklistIdx, 1, checklist);
        await this.props.updateCardCollection(board._id, card._id, { checklists });
        await this.props.setCard(card._id)
    }

    deleteTodo = async (checklistIdx, todoId) => {
        const { card } = this.props;
        await this.props.deleteTodo(card._id, checklistIdx, todoId);
        await this.props.setCard(card._id);
    }

    // DUE DATE //
    setDate = async (ev, date) => {
        ev.preventDefault();
        const { board, card } = this.props;
        await this.props.updateCardCollection(board._id, card._id, { date })
        await this.props.setCard(card._id);
        this.setState({ isCardOptionOpen: false });
    }

    handleCheckDueDate = ({ target }) => {
        const field = 'isCardComplete';
        if (target.checked) {
            this.setState(({ cardToEdit: { ...this.state.cardToEdit, [field]: true } }));
        } else {
            this.setState(({ cardToEdit: { ...this.state.cardToEdit, [field]: false } }));
        }
    }

    onDeleteDueDate = async () => {
        const { board, card } = this.props;
        const dueDate = '';
        await this.props.updateCardCollection(board._id, card._id, { dueDate })
        await this.props.setCard(card._id);
    }

    // LABEL //
    addLabel = async (addedLabel) => {
        const { board, card } = this.props;
        let labels = card.labels;
        if (labels.some(label => {
            return label === addedLabel;
        })) return;
        labels.push(addedLabel);
        await this.props.updateCardCollection(board._id, card._id, { labels });
        await this.props.setCard(card._id);
        this.setState({ isCardOptionOpen: false });
    }

    // COVER //
    addCover = async (cover) => {
        const { board, card } = this.props;
        const style = { cover };
        await this.props.updateCardCollection(board._id, card._id, { style });
        await this.props.setCard(card._id);
        this.setState({ isCardOptionOpen: false });
    }

    // COMMENTS //
    addComment = async (comment) => {
        const { card } = this.props;
        await this.props.addComment(card._id, comment);
        await this.props.setCard(card._id);
    }

    deleteComment = async (commentId) => {
        const cardId = this.props.card._id;
        await this.props.deleteComment(cardId, commentId);
        await this.props.setCard(cardId);
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
    //

    render() {
        // const { user, board, list, card } = this.props;
        const { user, board, card } = this.props;
        const { cardToEdit, isCardOptionOpen, cardOptionType, cardOptionFunc } = this.state;

        return (
            <section className="card-details modal">
                {(card && cardToEdit) && <section className="modal-content">
                    <button className="close-btn" onClick={this.onCloseModal}>
                        <i className="fas fa-times"></i>
                    </button>
                    {card.style.cover &&
                        <div className={`cover ${card.style.cover.color ?
                            card.style.cover.color : card.style.cover.picture}`}>
                        </div>}
                    <div className="title-container">
                        <div className="headline flex align-center">
                            <i className="far fa-file-alt icon"></i>
                            <form className="card-title-form">
                                <textarea className="card-title" ref={el => this.myTextareaRef = el}
                                    name="title" value={cardToEdit.title}
                                    onChange={this.handleChangeCard} onKeyDown={this.onEnterPress}>
                                </textarea>
                            </form>
                        </div>
                        {/* <p className="list-name">in list {list.title}</p> */}
                    </div>
                    <div className="flex">
                        <div className="main-container">
                            <div className="other-details flex">
                                {(card.members && card.members.length > 0) &&
                                    <div className="members-containers">
                                        <h4>Members</h4>
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
                                        <h4>Labels</h4>
                                        <div className="flex">
                                            {card.labels.map(label => {
                                                return <div className={`label ${label}`}
                                                    key={label}></div>
                                            })}
                                        </div>
                                    </div>}
                                {card.dueDate && <div className="due-date-container">
                                    <h4>Due Date</h4>
                                    <input type="checkbox" onChange={this.handleCheckDueDate} />
                                    <button className="due-date">
                                        {card.dueDate.replace('T', ' at ')}
                                        {card.isCardComplete && <span className="due-status complete">Complete</span>}
                                        {new Date() > new Date(card.dueDate) &&
                                            <span className="due-status over-due">Over Due</span>}
                                    </button>
                                    <button className="delete-due-date" onClick={this.onDeleteDueDate}>
                                        <i className="far fa-calendar-times"></i>
                                    </button>
                                </div>}
                            </div>
                            <CardDescription description={card.description} updateDescription={this.updateDescription} />
                            {(card.checklists && card.checklists.length > 0) &&
                                <CardChecklists checklists={card.checklists} addTodo={this.addTodo} onDeleteTodo={this.deleteTodo}
                                    handleCheckChecklist={this.handleCheckChecklist} onDeleteChecklist={this.deleteChecklist} />}
                            <CardComments comments={card.comments} user={user}
                                addComment={this.addComment}
                                onDeleteComment={this.deleteComment} />
                        </div>
                        <div className="side-container flex column">
                            <h4>ADD TO CARD</h4>
                            <button onClick={() => this.openPopUp('members', this.addMember)} className="card-details-btn">
                                <i className="fas fa-user-friends"></i> Members</button>
                            <button onClick={() => this.openPopUp('cover', this.addCover)} className="card-details-btn">
                                <i className="fas fa-palette"></i> Cover</button>
                            <button onClick={() => this.openPopUp('labels', this.addLabel)} className="card-details-btn">
                                <i className="fas fa-tags"></i> Labels</button>
                            <button onClick={() => this.openPopUp('checklists', this.addChecklist)} className="card-details-btn">
                                <i className="fas fa-tasks"></i> Checklist</button>
                            <button onClick={() => this.openPopUp('dueDate', this.setDate)} className="card-details-btn">
                                <i className="fas fa-calendar-week"></i> Due Date</button>
                            <br />
                            <h4>ACTIONS</h4>
                            <button onClick={this.copyCard} className="card-details-btn">
                                <i className="fas fa-copy"></i> Copy</button>
                            <button onClick={this.deleteCard} className="card-details-btn">
                                <i className="fas fa-trash"></i> Delete</button>
                        </div>
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
    deleteCard,
    addCard,
    addComment,
    deleteComment,
    addTodo,
    deleteTodo
}
export const CardDetails = connect(mapStateToProps, mapDispatchToProps)(_CardDetails)