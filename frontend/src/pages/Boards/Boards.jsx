import { Component } from 'react';
import { MainHeader } from '../../cmps/MainHeader/MainHeader';
import Template1 from './../../assets/templates/bgc-small1.jpg';
import Template2 from './../../assets/templates/bgc-small2.jpg';
import Template3 from './../../assets/templates/bgc-small3.jpg';
import Template4 from './../../assets/templates/bgc-small4.jpg';

import { connect } from 'react-redux';
import { getLoggedInUser } from '../../store/actions/authActions';
import { addBoard } from '../../store/actions/boardActions';
import { Link } from 'react-router-dom';
import { boardService } from '../../services/boardService';

import './Boards.scss';
import Avatar from 'react-avatar';

export class _Boards extends Component {
    async componentDidMount() {
        await this.props.getLoggedInUser();
    }

    addBoardWithTemplate = async (img) => {
        let emptyBoard = boardService.getEmptyBoard();
        emptyBoard.style.backgroundImage = img;
        await this.props.addBoard(emptyBoard);
    }

    render() {
        const { user } = this.props;
        const templates = [
            { name: 'Nature', smallImg: Template1, largImg: "https://res.cloudinary.com/druhd0ddz/image/upload/v1612278509/treller/bgc-large1_kxtkq8.jpg" },
            { name: 'Relax', smallImg: Template4, largImg: "https://res.cloudinary.com/druhd0ddz/image/upload/v1612278509/treller/bgc-large4_b6g9p0.jpg" },
            { name: 'Work', smallImg: Template3, largImg: "https://res.cloudinary.com/druhd0ddz/image/upload/v1612278509/treller/bgc-large3_dq1hat.jpg" },
            { name: 'Animals', smallImg: Template2, largImg: "https://res.cloudinary.com/druhd0ddz/image/upload/v1612278509/treller/bgc-large2_zr62xq.jpg" }
        ];
        if (user) {
            if (user.boardsMember && user.boardsMember.length > 0) {
                var favBoards = user.boardsMember.map(board => {
                    return board;
                })
                    .filter(favBoard => {
                        return favBoard.isFavorite === true;
                    })
            }
        }
        return (
            <section>
                {user && <MainHeader isUserPage={true} user={user} />}
                {user && <section className="boards container">
                    <div className="boards-container">
                        <h3><i className="fas fa-columns"></i> Treller Templates</h3>
                        <p>Check out our new templates.. </p>
                        <ul className="flex">
                            {templates.map(template => {
                                return (
                                    <li className="template-img" style={{ backgroundImage: `url(${template.smallImg})` }}
                                        key={template.name} onClick={() => this.addBoardWithTemplate(template.largImg)}>
                                        <span>Template</span>
                                        <h3 className="template-name">{template.name}</h3>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div className="user-boards-container">
                        <div className="boards-container">
                            <h3><i className="far fa-star"></i> Starred Boards</h3>
                            {favBoards ? <ul className="starred-boards flex">
                                {favBoards.map(board => {
                                    return (
                                        <li key={board._id} className="board-link flex column space-between"
                                            style={{ backgroundColor: board.style.backgroundColor ? board.style.backgroundColor : ''
                                            , backgroundImage: board.style.backgroundImg ? `url(${board.style.backgroundImg})`: '' }}>
                                            <Link to={`/treller/board/${board._id}`}>{board.title}</Link>
                                            <i style={{ color: "#f2d600" }} className="far fa-star"></i>
                                            <div className="flex flex-end">
                                                {board.members.map(member => {
                                                    return (
                                                        <Avatar name={member.fullName} size={20} round={true} key={member._id} />
                                                    )
                                                })}
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                                : <p>You don't have starred boards yet...</p>}
                        </div>
                        <div className="boards-container">
                            <h3><i className="fab fa-trello"></i> Your Boards</h3>
                            {(user.boardsMember && user.boardsMember.length > 0) &&
                                <ul className="other-boards flex">
                                    {user.boardsMember.map(board => {
                                        if (!board.style) {
                                            return;
                                        } else {
                                            return (
                                                <li key={board._id} className="board-link flex column space-between"
                                                    style={{ backgroundColor: board.style.backgroundColor ? board.style.backgroundColor : '',
                                                     backgroundImage:  board.style.backgroundImg ? `url(${board.style.backgroundImg})`: '' }}>
                                                    <Link to={`/treller/board/${board._id}`}>{board.title}</Link>
                                                    <div className="flex flex-end">
                                                        {board.members.map(member => {
                                                            return (
                                                                <Avatar name={member.fullName} size={20} round={true} key={member._id} />
                                                            )
                                                        })}
                                                    </div>
                                                </li>
                                            )
                                        }

                                    })}
                                </ul>}
                        </div>
                    </div>
                </section>}
            </section>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.userReducer.loggedInUser,
        // card: state.cardReducer.currCard,
        // board: state.boardReducer.currBoard
    }
}
const mapDispatchToProps = {
    getLoggedInUser,
    addBoard
}
export const Boards = connect(mapStateToProps, mapDispatchToProps)(_Boards)