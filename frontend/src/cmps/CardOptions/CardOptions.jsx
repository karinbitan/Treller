import { useState } from 'react';
import Avatar from 'react-avatar';

import './CardOptions.scss';


export function CardOptions(props) {
    const [checklist, newChecklist] = useState({ title: '', todos: [] });
    const [date, setDate] = useState(props.card.dueDate);

    const closePopUp = () => {
        props.closePopUp();
    }

    const { type, board } = props;

    return (
        <div className="card-options">
            <button className="close-btn" onClick={closePopUp}><i className="fas fa-times"></i></button>
            {type === 'members' && <div className="members-container">
                <p className="headline-option">{type}</p>
                <h4>Board Members</h4>
                {board.members && <div>
                    {board.members.map(member => {
                        return (
                            <div onClick={() => props.func(member)} className="member flex" key={member._id}>
                                <Avatar className="avatar-logo" name={member.fullName} round={true}
                                    size={30} />
                                {member.fullName}
                            </div>)
                    })}
                </div>}
            </div>}
            {type === 'cover' && <div className="covers">
                <p className="headline-option">{props.type}</p>
                <span>Colors</span>
                <ul className="flex wrap justify-center">
                    <li className="cover color green" onClick={() => props.func({ color: 'green' })}></li>
                    <li className="cover color yellow" onClick={() => props.func({ color: 'yellow' })}></li>
                    <li className="cover color orange" onClick={() => props.func({ color: 'orange' })}></li>
                    <li className="cover color red" onClick={() => props.func({ color: 'red' })}></li>
                    <li className="cover color purple" onClick={() => props.func({ color: 'purple' })}></li>
                    <li className="cover color blue" onClick={() => props.func({ color: 'blue' })}></li>
                    <li className="cover color pink" onClick={() => props.func({ color: 'pink' })}></li>
                </ul>
                <span>Pictures</span>
                <ul className="flex wrap justify-center">
                    <li className="cover pic pic1" onClick={() => props.func({ picture: 'pic1' })}></li>
                    <li className="cover pic pic2" onClick={() => props.func({ picture: 'pic2' })}></li>
                    <li className="cover pic pic3" onClick={() => props.func({ picture: 'pic3' })}></li>
                    <li className="cover pic pic4" onClick={() => props.func({ picture: 'pic4' })}></li>
                    <li className="cover pic pic5" onClick={() => props.func({ picture: 'pic5' })}></li>
                    <li className="cover pic pic6" onClick={() => props.func({ picture: 'pic6' })}></li>
                    <li className="cover pic pic7" onClick={() => props.func({ picture: 'pic7' })}></li>
                </ul>
            </div>}
            {type === 'labels' && <div className="labels-container">
                <p className="headline-option">{props.type}</p>
                <div className="labels">
                    <ul className="flex column align-center">
                        <li className="label green" onClick={() => props.func('green')}></li>
                        <li className="label yellow" onClick={() => props.func('yellow')}></li>
                        <li className="label orange" onClick={() => props.func('orange')}></li>
                        <li className="label red" onClick={() => props.func('red')}></li>
                        <li className="label purple" onClick={() => props.func('purple')}></li>
                        <li className="label blue" onClick={() => props.func('blue')}></li>
                    </ul>
                </div>
            </div>}
            {type === 'checklists' && <div className="checklists-container">
                <p className="headline-option">{props.type}</p>
                <h4>Add Checklist:</h4>
                <form onSubmit={(ev) => props.func(ev, checklist)}>
                    <input type="text" name="title" value={checklist.title}
                        onChange={(ev) => newChecklist({ ...checklist, [ev.target.name]: ev.target.value })} />
                    <br />
                    <button>Add</button>
                </form>
            </div>}
            {type === 'dueDate' && <div className="due-date-form">
                <p className="headline-option">{props.type}</p>
                <form onSubmit={ev => props.addDueDate(ev, date)}>
                    <input type="datetime-local" value={date} name="dueDate"
                        onChange={(ev) => setDate(ev.target.value)} />
                    <br />
                    <button>Add</button>
                </form>
            </div>}
        </div>)
}