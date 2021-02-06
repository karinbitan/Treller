import { useEffect, useState } from 'react';
import Avatar from 'react-avatar';

import './CardOptions.scss';


export function CardOptions(props) {
    const [checklist, newChecklist] = useState({title: ''});
    const [date, setDate] = useState(props.card.dueDate);

    useEffect(() => {
        console.log(checklist);
    })

    const closePopUp = () => {
        props.closePopUp();
    }

    const addMember = (ev, val) => {
        ev.preventDefault();
        props.func(val);
    }

    // const handleChange = (ev) => {
    //     ev.preventDefault()
    //     const { name, value } = ev.target;
    //     newChecklist(value)
    //     console.log(checklist)
    // }

    const addCheklist = (ev) => {
        // ev.preventDefault();
        // props.func(checklist);
        // newChecklist({title: ''});
        console.log('submit')
    }


    // const func = (ev, val) => {
    //     props.func(ev, val);
    // }

    // FIX THE MESS!!! BOTH LABELS AND COVERS //
    const { type, card, board } = props;
    // const pic1 = { picture: 'pic1' };
    // const pic2 = { picture: 'pic2' };
    // const pic3 = { picture: 'pic3' };
    // const pic4 = { picture: 'pic4' };
    // const pic5 = { picture: 'pic5' };
    // const pic6 = { picture: 'pic6' };
    // const pic7 = { picture: 'pic7' };  

    return (
        <div className="card-options">
            <button className="close-btn" onClick={closePopUp}><i className="fas fa-times"></i></button>
            {type === 'member' && <div className="members-container">
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
                    <li className="cover green" onClick={() => props.func('green')}></li>
                    <li className="cover yellow" onClick={() => props.func('yellow')}></li>
                    <li className="cover orange" onClick={() => props.func('orange')}></li>
                    <li className="cover red" onClick={() => props.func('red')}></li>
                    <li className="cover purple" onClick={() => props.func('purple')}></li>
                    <li className="cover blue" onClick={() => props.func('blue')}></li>
                    <li className="cover pink" onClick={() => props.func('pink')}></li>
                </ul>
                {/* <span>Pictures</span>
                <ul className="flex wrap justify-center">
                    <li className="cover pic1" onClick={() => props.func(pic1)}></li>
                    <li className="cover pic2" onClick={() => props.func(pic2)}></li>
                    <li className="cover pic3" onClick={() => props.func(pic3)}></li>
                    <li className="cover pic4" onClick={() => props.func(pic4)}></li>
                    <li className="cover pic5" onClick={() => props.func(pic5)}></li>
                    <li className="cover pic6" onClick={() => props.func(pic6)}></li>
                    <li className="cover pic7" onClick={() => props.func(pic7)}></li>
                </ul> */}
                <span>Add picture..</span>
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
                        onChange={(ev) => newChecklist({[ev.target.name]: ev.target.value})} />
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