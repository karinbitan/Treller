import { useState } from 'react';
import Avatar from 'react-avatar';

import './CardOptions.scss';


export function CardOptions(props) {
    const [checklist, newChecklist] = useState({ title: '', todos: [] });
    const [date, setDate] = useState(props.card.dueDate);
    const { type, board, card } = props;

    const closePopUp = () => {
        props.closePopUp();
    }

    const isMember = (userId) => {
        const isMember = card.members.some(member => {
            return member._id === userId;
        })
        return isMember;
    }

    const addMember = (member)=>{
        if(isMember(member._id)) return;
        props.func(member);
    }

    return (
        <div className="card-options">
            <button className="close-btn" onClick={closePopUp}><i className="fas fa-times"></i></button>
            {type === 'Cover' && <div className="covers">
                <p className="headline-option">{props.type}</p>
                <p>Colors</p>
                <ul className="flex wrap justify-center">
                    <li className="cover color green" onClick={() => props.func({ color: 'green' })}></li>
                    <li className="cover color yellow" onClick={() => props.func({ color: 'yellow' })}></li>
                    <li className="cover color orange" onClick={() => props.func({ color: 'orange' })}></li>
                    <li className="cover color red" onClick={() => props.func({ color: 'red' })}></li>
                    <li className="cover color purple" onClick={() => props.func({ color: 'purple' })}></li>
                    <li className="cover color blue" onClick={() => props.func({ color: 'blue' })}></li>
                    <li className="cover color pink" onClick={() => props.func({ color: 'pink' })}></li>
                </ul>
                <p>Pictures</p>
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
            {type === 'Members' && <div className="members-container">
                <p className="headline-option">{type}</p>
                <p className="add-members-info">Add members to card:</p>
                {board.members && <ul>
                    {board.members.map(member => {
                        return (
                            <li onClick={() => addMember(member)}
                                className={`member flex align-center ${isMember(member._id) ? 'already-member' : ''}`} key={member._id}
                                title={`${isMember(member._id) ? 'This user is already a member in this card' : ''}`}>
                                <Avatar className="avatar-logo" name={member.fullName} round={true}
                                    size={30} />
                                {member.fullName}
                            </li>)
                    })}
                </ul>}
            </div>}
            {type === 'Labels' && <div className="labels-container">
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
            {type === 'Checklists' && <div className="checklists-container">
                <p className="headline-option">{props.type}</p>
                <form onSubmit={(ev) => props.func(ev, checklist)}>
                    <input type="text" name="title" value={checklist.title} className="checklist-add-input"
                        onChange={(ev) => newChecklist({ ...checklist, [ev.target.name]: ev.target.value })}
                        placeholder="Add Checklist" />
                    <br />
                    <button className="save-btn">Add</button>
                </form>
            </div>}
            {type === 'Due Date' && <div className="due-date-form">
                <p className="headline-option">{props.type}</p>
                <form onSubmit={(ev) => props.func(ev, date)}>
                    <input type="datetime-local" value={date} name="dueDate"
                        onChange={(ev) => setDate(ev.target.value)} />
                    <br />
                    <button className="save-btn">Add</button>
                </form>
            </div>}
        </div>)
}