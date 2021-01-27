import React, { Component } from 'react';
import Avatar from 'react-avatar';

import { connect } from 'react-redux';
import { getLoggedInUser } from '../../store/actions/authActions';
import { setCard, updateCard, addComment, deleteComment } from '../../store/actions/cardActions';
import { eventBus } from '../../services/eventBusService';
import { CardComments } from '../../cmps/CardComments/CardComments';

import './CardDetails.scss';
import { CardOptions } from '../../cmps/CardOptions/CardOptions';

export class _CardDetails extends Component {
    state = {
        cardToEdit: null,
        showingDescirptionForm: false,
        onComment: false,
        cardComment: {
            txt: ''
        },
        isTyping: '',
        isCardOptionOpen: false,
        cardOptionType: '',
        cardOptionFunc: ''
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

    updateDescription = async (ev, checklist) => {
        debugger
        ev.preventDefault();
        const field = 'checklist'
        this.setState(prevState => ({ cardToEdit: { ...prevState.cardToEdit, [field]: checklist } }));
        const { cardToEdit } = this.state;
        await this.props.updateCard(cardToEdit);
        await this.props.setCard(cardToEdit._id);
        this.setState({ showingDescirptionForm: false });
    }

    addToChecklist = async (ev, todo) => {
        debugger
        ev.preventDefault();
        const { cardToEdit } = this.state;
        let checklist = cardToEdit.checklist;
        checklist.push(todo);
        this.setState({ cardToEdit })
        await this.props.updateCard(cardToEdit);
        await this.props.setCard(cardToEdit._id);
    }

    setDate = async (ev, date) => {
        debugger
        ev.preventDefault();
        const { cardToEdit } = this.state;
        const field = 'dueDate';
        this.setState(prevState => ({ cardToEdit: { ...prevState.cardToEdit, [field]: date } }), async () =>
            await this.props.updateCard(cardToEdit)
        );
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

    // COMMENT //
    handleChangeComment = ({ target }) => {
        const field = target.name;
        const value = target.value;
        this.setState(prevState => ({ cardComment: { ...prevState.cardComment, [field]: value } }));
        if (value !== '') {
            this.setState({ isTyping: ' typing' })
        } else {
            this.setState({ isTyping: '' })
        }
    }

    toggleCommentOption = (ev, boolean) => {
        //TODO: Find how to enter this mode when click window
        ev.stopPropagation();
        if (boolean === true) {
            this.setState({ onComment: true });
        } else {
            this.setState({ onComment: false })
        }
    }

    addComment = async (ev) => {
        debugger
        ev.preventDefault();
        ev.stopPropagation();
        let { cardToEdit } = this.state;
        let comment = this.state.cardComment;
        await this.props.addComment(cardToEdit, comment);
        this.setState(({ cardComment: { ...this.state.cardComment, txt: '' } }), async () =>
            await this.props.setCard(cardToEdit._id));
    }

    deleteComment = async (commentId) => {
        const cardId = this.props.cardId;
        await this.props.deleteComment(cardId, commentId);
        await this.props.setCard(cardId);
    }

    // DESCRIPTION //
    toggleDescriptionForm = (ev) => {
        ev.stopPropagation();
        this.setState({ showingDescirptionForm: !this.state.showingDescirptionForm })
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
    //

    render() {
        const { user, list } = this.props;
        const { cardToEdit, showingDescirptionForm, onComment, isTyping, cardComment,
            isCardOptionOpen, cardOptionType, cardOptionFunc } = this.state;
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
                                {cardToEdit.dueDate && <div>
                                    <h4>Due Date</h4>
                                    <button>{cardToEdit.dueDate}</button>
                                </div>}
                            </div>
                            <div className="description-container">
                                <div className="headline flex align-center">
                                    <i className="fas fa-align-left icon"></i>
                                    <h3>Description</h3>
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
                            {cardToEdit.checklist.length > 0 && <div className="checklist-container">
                                <div className="headline flex align-center">
                                    <i className="fas fa-tasks icon"></i><h3>Checklist</h3>
                                </div>
                                <ul>
                                    {cardToEdit.checklist.map((todo, idx) => {
                                        return <li className="todo" key={idx}><input type="checkbox" /> {todo}</li>
                                    })}
                                </ul>
                            </div>}
                            <div className="comment-container">
                                <div className="headline flex align-center">
                                    <i className="fas fa-comments icon"></i><h3>  Comments</h3>
                                </div>
                                <form onFocus={(ev) => this.toggleCommentOption(ev, true)}
                                    className="comment-form flex wrap" onSubmit={this.addComment}>
                                    {user && <Avatar className="avatar-comment" name={user.fullName} size="35" round={true} />}
                                    <textarea className="comment-text-area" name="txt" placeholder="Add a comment..." value={cardComment.txt}
                                        onChange={this.handleChangeComment}
                                    // onBlur={(ev) => this.toggleCommentOption(ev, false)}
                                    >
                                    </textarea>
                                    <br />
                                    {onComment &&
                                        <button className={'comment-save-btn' + isTyping}>Save</button>
                                    }
                                </form>
                                <CardComments comments={cardToEdit.comments} deleteComment={this.deleteComment} />
                            </div>
                        </div>
                        <div className="side-container flex column">
                            <h4>ADD TO CARD</h4>
                            <button onClick={() => this.openPopUp('Members')} className="card-detail-btn">
                                <i className="fas fa-user-friends"></i> Members</button>
                            <button onClick={() => this.openPopUp('Labels', this.saveLabels)} className="card-detail-btn">
                                <i className="fas fa-tags"></i> Labels</button>
                            <button onClick={() => this.openPopUp('CheckList', this.addToChecklist)} className="card-detail-btn">
                                <i className="fas fa-tasks"></i> Checklist</button>
                            <button onClick={() => this.openPopUp('DueDate', this.setDate)} className="card-detail-btn">
                                <i className="fas fa-calendar-week"></i> Due Date</button>
                            <br />
                            <h4>ACTIONS</h4>
                            <button className="card-detail-btn">
                                <i className="fas fa-arrow-right"></i> Move</button>
                            <button className="card-detail-btn">
                                <i className="fas fa-copy"></i> Copy</button>
                            <button className="card-detail-btn">
                                <i className="fas fa-share"></i> Share</button>
                            <button className="card-detail-btn">
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