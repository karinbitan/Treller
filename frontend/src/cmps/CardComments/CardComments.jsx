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

    // componentDidUpdate(prevProps) {
    //     // Typical usage (don't forget to compare props):
    //     debugger
    //     if (this.props.comments !== prevProps.comments) {
    //       this.fetchData(this.props.comments);
    //     }
    //   }

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
        ev.stopPropagation();
        if (boolean === true) {
            this.setState({ onComment: true });
        } else {
            this.setState({ onComment: false })
        }
    }

    onAddComment = async (ev) => {
        debugger
        ev.preventDefault();
        ev.stopPropagation();
        this.setState({ onComment: false })
        let comment = this.state.cardComment;
        this.props.onAddComment(comment);
        this.setState(({ cardComment: { ...this.state.cardComment, txt: '' } }));
    }


    onDeleteComment = (ev, commentId) => {
        ev.preventDefault();
        this.props.onDeleteComment(commentId);
    }

    render() {
        const { comments, user } = this.props;
        const { onComment, cardComment, isTyping } = this.state;
        return (
            <section className="card-comment">
                <div className="headline flex align-center">
                    <i className="fas fa-comments icon"></i><h3>  Comments</h3>
                </div>
                <div className="comment-form-container">
                    {user && <Avatar className="avatar-comment" name={user.fullName} size="35" round={true} />}
                    <form onFocus={(ev) => this.toggleCommentOption(ev, true)}
                        className="comment-form flex wrap" onSubmit={this.onAddComment}>
                        <textarea className="comment-text-area" name="txt" placeholder="Add a comment..." value={cardComment.txt}
                            onChange={this.handleChangeComment}
                        // onBlur={(ev) => this.toggleCommentOption(ev, false)}
                        >
                        </textarea>
                        <br />
                        {onComment &&
                            <div className="btn-container">
                                <button className={'comment-save-btn' + isTyping}>Save</button>
                            </div>
                        }
                    </form>
                </div>
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
                            <span onClick={(ev) => this.onDeleteComment(ev, comment._id)}>Delete</span>
                            </div>
                        </div>
                    </div>
                })}
            </section>
        )
    }
}
