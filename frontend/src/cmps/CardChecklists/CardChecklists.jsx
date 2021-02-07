import { useEffect, useState } from 'react';
import './CardChecklists.scss';

export function CardChecklists(props) {
    const [todo, setTodo] = useState({ title: '', isDone: false });
    const [isDeleteBtnShow, toggleDeleteBtn] = useState(false);
    const [isAddTodoFormShow, toggleAddTodoForm] = useState(false);
    const [currTodoIdx, setCurrTodo] = useState('')

    useEffect(() => {
        console.log(currTodoIdx)
        console.log(isDeleteBtnShow)
    })

    const addTodo = (ev, checklistIdx) => {
        ev.preventDefault();
        debugger
        props.onAddTodo(checklistIdx, todo);
    }

    const handleCheckChecklist = ({ target }, todo, idx) => {
        const value = null;
        // if (target.checked) {
        //     value = true;
        // } else {
        //     value = false
        // }
        // setTodo(todo => ({...todo, [target.name]: value}));
        // props.handleCheckChecklist(todo)
    }


    // showTodoDeleteBtn = (ev, idx) => {
    //     ev.stopPropagation();
    //     this.setState({ isTodoDeleteBtnShow: true, currTodoIdx: idx })
    // }

    // hideTodoDeleteBtn = (ev, idx) => {
    //     ev.stopPropagation();
    //     this.setState({ isTodoDeleteBtnShow: false, currTodoIdx: idx })
    // }


    return (
        <section className="card-checklists">
            <div className="checklist-container">
                {props.checklists.map((checklist, checklistIdx) => {
                    return (
                        <div key={checklistIdx}>
                            <div className="headline flex align-center space-between">
                                <i className="fas fa-tasks icon"></i><h3>
                                    {checklist.title}
                                </h3>
                                <button className="card-details-btn">Delete</button>
                            </div>
                            {checklist.todos && checklist.todos.length > 0 && <ul>
                                {checklist.todos.map((todo, idx) => {
                                    return <li className="todo flex space-between" key={idx}
                                        onMouseEnter={() => toggleDeleteBtn(true), () => setCurrTodo(idx)}
                                        onMouseLeave={() => toggleDeleteBtn(false), () => setCurrTodo(idx)}>
                                        <input type="checkbox" id={`todo${idx}`}
                                            name="isDone"
                                            onChange={ev => handleCheckChecklist(ev, todo, idx)}
                                            checked={todo.isDone} />
                                        <label htmlFor={`todo${idx}`} style={{ textDecoration: todo.isDone ? 'line-through' : 'none' }}>
                                            {todo.title}
                                        </label>
                                        <button onClick={() => this.deleteTodo(idx)} className="delete-todo"
                                            style={{ display: isDeleteBtnShow && currTodoIdx === idx ? 'block' : 'none' }}>
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </li>
                                })}
                            </ul>}
                            {!isAddTodoFormShow ? <button className="card-details-btn flex open-form" onClick={toggleAddTodoForm}>Add Todo</button>
                                : <form onSubmit={ev => addTodo(ev, checklistIdx)} className="add-todo">
                                    <textarea name="title" value={todo.title}
                                        onChange={ev => setTodo({ ...todo, [ev.target.name]: ev.target.value })}></textarea>
                                    <div className="flex">
                                        <button className="add-form-btn">Add</button>
                                        <button className="exit-btn">
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                </form>}
                        </div>)
                })}
            </div>
        </section>
    )
}

