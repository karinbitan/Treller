import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getLoggedInUser } from '../../store/actions/authActions';
import {
    setCard, updateCard, updateCardCollection, deleteCard, addCard,
    addComment, deleteComment, addTodo, deleteTodo
} from '../../store/actions/cardActions';
import { getListById } from './../../store/actions/boardActions';
import { eventBus } from '../../services/eventBusService';
import Avatar from 'react-avatar';
import { socketService } from '../../services/socketService';

import { CardComments } from '../../cmps/CardComments/CardComments';
import { CardOptions } from '../../cmps/CardOptionsPopUp/CardOptions';
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
        socketService.on('newCard', (cardId) => this.setCard(cardId));
        socketService.emit('savedBoard', this.props.card.boardId);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.card !== this.props.card) {
            const cardToEdit = this.props.card;
            this.setState({ cardToEdit });
        }
    }

    componentWillUnmount() {
        console.log('unmount')
        socketService.off('newCard');
        socketService.off('newBoard');
        socketService.terminate();
    }

    getListIdx = () => {
        let {card, board} = this.props;
        let listId = card.createdBy.listId;
      const listIdx = board.lists.findIndex(list =>{
            return list._id === listId;
        })
        this.setState({listIdx})
    }

    // CARD //

    setCard = async (cardId) => {
        debugger
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
        await this.props.updateCard(cardToEdit);
        await this.props.setCard(cardToEdit._id);
        this.myTextareaRef.blur();
    }

    deleteCard = async () => {
        const { cardId, board } = this.props;
        const {listIdx} = this.state;
        await this.props.deleteCard(board._id, listIdx, cardId);
        this.onCloseModal();
    }

    copyCard = async () => {
        const { card, board} = this.props;
        const {listIdx} = this.state;
        await this.props.addCard(board._id, card.createdBy.listId, listIdx, card);
    }

    // DESCRIPTION //
    onUpdateDescription = async (description) => {
        const field = description;
        this.setState(prevState => ({ cardToEdit: { ...prevState.cardToEdit, [field]: description } }));
        const { cardToEdit } = this.state;
        await this.props.updateCardCollection(cardToEdit._id, { description });
        await this.props.setCard(cardToEdit._id);
    }

    // MEMBERS //
    addMember = async (ev, member) => {
        const { cardToEdit } = this.state;
        let members = cardToEdit.members;
        members.push(member);
        this.setState({ cardToEdit });
        await this.props.updateCard(cardToEdit);
        await this.props.setCard(cardToEdit._id);
        eventBus.emit('invite-to-card', { 'membet': member, 'card': cardToEdit })
    }

    // CHECKLIST //
    addChecklist = async (ev, checklist) => {
        ev.preventDefault();
        debugger
        const { cardToEdit } = this.state;
        let checklists = cardToEdit.checklists;
        checklists.push(checklist);
        this.setState({ cardToEdit });
        await this.props.updateCardCollection(cardToEdit._id, { 'checklists': cardToEdit.checklists });
        await this.props.setCard(cardToEdit._id);
    }

    onAddTodo = async (checklistIdx, todo) => {
        const { card } = this.props;
        debugger
        await this.props.addTodo(card._id, checklistIdx, todo);
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
        const field = 'isCardComplete';
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
    addLabel = async (label) => {
        let { cardToEdit } = this.state;
        cardToEdit.labels.push(label);
        this.setState(cardToEdit);
        const labels = cardToEdit.labels;
        await this.props.updateCardCollection(cardToEdit._id, { labels });
        await this.props.setCard(cardToEdit._id);
    }

    // COVER //
    addCover = async (cover) => {
        let { cardToEdit } = this.state;
        cardToEdit.style = { cover };
        this.setState(cardToEdit);
        await this.props.updateCardCollection(cardToEdit._id, { cover });
        await this.props.setCard(cardToEdit._id);
    }

    // COMMENTS //
    onAddComment = async (comment) => {
        const { card } = this.props;
        await this.props.addComment(card._id, comment);
        await this.props.setCard(card._id);
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
                            <form onSubmit={this.updateTitle} className="card-title-form">
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
                                    <button className="delete-due-date" onClick={this.deleteDueDate}>
                                        <i className="far fa-calendar-times"></i>
                                    </button>
                                </div>}
                            </div>
                            <CardDescription description={card.description} onUpdateDescription={this.onUpdateDescription} />
                            {(card.checklists && card.checklists.length > 0) &&
                                <CardChecklists checklists={card.checklists} onAddTodo={this.onAddTodo} />}
                            <CardComments comments={card.comments} user={user}
                                onAddComment={this.onAddComment}
                                onDeleteComment={this.onDeleteComment} />
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