import { cardService } from '../../services/cardService';
import { useEffect, useRef, useState } from 'react';

import './AddCard.scss';

export function AddCard(props) {
    const [cardTitleToEdit, newCardTitle] = useState('');
    const [isFormShow, toggleForm] = useState(false);
    const node = useRef(); 

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

    const onAddCard = (ev) => {
        ev.preventDefault();
        let emptyCard = cardService.getEmptyCard();
        emptyCard.title = cardTitleToEdit;
        props.addCard(emptyCard);
        newCardTitle('');
        toggleForm(false);
    }

    return (
        <section ref={node} className="add-card-container">
            {!isFormShow ? <div onClick={() => toggleForm(true)} className="add-card"><i className="fas fa-plus"></i> Add a card</div>
                : <form onSubmit={(ev) => onAddCard(ev)} className="add-card-form">
                    <input type="text" className="add-form" name="title"
                        value={cardTitleToEdit.title} onChange={(ev) => newCardTitle(ev.target.value)}
                        placeholder="Enter a title for this card" />
                    <br />
                    <div className="flex">
                        <button className="add-form-btn">Add card</button>
                        <button className="exit-btn" type="button" onClick={() => toggleForm(false)}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                </form>}
        </section>
    )
}