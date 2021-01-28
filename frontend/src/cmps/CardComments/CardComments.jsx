import { Component } from 'react';
import Avatar from 'react-avatar';

import './CardComments.scss';

export class CardComments extends Component {

    state = {
        onComment: false,
        cardComment: {
            txt: ''
        },
        isTyping: '',
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


    deleteComment = (ev, commentId) => {
        ev.preventDefault();
        this.props.deleteComment(commentId);
    }

    deleteComment = async (commentId) => {
        const cardId = this.props.cardId;
        await this.props.deleteComment(cardId, commentId);
        await this.props.setCard(cardId);
    }

    render() {
        const { comments } = this.props;
        const {onComment, cardComment, isTyping}
        return (
            <section className="comment-container">
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
                {comments.map((comment, idx) => {
                    return <div className="comment" key={idx}>
                        <Avatar className="comment-avatar" name={comment.byMember.fullName} size="30" round={true}
                            key={comment.byMember._id} />
                        <div className="comment-container flex column align-start">
                            <span className="user-name">{comment.byMember.fullName}</span>
                            <div className="txt-container">
                                <p>{comment.txt}</p>
                            </div>
                            <div className="comment-actions">
                                <span>Edit</span>
                            -
                            <span onClick={(ev) => this.deleteComment(ev, comment._id)}>Delete</span>
                            </div>
                        </div>
                    </div>
                })}
            </section>
        )
    }
}
