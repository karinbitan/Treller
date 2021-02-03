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

export class _Boards extends Component {
    async componentDidMount() {
        await this.props.getLoggedInUser();
    }

    addBoardWithTemplate = async (img) => {
        let emptyBoard = boardService.getEmptyBoard();
        emptyBoard.style.backgroundColor = {
            app: '',
            header: 'rgba(0,0,0,.32)'
        };
        emptyBoard.style.backgroundImage = img;
        await this.props.addBoard(emptyBoard);
    }

    render() {
        const { user } = this.props;
        const templates = [
            { name: 'Nature', smallImg: Template1, largImg: "https://res.cloudinary.com/druhd0ddz/image/upload/v1612278509/treller/bgc-large1_kxtkq8.jpg" },
            { name: 'Relax', smallImg: Template2, largImg: "https://res.cloudinary.com/druhd0ddz/image/upload/v1612278509/treller/bgc-large2_zr62xq.jpg" },
            { name: 'Work', smallImg: Template3, largImg: "https://res.cloudinary.com/druhd0ddz/image/upload/v1612278509/treller/bgc-large3_dq1hat.jpg" },
            { name: 'Animals', smallImg: Template4, largImg: "https://res.cloudinary.com/druhd0ddz/image/upload/v1612278509/treller/bgc-large4_b6g9p0.jpg" }
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
                {user && <section className="boards">
                    <MainHeader isUserPage={true} user={user} />
                    <h2>Check out our popular templates..</h2>
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
                    <div className="user-boards-container">
                        <h3>Starred Boards</h3>
                        {favBoards ? <ul className="starred-boards">
                            {favBoards.map(board => {
                                return (
                                    <li key={board._id} className="board-link"
                                        style={{ backgroundColor: board.style.backgroundColor.header }}>
                                        <Link to={`/treller/board/${board._id}`}>{board.title}</Link>
                                        <i style={{ color: "#f2d600" }} className="far fa-star"></i>
                                    </li>
                                )
                            })}
                        </ul>
                            : <p>You don't have starred boards yet...</p>}
                        <h3>Your Boards</h3>
                        {(user.boardsMember && user.boardsMember.length > 0) &&
                            <ul className="other-boards">
                                {user.boardsMember.map(board => {
                                    if (!board.style) {
                                        return;
                                    } else {
                                        return (
                                            <li key={board._id} className="board-link"
                                                style={{ backgroundColor: board.style.backgroundColor ? board.style.backgroundColor.header : '' }}>
                                                <Link to={`/treller/board/${board._id}`}>{board.title}</Link>
                                            </li>
                                        )
                                    }

                                })}
                            </ul>}
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