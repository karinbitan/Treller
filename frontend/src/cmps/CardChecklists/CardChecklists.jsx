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
        props.onAddTodo(checklistIdx, todo);
        setTodo({ title: '', isDone: false });
        toggleAddTodoForm(false);
    }

    const deleteTodo = (checklistIdx, todo) => {
        props.onDeleteTodo(checklistIdx, todo._id);;
    }

    const handleCheckChecklist = ({ target }, todo, checklistIdx, todoIdx) => {
        if (target.checked) {
            todo.isDone = true;
        } else {
            todo.isDone = false
        }
        props.onHandleCheckChecklist(todo, checklistIdx, todoIdx);
    }


    const showTodoDeleteBtn = (ev, idx) => {
        ev.stopPropagation();
        toggleDeleteBtn(true);
        setCurrTodo(idx);
    }

    const hideTodoDeleteBtn = (ev, idx) => {
        ev.stopPropagation();
        toggleDeleteBtn(false);
        setCurrTodo(idx);
    }


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
                                {checklist.todos.map((todo, todoIdx) => {
                                    return <li className="todo flex space-between" key={todoIdx}
                                        onMouseEnter={(ev) => showTodoDeleteBtn(ev, todoIdx)}
                                        onMouseLeave={(ev) => hideTodoDeleteBtn(ev, todoIdx)}>
                                        <input type="checkbox" id={`todo${todoIdx}`}
                                            name="isDone"
                                            onChange={ev => handleCheckChecklist(ev, todo, checklistIdx, todoIdx)}
                                            checked={todo.isDone} />
                                        <label htmlFor={`todo${todoIdx}`} style={{ textDecoration: todo.isDone ? 'line-through' : 'none' }}>
                                            {todo.title}
                                        </label>
                                        <button onClick={() => deleteTodo(checklistIdx, todo)} className="delete-todo"
                                            style={{ display: isDeleteBtnShow && currTodoIdx === todoIdx ? 'block' : 'none' }}>
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
                                        <button className="exit-btn" type="button" onClick={() => toggleAddTodoForm(false)}>
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

