import { Link, withRouter } from 'react-router-dom';
import './MainHeaderOptions.scss';

function Boards(props) {
    if (props.boards && props.boards.length) {
        var favBoards = props.boards.map(board => {
            return board;
        })
            .filter(favBoard => {
                return favBoard.isFavorite === true;
            })
    }
    return (
        <div className="boards">
            <p>{props.type}</p>
            {favBoards && <div className="fav-boards">
                <h5>Starred Boards</h5>
                <ul>
                    {favBoards.map(board => {
                        return <li onClick={props.closePopUp} key={board._id}>
                            <Link to={`/treller/board/${board._id}`}>{board.title}</Link>
                        </li>
                    })}
                </ul>
            </div>}
            {props.boards && <div>
                <h5>Other boards</h5>
                <ul>
                    {props.boards.map(board => {
                        return <li onClick={props.closePopUp} key={board._id}>
                            <Link to={`/treller/board/${board._id}`}>{board.title}</Link>
                        </li>
                    })}
                </ul>
            </div>}
            <span>Create new board...</span>
        </div>
    )
}

function Create(props) {
    return (
        <div className="create-options">
            <p>{props.type}</p>
            <ul>
                <li>Create Board</li>
            </ul>
        </div>
    )
}

function Notifications(props) {
    return (
        <div>
            <p>{props.type}</p>
        </div>
    )
}



function _MainHeaderOptions(props) {

    const closePopUp = () => {
        props.closePopUp();
    }

    const { type, boards } = props;
    const DynamicCmp = (props) => {
        switch (props.type) {
            case 'Boards':
                return <Boards {...props} />
            case 'Create':
                return <Create {...props} />
            case 'Notifications':
                return <Notifications {...props} />
            default:
                return <h1>Something went wrong</h1>
        }
    }
    // const DynamicCmp = dynamicMap['Hello']

    return (
        <div className="main-header-options">
            <button onClick={closePopUp}>X</button>
            <DynamicCmp type={type} boards={boards} closePopUp={closePopUp} />
        </div>)
}

export const MainHeaderOptions = withRouter(_MainHeaderOptions)