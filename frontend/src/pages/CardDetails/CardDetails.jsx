import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getLoggedInUser } from '../../store/actions/authActions';
import { setCard, updateCard, deleteCard, addCard, addComment, deleteComment } from '../../store/actions/cardActions';
import { eventBus } from '../../services/eventBusService';

import { CardComments } from '../../cmps/CardComments/CardComments';
import { CardOptions } from '../../cmps/CardOptionsPopUp/CardOptions';

import './CardDetails.scss';
import Avatar from 'react-avatar';

export class _CardDetails extends Component {
    state = {
        cardToEdit: null,
        showingDescirptionForm: false,
        isCardOptionOpen: false,
        cardOptionType: '',
        cardOptionFunc: '',
        isComplete: false,
        isTodoDeleteBtnShow: false,
        currTodoIdx: ''
    }

    async componentDidMount() {
        await this.props.getLoggedInUser()
        const { cardId } = this.props;
        await this.props.setCard(cardId);
        this.setState({ cardToEdit: this.props.card });
    }

    // CARD //

    onCloseModal = () => {
        this.props.onCloseDetailsModal();
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
        this.props.updateCard(cardToEdit);
        await this.props.setCard(cardToEdit._id);
        this.myTextareaRef.blur();
    }

    deleteCard = async () => {
        const { cardId, board, listIdx } = this.props;
        await this.props.deleteCard(board._id, listIdx, cardId);
        this.onCloseModal();
        eventBus.emit('cardChanged');
    }

    copyCard = async () => {
        const { card, board, list, listIdx } = this.props;
        await this.props.addCard(board._id, list._id, listIdx, card);
        eventBus.emit('cardChanged');
    }


    // DESCRIPTION //
    toggleDescriptionForm = (ev) => {
        ev.stopPropagation();
        this.setState({ showingDescirptionForm: !this.state.showingDescirptionForm })
    }

    updateDescription = async (ev) => {
        ev.preventDefault();
        // this.setState(prevState => ({ cardToEdit: { ...prevState.cardToEdit, [field]: checklist } }));
        const { cardToEdit } = this.state;
        await this.props.updateCard(cardToEdit);
        await this.props.setCard(cardToEdit._id);
        this.setState({ showingDescirptionForm: false });
    }

    // MEMBERS //
    addMember = async (ev, member) => {
        ev.preventDefault();
        const { cardToEdit } = this.state;
        let members = cardToEdit.members;
        members.push(member);
        this.setState({ cardToEdit });
        await this.props.updateCard(cardToEdit);
        await this.props.setCard(cardToEdit._id);
        eventBus.emit('invite-to-card', { 'membet': member, 'card': cardToEdit })
    }

    // CHECKLIST //
    addToChecklist = async (ev, todo) => {
        ev.preventDefault();
        const { cardToEdit } = this.state;
        let checklist = cardToEdit.checklist;
        checklist.push(todo);
        this.setState({ cardToEdit })
        await this.props.updateCard(cardToEdit);
        await this.props.setCard(cardToEdit._id);
    }

    handleCheckChecklist = async ({ target }, todo, idx) => {
        let { cardToEdit } = this.state;
        if (target.checked) {
            todo.isDone = true;
        } else {
            todo.isDone = false;
        }
        cardToEdit.checklist.splice(idx, 1, todo);
        this.setState({ cardToEdit }, async () => {
            await this.props.updateCard(cardToEdit);
        });
        await this.props.setCard(cardToEdit._id)
    }
    showTodoDeleteBtn = (ev, idx) => {
        ev.stopPropagation();
        this.setState({ isTodoDeleteBtnShow: true, currTodoIdx: idx })
    }

    hideTodoDeleteBtn = (ev, idx) => {
        ev.stopPropagation();
        this.setState({ isTodoDeleteBtnShow: false, currTodoIdx: idx })
    }

    deleteTodo = async (idx) => {
        let { cardToEdit } = this.state;
        cardToEdit.checklist.splice(idx, 1);
        this.setState({ cardToEdit }, async () => {
            await this.props.updateCard(cardToEdit);
        });
        await this.props.setCard(cardToEdit._id);
    }

    // DUE DATE //
    setDate = async (ev, date) => {
        ev.preventDefault();
        const { cardToEdit } = this.state;
        cardToEdit.dueDate = date;
        await this.props.updateCard(cardToEdit)
        await this.props.setCard(cardToEdit._id);
    }

    handleCheckDueDate = ({ target }) => {
        const field = 'isComplete';
        if (target.checked) {
            this.setState(({ cardToEdit: { ...this.state.cardToEdit, [field]: true } }));
        } else {
            this.setState(({ cardToEdit: { ...this.state.cardToEdit, [field]: false } }));
        }
    }

    deleteDueDate = async () => {
        const { cardToEdit } = this.state;
        cardToEdit.dueDate = '';
        await this.props.updateCard(cardToEdit)
        await this.props.setCard(cardToEdit._id);
    }

    // LABEL //
    saveLabels = async (labels) => {
        // const field = 'labels';
        // this.setState({cardToEdit: {...this.state.cardToEdit, [field]: [labels]} });
        let { cardToEdit } = this.state;
        cardToEdit.labels.push(labels);
        this.setState(cardToEdit);
        await this.props.updateCard(cardToEdit);
        await this.props.setCard(cardToEdit._id);
        eventBus.emit('cardChanged');
    }

