import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getLoggedInUser } from '../../store/actions/authActions';
import { setCard, updateCard, addComment, deleteComment } from '../../store/actions/cardActions';
import { eventBus } from '../../services/eventBusService';

import Avatar from 'react-avatar';
import { CardComments } from '../../cmps/CardComments/CardComments';
import { CardOptions } from '../../cmps/CardOptions/CardOptions';

import './CardDetails.scss';

export class _CardDetails extends Component {
    state = {
        cardToEdit: null,
        showingDescirptionForm: false,
        isCardOptionOpen: false,
        cardOptionType: '',
        cardOptionFunc: '',
        isComplete: false,
        isTodoDeleteBtnShow: false
    }

    async componentDidMount() {
        await this.props.getLoggedInUser()
        const { cardId } = this.props;
        await this.props.setCard(cardId);
        this.setState({ cardToEdit: this.props.card });
    }

    // CARD //

    handleChangeCard = ({ target }) => {
        const field = target.name;
        const value = target.value;
        this.setState(prevState => ({ cardToEdit: { ...prevState.cardToEdit, [field]: value } }));
    }

    onEnterPress = (ev) => {
        if (ev.keyCode === 13 && ev.shiftKey === false) {
            ev.preventDefault();
            this.updateCard(ev);
            this.handleChangeCard(ev);
        }
    }

    updateTitle = async (ev) => {
        ev.preventDefault();
        const { cardToEdit } = this.state;
        this.props.updateCard(cardToEdit);
        await this.props.setCard(cardToEdit._id);
        this.myTextareaRef.blur();
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
    showTodoDeleteBtn = () => {
        this.setState({ isTodoDeleteBtnShow: true })
    }

    hideTodoDeleteBtn = () => {
        this.setState({ isTodoDeleteBtnShow: false })
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
        debugger
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

    // LABEL //
    saveLabels = async (labels) => {
        // const field = 'labels';
        // this.setState({cardToEdit: {...this.state.cardToEdit, [field]: [labels]} });
        let { cardToEdit } = this.state;
        cardToEdit.labels.push(labels);
        this.setState(cardToEdit);
        await this.props.updateCard(cardToEdit);
        await this.props.setCard(cardToEdit._id);
    }

    // & MODALS //
    closeModal() {
        eventBus.emit('close-details-modal');
    }

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
        const { user, list } = this.props;
        const { cardToEdit, showingDescirptionForm, isCardOptionOpen, cardOptionType,
             cardOptionFunc, isTodoDeleteBtnShow } = this.state;
        return (
            <section className="card-details modal">
                {cardToEdit && <section className="modal-content">
                    <button className="close-btn" onClick={this.closeModal}>
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
                            <div className="flex">
                                {(cardToEdit.labels && cardToEdit.labels.length > 0) &&
                                    <div className="labels-container">
                                        <h4>Labels</h4>
                                        <div className="flex">
                                            {cardToEdit.labels.map(label => {
                                                if (label || label.length) {
                                                    return <div className={`label ${label.color}`}
                                                        key={label.color}>{label.title}</div>
                                                }
                                            })}
                                        </div>
                                    </div>}
                                {cardToEdit.dueDate && <div className="due-date-container">
                                    <h4>Due Date</h4>
                                    <input type="checkbox" onChange={this.handleCheckDueDate} />
                                    <button className="due-date">
                                        {cardToEdit.dueDate.replace('T', ' at ')}
                                        {cardToEdit.isComplete && <span className="due-status complete">Complete</span>}
                                        {new Date() > new Date(cardToEdit.dueDate) &&
                                            <span className="due-status over-due">Over Due</span>}
                                    </button>
                                </div>}
                            </div>
                            <div className="description-container">
                                <div className="headline flex align-center">
                                    <i className="fas fa-align-left icon"></i>
                                    <h3>Description</h3>
                                    {cardToEdit.description &&
                                        <button className="edit-description" onClick={this.toggleDescriptionForm}>Edit</button>}
                                </div>
                                {!showingDescirptionForm ? <div>
                                    {!cardToEdit.description ? <div
                                        onClick={this.toggleDescriptionForm}
                                        className="description-text-area-fake">
                                        Add more detailed description...
                                </div>
                                        : <div onClick={this.toggleDescriptionForm}
                                            className="description-text-area">
                                            {cardToEdit.description}
                                        </div>}
                                </div>
                                    : <form className="description-form"
                                        onSubmit={this.updateDescription}>
                                        <textarea name="description"
                                            value={cardToEdit.description}
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
                            {cardToEdit.checklist.length > 0 &&
                                <div className="checklist-container">
                                    <div className="headline flex align-center">
                                        <i className="fas fa-tasks icon"></i><h3>Checklist</h3>
                                    </div>
                                    <ul>
                                        {cardToEdit.checklist.map((todo, idx) => {
                                            return <li className="todo flex space-between" key={idx}
                                                onMouseEnter={this.showTodoDeleteBtn}
                                                onMouseLeave={this.hideTodoDeleteBtn}>
                                                <label style={{ textDecoration: todo.isDone ? 'line-through' : 'none' }}>
                                                    <input type="checkbox"
                                                        onChange={ev => this.handleCheckChecklist(ev, todo, idx)}
                                                        checked={todo.isDone} />
                                                    {todo.title}
                                                </label>
                                                {isTodoDeleteBtnShow &&
                                                    <button onClick={() => this.deleteTodo(idx)} className="delete-todo">
                                                        <i className="fas fa-trash"></i>
                                                    </button>}
                                            </li>
                                        })}
                                    </ul>
                                </div>}
                            <CardComments comments={cardToEdit.comments} deleteComment={this.deleteComment} />
                        </div>
                        <div className="side-container flex column">
                            <h4>ADD TO CARD</h4>
                            <button onClick={() => this.openPopUp('Members')} className="card-details-btn">
                                <i className="fas fa-user-friends"></i> Members</button>
                            <button onClick={() => this.openPopUp('Labels', this.saveLabels)} className="card-details-btn">
                                <i className="fas fa-tags"></i> Labels</button>
                            <button onClick={() => this.openPopUp('CheckList', this.addToChecklist)} className="card-details-btn">
                                <i className="fas fa-tasks"></i> Checklist</button>
                            <button onClick={() => this.openPopUp('DueDate', this.setDate)} className="card-details-btn">
                                <i className="fas fa-calendar-week"></i> Due Date</button>
                            <br />
                            <h4>ACTIONS</h4>
                            <button className="card-details-btn">
                                <i className="fas fa-copy"></i> Copy</button>
                            <button className="card-details-btn">
                                <i className="fas fa-trash"></i> Delete</button>
                        </div>
                    </div>
                    {isCardOptionOpen && <CardOptions type={cardOptionType} card={cardToEdit}
                        closePopUp={this.closePopUp} func={cardOptionFunc} />}
                </section>}
            </section>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.userReducer.loggedInUser,
        card: state.cardReducer.currCard
    }
}
const mapDispatchToProps = {
    getLoggedInUser,
    setCard,
    updateCard,
    addComment,
    deleteComment
}
export const CardDetails = connect(mapStateToProps, mapDispatchToProps)(_CardDetails)