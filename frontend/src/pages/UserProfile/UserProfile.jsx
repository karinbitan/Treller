import { Component } from 'react';
import { connect } from 'react-redux';
import { setUser } from '../../store/actions/userActions';
import { Link } from 'react-router-dom';

import './UserProfile.scss';

export class _UserProfile extends Component {

    componentDidMount = async () => {
        const userId = this.props.match.params.id;
        await this.props.setUser(userId);
    }

    render() {
        const { user } = this.props;
        return (
            <section className="user-profile">
                {user && <section>
                    <h1>Welcome back {user.fullName}</h1>
                    <p>Your Boards:</p>
                    {user.boardsMember && user.boardsMember.length ? <ul>
                        {user.boardsMember.map((board, idx) => {
                            return <li key={idx}>
                                Board title: <Link to={`/treller/board/${board._id}`}>{board.title}</Link></li>
                        })}
                    </ul>
                        : <p>You don't have any board yet.. <Link to="/treller">Add one!</Link></p>}
                </section>}
            </section>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.userReducer.loggedInUser
    }
}
const mapDispatchToProps = {
    setUser
}
export const UserProfile = connect(mapStateToProps, mapDispatchToProps)(_UserProfile)