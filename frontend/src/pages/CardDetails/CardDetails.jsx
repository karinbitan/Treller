import { Component } from 'react';
import Avatar from 'react-avatar';

import { connect } from 'react-redux';
import { setUser } from '../../store/actions/userActions';
import { getCardById, updateCard, addComment, deleteComment } from '../../store/actions/cardActions';
import { cardService } from './../../services/cardService';
import { eventBus } from '../../services/eventBusService';
import { CardComments } from '../../cmps/CardComments/CardComments';

import './CardDetails.scss';
import { CardOptions } from '../../cmps/CardOptionsPopUp/CardOptions';

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
        await this.props.setUser('5ff1b0d236eed552e70fda06');
        // const cardId = this.props.match.params.id;
        // const card = await this.props.getCardById(cardId);
        const card = await this.loadCard();
        this.setState({ cardToEdit: card });
    }

    loadCard = async () => {
        const { cardId } = this.props;
        const card = await cardService.getCardById(cardId);
        return card;
    }

    handleChange = ({ target }) => {
        const field = target.name;
        const value = target.value;
        if (field === 'txt') {
            this.setState(prevState => ({ cardComment: { ...prevState.cardComment, [field]: value } }));
            if (value !== '') {
                this.setState({ isTyping: ' typing' })
            } else {
                this.setState({ isTyping: '' })
            }
        } else {
            this.setState(prevState => ({ cardToEdit: { ...prevState.cardToEdit, [field]: value } }));
        }
    }

    toggleDescriptionForm = (ev) => {
        ev.stopPropagation();
        this.setState({ showingDescirptionForm: !this.state.showingDescirptionForm })
    }

    updateCard = async (ev) => {
        ev.preventDefault();
        const { cardToEdit } = this.state;
        this.props.updateCard(cardToEdit);
        await this.loadCard();
        this.setState({ showingDescirptionForm: false })
    }

    closeModal() {
        eventBus.emit('close-details-modal');
    }

    toggleCommentOption = (ev, boolean) => {
        //TODO: Find how to enter this mode when click window
        ev.stopPropagation();
        if (boolean === 'true') {
            this.setState({ onComment: true });
        } else {
            this.setState({ onComment: false });
        }
    }

    addComment = async (ev) => {
        ev.preventDefault();
        let { cardToEdit } = this.state;
        let comment = this.state.cardComment;
        await this.props.addComment(cardToEdit, comment);
        this.setState(({ cardComment: { ...this.state.cardComment, txt: '' } }));
        await this.loadCard()
    }

    deleteComment = async (commentId) => {
        const cardId = this.props.cardId;
        await this.props.deleteComment(cardId, commentId);
    }

    openPopUp = (type, func) => {
        this.setState({ isCardOptionOpen: true })
        this.setState({ cardOptionType: type })
        this.setState({ cardOptionFunc: func })
    }

    closePopUp = () => {
        this.setState({ isCardOptionOpen: false })
    }

    saveLabels = async (labels) => {
        // const field = 'labels';
        // this.setState({cardToEdit: {...this.state.cardToEdit, [field]: [labels]} });
        let { cardToEdit } = this.state;
        cardToEdit.labels.push(labels);
        this.setState(cardToEdit);
        await this.props.updateCard(cardToEdit);
        await this.loadCard();
    }

    render() {
        const { user } = this.props;
        const { cardToEdit, showingDescirptionForm, onComment, isTyping, cardComment,
            isCardOptionOpen, cardOptionType, cardOptionFunc } = this.state;
        return (
            <section className="card-details modal">
                {cardToEdit && <section className="modal-content">
                    <button className="modal-close-btn" onClick={this.closeModal}><i className="fas fa-times"></i></button>
                    <div className="title-container">
                        <div className="headline flex align-center">
                            <i className="far fa-file-alt icon"></i>
                            <form onSubmit={this.updateCard}>
                                <textarea className="card-title" name="title" value={cardToEdit.title} onChange={this.handleChange}></textarea>
                                <button className="not-show"></button>
                            </form>
                        </div>
                        <br />
                        {/* <p>in list 'list name'</p> */}
                    </div>
                    <div className="flex">
                        <div className="main-container">
                            {cardToEdit.labels && <div className="labels-container">
                                <p>Labels</p>
                                <div className="flex">
                                {cardToEdit.labels.map(label => {
                                    if (label || label.length) {
                                        return <div className={`label ${label.color}`} key={label.color}>{label.title}</div>
                                    }
                                })}
                                </div>
                            </div>}
                            <div className="description-container">
                                <i className="fas fa-align-left icon"></i>
                                <div className="headline flex align-center">
                                    <h3>Description</h3>
                                </div>
                                {!showingDescirptionForm ? <div>
                                    {!cardToEdit.description ? <div onClick={this.toggleDescriptionForm} className="description-text-area-fake">
                                        Add more detailed description...
                                </div>
                                        : <div onClick={this.toggleDescriptionForm} className="description-text-area">
                                            {cardToEdit.description}
                                        </div>}
                                </div>
                                    : <form className="description-form" onSubmit={this.updateCard}>
                                        <textarea name="description" value={cardToEdit.description}
                                            onChange={this.handleChange} placeholder="Add more detailed description..."></textarea>
                                        <br />
                                        <button className="add-form-btn">Save</button>
                                        <button className="exit-btn" onClick={this.toggleDescriptionForm}><i className="fas fa-times"></i></button>
                                    </form>}
                            </div>
                            <div className="comment-container">
                                <div className="headline flex align-center">
                                    <i className="fas fa-comments icon"></i><h3>  Comments</h3>
                                </div>
                                <form onClick={(ev) => this.toggleCommentOption(ev, 'true')} className="flex wrap" onSubmit={this.addComment}>
                                    {user && <Avatar name={user.fullName} size="30" round={true} />}
                                    <textarea className="comment-form" name="txt" placeholder="Add a comment..." value={cardComment.txt}
                                        onChange={this.handleChange}>
                                    </textarea>
                                    <br />
                                    {onComment && <div>
                                        <button className={'comment-save-btn' + isTyping}>Save</button>
                                        <button onClick={(ev) => this.toggleCommentOption(ev, 'false')}>X</button>
                                    </div>}
                                </form>
                                <CardComments comments={cardToEdit.comments} deleteComment={this.deleteComment} />
                            </div>
                            <div className="activity-container">
                                <div className="headline flex align-baseline">
                                    <i className="fas fa-list icon"></i><h3>  Activity</h3>
                                </div>
                            </div>
                        </div>
                        <div className="side-container flex column">
                            <h4>ADD TO CARD</h4>
                            <button onClick={() => this.openPopUp('Members')} className="card-detail-btn">
                                <i className="fas fa-user-friends"></i> Members</button>
                            <button onClick={() => this.openPopUp('Labels', this.saveLabels)} className="card-detail-btn">
                                <i className="fas fa-tags"></i> Labels</button>
                            <button onClick={() => this.openPopUp('CheckList')} className="card-detail-btn">
                                <i className="fas fa-tasks"></i> Checklist</button>
                            <button onClick={() => this.openPopUp('DueDate')} className="card-detail-btn">
                                <i className="fas fa-calendar-week"></i> Due Date</button>
                            <button onClick={() => this.openPopUp('Cover')} className="card-detail-btn">
                                <i className="fas fa-palette"></i> Cover</button>
                            <br />
                            <h4>ACTIONS</h4>
                            <button className="card-detail-btn">
                                <i className="fas fa-arrow-right"></i> Move</button>
                            <button className="card-detail-btn">
                                <i className="fas fa-copy"></i> Copy</button>
                            <button className="card-detail-btn">
                                <i className="fas fa-share"></i> Share</button>
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
        user: state.userReducer.currUser
    }
}
const mapDispatchToProps = {
    setUser,
    getCardById,
    updateCard,
    addComment,
    deleteComment
}
export const CardDetails = connect(mapStateToProps, mapDispatchToProps)(_CardDetails)