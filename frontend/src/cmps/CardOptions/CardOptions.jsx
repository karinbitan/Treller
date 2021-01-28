import { useEffect, useState } from 'react'
import Avatar from 'react-avatar';

import './CardOptions.scss';


export function CardOptions(props) {
    const [todo, newTodo] = useState('');
    const [date, setDate] = useState(props.card.dueDate);

    useEffect(() => {
        // setDate(props.card.dueDate);
        console.log(date)
    })

    function Members(props) {
        return (
            <div>
                <p className="headline-option">{props.type}</p>
                {props.card.members && <div>
                    {props.card.members.map(member => {
                        return <Avatar name={member} />
                    })}
                </div>}
            </div>
        )
    }

    function Labels(props) {
        const green = { color: 'green' };
        const yellow = { color: 'yellow' };
        const orange = { color: 'orange' };
        const red = {color: 'red' };
        const purple = { color: 'purple' };
        const blue = { color: 'blue' };
        return (
            <div className="labels-container">
                <p className="headline-option">{props.type}</p>
                <div className="labels">
                    <ul className="flex column align-center">
                        <li className="label green" onClick={() => props.func(green)}></li>
                        <li className="label yellow" onClick={() => props.func(yellow)}></li>
                        <li className="label orange" onClick={() => props.func(orange)}></li>
                        <li className="label red" onClick={() => props.func(red)}></li>
                        <li className="label purple" onClick={() => props.func(purple)}></li>
                        <li className="label blue" onClick={() => props.func(blue)}></li>
                    </ul>
                </div>
            </div>
        )
    }

    function CheckList(props) {
        return (
            <div>
                <p className="headline-option">{props.type}</p>
                <span>Add Todo:</span>
                <form onSubmit={(ev) => props.func(ev, { title: todo, isDone: false })}>
                    <input type="text" name="todo" value={todo} onChange={ev => newTodo(ev.target.value)} />
                    <br />
                    <button>Add</button>
                </form>
            </div>
        )
    }

    function DueDate(props) { /* */
        return (
            <div onSubmit={ev => props.func(ev, date)}>
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

    const func = (ev, val) => {
        debugger
        props.func(ev, val)
    }

    const { type, card } = props;
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
            <DynamicCmp type={type} card={card} func={func} />
        </div>)
}