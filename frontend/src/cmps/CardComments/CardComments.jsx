import { useState } from 'react';
import Avatar from 'react-avatar';

import './CardComments.scss';

export function CardComments(props) {
    const [comment, setComment] = useState({ txt: '' });
    const [onCommentOption, toggleCommentOption] = useState(false);

    const onAddComment = async (ev) => {
        ev.preventDefault();
        toggleCommentOption(false);
        props.addComment(comment);
        setComment({ txt: '' })
    }

    const { comments, user } = props;
    return (
        <section className="card-comment">
            <div className="headline flex align-center">
                <i className="fas fa-comments icon"></i><h3>  Comments</h3>
            </div>
            <div className="comment-form-container flex">
                {user && <Avatar className="avatar-comment" name={user.fullName} size="35" round={true} />}
                <form onFocus={() => toggleCommentOption(true)}
                    className="comment-form flex wrap" onSubmit={(ev) => onAddComment(ev)}>
                    <textarea className="comment-text-area" name="txt" placeholder="Add a comment..." value={comment.txt}
                        onChange={(ev) => setComment({ ...comment, [ev.target.name]: ev.target.value })}>
                    </textarea>
                    <br />
                    {onCommentOption &&
                        <div className="btn-container">
                            <button className={`comment-save-btn ${comment.txt.length ? 'typing' : ''}`}>Save</button>
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
                            <span onClick={() => props.onDeleteComment(comment._id)}>Delete</span>
                        </div>
                    </div>
                </div>
            })}
        </section>
    )
}
