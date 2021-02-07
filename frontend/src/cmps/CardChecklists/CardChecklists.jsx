import { useEffect, useState } from 'react';
import './CardChecklists.scss';

export function CardChecklists(props) {
    const [todo, setTodo] = useState({title: '', isDone: false});
    const [deleteBtnShow, toggleDeleteBtn] = useState(false);
    const [currTodoIdx, setCurrTodo] = useState('')

    // useEffect(() => {

    // })

    // const handleChange = async ({ target }) => {
    //     const field = target.name;
    //     const value = target.value;

    // }

    const addTodo = (ev) =>{
        ev.preventDefault();
        props.onAddTodo(todo);
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
        <section>
                <div className="card-checklists">
                    <div className="checklist-container">
                        {props.checklists.map((checklist, idx) => {
                            return (<div key={idx}>
                                <div className="headline flex align-center space-between">
                                    <i className="fas fa-tasks icon"></i><h3>
                                        {checklist.title}
                                    </h3>
                                    <button className="card-details-btn">Delete</button>
                                </div>
                                {checklist.todos && checklist.todos.length > 0 && <ul>
                                    {checklist.todos.map((todo, idx) => {
                                        return <li className="todo flex space-between" key={idx}
                                            onMouseEnter={() => toggleDeleteBtn(true), setCurrTodo(idx)}
                                            onMouseLeave={() => toggleDeleteBtn(false), setCurrTodo(idx)}>
                                            <input type="checkbox" id={`todo${idx}`}
                                            name="isDone"
                                                onChange={ev => handleCheckChecklist(ev, todo, idx)}
                                                checked={todo.isDone} />
                                            <label htmlFor={`todo${idx}`} style={{ textDecoration: todo.isDone ? 'line-through' : 'none' }}>
                                                {todo.title}
                                            </label>
                                            <button onClick={() => this.deleteTodo(idx)} className="delete-todo"
                                                style={{ display: deleteBtnShow && currTodoIdx === idx ? 'block' : 'none' }}>
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </li>
                                    })}
                                </ul>}
                                <button className="card-details-btn">Add Todo</button>
                                <form onSubmit={addTodo}>
                                    <textarea name="title" value={todo} 
                                    onChange={ev => setTodo({...todo, [ev.target.name]: ev.target.value})}></textarea>
                                    <button>Add</button>
                                </form>
                            </div>)
                        })}
                    </div>
                </div>
        </section>
    )
}

