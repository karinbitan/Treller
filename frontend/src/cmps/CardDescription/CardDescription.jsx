import { useState } from 'react';
import './CardDescription.scss';

export function CardDescription(props) {
    const [description, setDescription] = useState(props.description);
    const [isDescriptionFormShow, toggleDescriptionForm] = useState(false)
    const [descriptionFormType, changeDescriptionForm] = useState('fake')

    const onUpdateDescription = (ev) => {
        ev.preventDefault();
        props.updateDescription(description);
        setDescription(description);
        toggleDescriptionForm(false);
        changeDescriptionForm('fake');
    }

    const openDescriptionForm = () =>{
        toggleDescriptionForm(true);
        changeDescriptionForm('textarea');
    }

    const closeDescriptionForm = () =>{
        toggleDescriptionForm(false);
        changeDescriptionForm('fake');
    }

    return (
        <section className="description-container">
            <div className="headline flex align-center">
                <i className="fas fa-align-left icon"></i>
                <h3>Description</h3>
                {(description && !isDescriptionFormShow) &&
                    <button className="card-details-btn"
                        onClick={() => openDescriptionForm()}>
                        Edit
                        </button>}
            </div>
            <form className="description-form"
                onSubmit={(ev) => onUpdateDescription(ev)}>
                <textarea
                    onClick={() => openDescriptionForm()}
                    // onBlur={() => toggleDescriptionForm(false)}
                    className={`description ${description ? 'value' : ''} ${descriptionFormType}`}
                    placeholder="Add more detailed description..."
                    onChange={ev => setDescription(ev.target.value)}
                    value={description}
                    name="description">
                </textarea>
                <br />
                {(descriptionFormType === 'textarea') &&
                    <div className="btn flex justify-start">
                        <button className="add-form-btn">Save</button>
                        <button className="exit-btn"
                            onClick={() => closeDescriptionForm(false)}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>}
            </form>
        </section>
    )
}

