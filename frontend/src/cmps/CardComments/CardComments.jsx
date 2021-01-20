import { Component } from 'react';
import Avatar from 'react-avatar';

import './CardComments.scss';

export class CardComments extends Component {

    deleteComment = (ev, commentId) => {
        ev.preventDefault();
        this.props.deleteComment(commentId);
    }

    render() {
        const { comments } = this.props;
        return (
            <section className="card-comments">
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