    // COMMENTS //
    onAddComment = async (comment) => {
        const { cardId } = this.props;
        await this.props.addComment(cardId, comment);
        await this.props.setCard(cardId);
    }

    onDeleteComment = async (commentId) => {
        const cardId = this.props.cardId;
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
        const { user, board, list, card } = this.props;
        const { cardToEdit, showingDescirptionForm, isCardOptionOpen, cardOptionType,
            cardOptionFunc, isTodoDeleteBtnShow, currTodoIdx } = this.state;
        return (
            <section className="card-details modal">
                {(card && cardToEdit) && <section className="modal-content">
                    <button className="close-btn" onClick={this.onCloseModal}>
                        <i className="fas fa-times"></i>
                    </button>
                    <div className="title-container">
                        <div className="headline flex align-center">
                            <i className="far fa-file-alt icon"></i>
                            <form onSubmit={this.updateTitle}>
                                <textarea className="card-title" ref={el => this.myTextareaRef = el}
                                    name="title" value={cardToEdit.title}
                                    onChange={this.handleChangeCard} onKeyDown={this.onEnterPress}>
                                </textarea>
                                <button className="not-show"></button>
                            </form>
                        </div>
                        <p className="list-name">in list {list.title}</p>
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
                                                return <div className={`label ${label.color}`}
                                                    key={label.color}>{label.title}</div>
                                            })}
                                        </div>
                                    </div>}
                                {card.dueDate && <div className="due-date-container">
                                    <h4>Due Date</h4>
                                    <input type="checkbox" onChange={this.handleCheckDueDate} />
                                    <button className="due-date">
                                        {card.dueDate.replace('T', ' at ')}
                                        {card.isComplete && <span className="due-status complete">Complete</span>}
                                        {new Date() > new Date(card.dueDate) &&
                                            <span className="due-status over-due">Over Due</span>}
                                    </button>
                                    <button className="delete-due-date" onClick={this.deleteDueDate}>
                                        <i className="far fa-calendar-times"></i>
                                    </button>
                                </div>}
                            </div>
                            <div className="description-container">
                                <div className="headline flex align-center">
                                    <i className="fas fa-align-left icon"></i>
                                    <h3>Description</h3>
                                    {(card.description && !showingDescirptionForm) &&
                                        <button className="edit-description" onClick={this.toggleDescriptionForm}>Edit</button>}
                                </div>
                                {!showingDescirptionForm ? <div>
                                    {!card.description ? <div
                                        onClick={this.toggleDescriptionForm}
                                        className="description-text-area-fake">
                                        Add more detailed description...
                                </div>
                                        : <div onClick={this.toggleDescriptionForm}
                                            className="description-text-area">
                                            {card.description}
                                        </div>}
                                </div>
                                    : <form className="description-form"
                                        onSubmit={this.updateDescription}>
                                        <textarea name="description"
                                            value={card.description}
                                            onChange={this.handleChangeCard}
                                            placeholder="Add more detailed description...">
                                        </textarea>
                                        <br />
                                        <div className="btn flex justify-start">
                                            <button className="add-form-btn">Save</button>
                                            <button className="exit-btn"
                                                onClick={this.toggleDescriptionForm}>
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    </form>}
                            </div>
                            {card.checklist.length > 0 &&
                                <div className="checklist-container">
                                    <div className="headline flex align-center">
                                        <i className="fas fa-tasks icon"></i><h3>Checklist</h3>
                                    </div>
                                    <ul>
                                        {card.checklist.map((todo, idx) => {
                                            return <li className="todo flex space-between" key={idx}
                                                onMouseEnter={(ev) => this.showTodoDeleteBtn(ev, idx)}
                                                onMouseLeave={(ev) => this.hideTodoDeleteBtn(ev, idx)}>
                                                <label style={{ textDecoration: todo.isDone ? 'line-through' : 'none' }}>
                                                    <input type="checkbox"
                                                        onChange={ev => this.handleCheckChecklist(ev, todo, idx)}
                                                        checked={todo.isDone} />
                                                    {todo.title}
                                                </label>
                                                <button onClick={() => this.deleteTodo(idx)} className="delete-todo"
                                                    style={{ display: isTodoDeleteBtnShow && currTodoIdx === idx ? 'block' : 'none' }}>
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </li>
                                        })}
                                    </ul>
                                </div>}
                            <CardComments comments={card.comments} user={user}
                                onAddComment={this.onAddComment}
                                onDeleteComment={this.onDeleteComment} />
                        </div>
                        <div className="side-container flex column">
                            <h4>ADD TO CARD</h4>
                            <button onClick={() => this.openPopUp('Members', this.addMember)} className="card-details-btn">
                                <i className="fas fa-user-friends"></i> Members</button>
                            <button onClick={() => this.openPopUp('Labels', this.saveLabels)} className="card-details-btn">
                                <i className="fas fa-tags"></i> Labels</button>
                            <button onClick={() => this.openPopUp('CheckList', this.addToChecklist)} className="card-details-btn">
                                <i className="fas fa-tasks"></i> Checklist</button>
                            <button onClick={() => this.openPopUp('DueDate', this.setDate)} className="card-details-btn">
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
    deleteCard,
    addCard,
    addComment,
    deleteComment
}
export const CardDetails = connect(mapStateToProps, mapDispatchToProps)(_CardDetails)