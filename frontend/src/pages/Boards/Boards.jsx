import { Component } from 'react';
import { MainHeader } from '../../cmps/MainHeader/MainHeader';
import Template1 from './../../assets/templates/bgc-small1.jpg';
import Template2 from './../../assets/templates/bgc-small2.jpg';
import Template3 from './../../assets/templates/bgc-small3.jpg';
import Template4 from './../../assets/templates/bgc-small4.jpg';

import { connect } from 'react-redux';
import { getLoggedInUser } from '../../store/actions/authActions';
import { addBoard, getBoardForBoardPage } from '../../store/actions/boardActions';
import { Link } from 'react-router-dom';

import './Boards.scss';
import Avatar from 'react-avatar';
import { boardService } from '../../services/boardService';
import { eventBus } from '../../services/eventBusService';

export class _Boards extends Component {

    state = {
        favoriteBoards: [],
        boardsMember: []
    }

    async componentDidMount() {
        await this.props.getLoggedInUser();
        this.getBoardsForDisplay();
        this.getFavBoardsForDisplay();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.user !== this.props.user) {
            this.getBoardsForDisplay();
            this.getFavBoardsForDisplay();
        }
    }

    // Why it stops after add board? //
    addBoard = async () => {
        const boardToAdd = boardService.getEmptyBoard();
        const board = await this.props.addBoard(boardToAdd);
        eventBus.emit('onSetBoard', board._id);
        this.props.history.push(`/treller/board/${board._id}`);
    }

    getBoardsForDisplay = async () => {
        let { user } = this.props;
        if (user.boardsMember || user.boardsMember.length > 0) {
            let boards = await Promise.all(user.boardsMember.map(async (boardId) => {
                return boardId = await this.props.getBoardForBoardPage(boardId);
            }))
            this.setState({ boardsMember: boards })
        }
    }

    getFavBoardsForDisplay = async () => {
        let { user } = this.props;
        if (user.favoriteBoards || user.favoriteBoards.length > 0) {
            let boards = await Promise.all(user.favoriteBoards.map(async (boardId) => {
                return boardId = await this.props.getBoardForBoardPage(boardId);
            }))
            this.setState({ favoriteBoards: boards })
        }
    }

    render() {
        const { user } = this.props;
        const { favoriteBoards, boardsMember } = this.state;
        const templates = [
            {
                name: 'Nature', boardId: "5ff1b13c36eed552e70fec47",
                smallImg: Template1, largImg: "https://res.cloudinary.com/druhd0ddz/image/upload/v1612278509/treller/bgc-large1_kxtkq8.jpg"
            },
            {
                name: 'Animals', boardId: "60040605a5297b5978123a93",
                smallImg: Template2, largImg: "https://res.cloudinary.com/druhd0ddz/image/upload/v1612278509/treller/bgc-large4_b6g9p0.jpg"
            },
            {
                name: 'Work', boardId: "600432fba5297b59781ba1d4",
                smallImg: Template3, largImg: "https://res.cloudinary.com/druhd0ddz/image/upload/v1613425888/treller/bgc-large3_hxzpue.jpg"
            },
            {
                name: 'Relax', boardId: "60197399331a92cde9ce9f7d",
                smallImg: Template4, largImg: "https://res.cloudinary.com/druhd0ddz/image/upload/v1612278509/treller/bgc-large2_zr62xq.jpg"
            }
        ];

        return (
            <section>
                {user && <MainHeader isUserPage={true} user={user} />}
                {user && <section className="boards container">
                    <div className="boards-container">
                        <div className="flex justify-center align-center"><i className="fas fa-columns"></i><h2>Treller Templates</h2></div>
                        <p className="template-info"><span className="bold">Create your own board with our new template.</span>
                            <br /> Manage and monitoring your board, easily with Treller Templates! </p>
                        <ul className="flex justify-center flex-wrap">
                            {templates.map(template => {
                                return (
                                    <Link to={`/treller/board/${template.boardId}`} className="template-img" style={{ backgroundImage: `url(${template.smallImg})` }}
                                        key={template.name}>
                                        <span>Template</span>
                                        <h2 className="template-name">{template.name}</h2>
                                    </Link>
                                )
                            })}
                        </ul>
                    </div>
                    <div className="user-boards-container">
                        {(user.favoriteBoards && user.favoriteBoards.length > 0) && <div className="boards-container">
                            <div className="flex justify-center align-center"><i className="far fa-star"></i><h2>Starred Boards</h2></div>
                            <div className="starred-boards flex justify-center flex-wrap">
                                {favoriteBoards.map(board => {
                                    return (
                                        <Link to={`/treller/board/${board._id}`} key={board._id}
                                            className="board-link flex column space-between"
                                            style={{
                                                backgroundColor: board.style.backgroundColor ? board.style.backgroundColor : ''
                                                , backgroundImage: board.style.backgroundImg ? `url(${board.style.backgroundImg})` : ''
                                            }}>
                                            {board.title}
                                            <div className="flex space-between">
                                                <button className="fav-board"><i style={{ color: "#f2d600" }} className="far fa-star"></i></button>
                                                <div className="flex flex-end">
                                                    {board.members.map(member => {
                                                        return (
                                                            <Avatar name={member.fullName} size={20} round={true} key={member._id} />
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>}
                        <div className="boards-container">
                            <div className="flex justify-center align-center"><i className="fab fa-trello"></i><h2>Your Boards</h2></div>
                            <div className="flex justify-center">
                                {(user.boardsMember && user.boardsMember.length > 0) &&
                                    <div className="other-boards flex justify-center flex-wrap">
                                        {boardsMember.map(board => {
                                            if (!board.style) {
                                                return;
                                            } else {
                                                return (
                                                    <Link to={`/treller/board/${board._id}`} key={board._id}
                                                        className="board-link flex column space-between"
                                                        style={{
                                                            backgroundColor: board.style.backgroundColor ? board.style.backgroundColor : '',
                                                            backgroundImage: board.style.backgroundImg ? `url(${board.style.backgroundImg})` : ''
                                                        }}>
                                                        {board.title}
                                                        <div className="flex flex-end">
                                                            {board.members.map(member => {
                                                                return (
                                                                    <Avatar name={member.fullName} size={20} round={true} key={member._id} />
                                                                )
                                                            })}
                                                        </div>
                                                    </Link>
                                                )
                                            }

                                        })}
                                    </div>}
                                <div className="board-link empty flex justify-center align-center"
                                    onClick={this.addBoard}>
                                    Create new board
                                        </div>
                            </div>
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
    addBoard,
    getBoardForBoardPage
}
export const Boards = connect(mapStateToProps, mapDispatchToProps)(_Boards)