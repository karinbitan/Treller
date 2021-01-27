import { useState } from 'react'
import Avatar from 'react-avatar';

import './CardOptions.scss';


export function CardOptions(props) {
    const [todo, newTodo] = useState('');
    const [date, setDate] = useState('');

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
        const green = { title: '', color: 'green' };
        const yellow = { title: '', color: 'yellow' };
        const orange = { title: '', color: 'orange' };
        const red = { title: '', color: 'red' };
        const purple = { title: '', color: 'purple' };
        const blue = { title: '', color: 'blue' };
        return (
            <div className="labels-container">
                <p className="headline-option">{props.type}</p>
                <div className="labels">
                    <ul>
                        <li className="label green" onClick={() => props.func(green)}><button><i className="fas fa-pen"></i></button></li>
                        <li className="label yellow" onClick={() => props.func(yellow)}><button><i className="fas fa-pen"></i></button></li>
                        <li className="label orange" onClick={() => props.func(orange)}><button><i className="fas fa-pen"></i></button></li>
                        <li className="label red" onClick={() => props.func(red)}><button><i className="fas fa-pen"></i></button></li>
                        <li className="label purple" onClick={() => props.func(purple)}><button><i className="fas fa-pen"></i></button></li>
                        <li className="label blue" onClick={() => props.func(blue)}><button><i className="fas fa-pen"></i></button></li>
                    </ul>
                </div>
                {/* <div className="edit">
                    <p>Change labels</p>
                    <span>Name:</span>
                    <input type="text" />
                </div> */}
            </div>
        )
    }

    function CheckList(props) {
        // How to send form info?????
        return (
            <div>
                <p className="headline-option">{props.type}</p>
                <span>Add Todo:</span>
                <form onSubmit={(ev) => props.func(ev, todo)}>
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
                    <input type="date" value={date} name="dueDate" onChange={ev => setDate(ev.target.value)} />
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