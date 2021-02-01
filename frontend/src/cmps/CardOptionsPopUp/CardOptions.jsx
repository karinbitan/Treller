import { useEffect, useState } from 'react'
import Avatar from 'react-avatar';

import './CardOptions.scss';


export function CardOptions(props) {
    const [todo, newTodo] = useState('');
    const [date, setDate] = useState(props.card.dueDate);

    useEffect(() => {
        console.log('something');
    })

    function Members({ type, board }) {
        console.log(board.members)
        return (
            <div className="members-container">
                <p className="headline-option">{type}</p>
                <h4>Board Members</h4>
                {board.members && <div>
                    {board.members.map(member => {
                        return (
                            <div onClick={(ev) => addMember(ev, member)} className="member flex" key={member._id}>
                                <Avatar className="avatar-logo" name={member.fullName} round={true}
                                    size={30} />
                                {member.fullName}
                            </div>)
                    })}
                </div>}
            </div>
        )
    }

    function Labels(props) {
        const green = { color: 'green' };
        const yellow = { color: 'yellow' };
        const orange = { color: 'orange' };
        const red = { color: 'red' };
        const purple = { color: 'purple' };
        const blue = { color: 'blue' };
        return (
            <div className="labels-container">
                <p className="headline-option">{props.type}</p>
                <div className="labels">
                    <ul className="flex column align-center">
                        <li className="label green" onClick={(ev) => props.addLabel(ev, green)}></li>
                        <li className="label yellow" onClick={(ev) => props.addLabel(ev, yellow)}></li>
                        <li className="label orange" onClick={(ev) => props.addLabel(ev, orange)}></li>
                        <li className="label red" onClick={(ev) => props.addLabel(ev, red)}></li>
                        <li className="label purple" onClick={(ev) => props.addLabel(ev, purple)}></li>
                        <li className="label blue" onClick={(ev) => props.addLabel(ev, blue)}></li>
                    </ul>
                </div>
            </div>
        )
    }

    function CheckList(props) {
        return (
            <div>
                <p className="headline-option">{props.type}</p>
                <h4>Add Todo:</h4>
                <form onSubmit={(ev) => props.addTodo(ev, { title: todo, isDone: false })}>
                    <input type="text" name="todo" value={todo} onChange={ev => newTodo(ev.target.value)} />
                    <br />
                    <button>Add</button>
                </form>
            </div>
        )
    }

    function DueDate(props) { /* */
        return (
            <div onSubmit={ev => props.addDueDate(ev, date)}>
                <p className="headline-option">{props.type}</p>
                <form>
                    <input type="datetime-local" value={date} name="dueDate" onChange={ev => setDate(ev.target.value)} />
                    <br />
                    <button>Add</button>
                </form>
            </div>
        )
    }

    const closePopUp = () => {
        props.closePopUp();
    }

    const addMember = (ev, val) => {
        props.func(ev, val)
    }

    const addLabel = (ev, val) => {
        props.func(ev, val);
    }

    const addTodo = (ev, val) => {
        ev.preventDefault();
        props.func(ev, val);
        newTodo('');
    }

    const addDueDate = (ev, val) => {
        props.func(ev, val);
    }

    // const func = (ev, val) => {
    //     props.func(ev, val);
    // }

    const { type, card, board } = props;
    const DynamicCmp = (props) => {
        switch (props.type) {
            case 'Members':
                return <Members {...props} />
            case 'Labels':
                return <Labels {...props} />
            case 'CheckList':
                return <CheckList {...props} />
            case 'DueDate':
                return <DueDate {...props} />
            // case 'Cover':
            //     return <Cover {...props} />
            // case 'WelcomeBack':
            //     return <WelcomeBack {...props} />
            // case 'WelcomeBack':
            //     return <WelcomeBack {...props} />

            default:
                return <h1>Something went wrong</h1>
        }
    }
    // const DynamicCmp = dynamicMap['Hello']

    return (
        <div className="card-options">
            <button className="close-btn" onClick={closePopUp}><i className="fas fa-times"></i></button>
            <DynamicCmp type={type} card={card} addLabel={addLabel} addTodo={addTodo}
                addDueDate={addDueDate} board={board} />
        </div>)
}