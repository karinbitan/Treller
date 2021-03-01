import { useEffect, useRef, useState } from 'react';
import Avatar from 'react-avatar';
import { utilService } from '../../services/utilService';

import './CardComments.scss';

export function CardComments(props) {
    const [comment, setComment] = useState({ txt: '', createdAt: null });
    const [onCommentOption, toggleCommentOption] = useState(false);
    const node = useRef();
    const { comments, user } = props;

    useEffect(() => {
        // add when mounted
        document.addEventListener("mousedown", handleClick);
        // return function to be called when unmounted
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);

    const handleClick = e => {
        if (node.current.contains(e.target)) {
            return;
        }
        toggleCommentOption(false)
    };

    const onAddComment = async (ev) => {
        ev.preventDefault();
        toggleCommentOption(false);
        props.addComment(comment);
        setComment({ txt: '', createdAt: null })
    }

    const isUser = (comment) => {
        if (comment.byMember._id === user._id) {
            return true;
        } else {
            return false;
        }
    }

    return (
        <section ref={node} className="card-comment">
            <div className="headline flex align-center">
                <i className="fas fa-comments icon"></i><h3>  Comments</h3>
            </div>
            <div className="comment-form-container flex">
                {user && <Avatar className="avatar-comment" name={user.fullName} size="30" round={true} />}
                <form onFocus={() => toggleCommentOption(true)}
                    className="comment-form flex cloumn wrap" onSubmit={(ev) => onAddComment(ev)}>
                    <textarea className="comment-text-area" name="txt" placeholder="Add a comment..." value={comment.txt}
                        onChange={(ev) => setComment({ ...comment, [ev.target.name]: ev.target.value, createdAt: new Date() })}>
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
                        <span className="user-name">{comment.byMember.fullName} <span className="comment-date">{utilService.getTime(comment.createdAt)}</span></span>
                        <div className="txt-container">
                            <p>{comment.txt}</p>
                        </div>
                        {isUser(comment) && <div className="comment-actions">
                            <span onClick={() => props.onDeleteComment(comment._id)}>Delete</span>
                        </div>}
                    </div>
                </div>
            })}
        </section>
    )
}
