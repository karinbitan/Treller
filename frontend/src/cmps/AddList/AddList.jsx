import { useEffect, useRef, useState } from 'react';
import { boardService } from './../../services/boardService.js';

import './AddList.scss';

export function AddList(props) {
    const emptyList = boardService.getEmptyList();
    const [listToEdit, setListToEdit] = useState(emptyList);
    const [showingAddListForm, toggleForm] = useState(false);
    const inputRef = useRef()
    const node = useRef();

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    })

    useEffect(() => {
        // add when mounted
        document.addEventListener("mousedown", handleClick);
        // return function to be called when unmounted
        return () => {
          document.removeEventListener("mousedown", handleClick);
        };
      }, []);

      const handleClick = e => {
        if (node.current.contains(e.target)) {
          return;
        }
       toggleForm(false)
      };

    const onAddList = (ev) => {
        ev.preventDefault();
        props.addList(listToEdit);
        toggleForm(false);
        setListToEdit(emptyList)
    }

    return (
        <section ref={node} className="add-container">
            {!showingAddListForm ? <div className="add-btn" onClick={()=>toggleForm(true)}>
                <i className="fas fa-plus"></i> Add another list
                </div>
                : <form onSubmit={(ev) => onAddList(ev)} className="add-list-form">
                    <input type="text" className="add-form" name="title"
                        value={listToEdit.title} ref={inputRef} onChange={(ev) => setListToEdit({ ...listToEdit, [ev.target.name]: ev.target.value })}
                        placeholder="Enter a title for this card" />
                    <br />
                    <button className="add-form-btn">Add list</button>
                    <button type="button" className="exit-btn" onClick={() => toggleForm(false)}><i className="fas fa-times"></i></button>
                </form>}
        </section>

    )
}

