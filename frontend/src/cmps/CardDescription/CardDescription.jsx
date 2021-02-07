import { useEffect, useState } from 'react';
import './CardDescription.scss';

export function CardDescription(props) {
    const [description, setDescription] = useState(props.description);
    const [isDescriptionFormShow, toggleDescriptionForm] = useState(false)
    const [descriptionFormType, changeDescriptionForm] = useState('fake')

    // useEffect(() => {
    // })

    const updateDescription = (ev) => {
        ev.preventDefault();
        props.onUpdateDescription(description);
        setDescription(description);
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
                        onClick={() => toggleDescriptionForm(true),
                            () => changeDescriptionForm('textarea')}>
                        Edit
                        </button>}
            </div>
            <form className="description-form"
                onSubmit={(ev) => updateDescription(ev)}>
                <textarea
                    onClick={() => toggleDescriptionForm(true),
                        () => changeDescriptionForm('textarea')}
                    onBlur={() => toggleDescriptionForm(false)}
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
                            onClick={() => toggleDescriptionForm(false), () => changeDescriptionForm('fake')}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>}
            </form>
        </section>
    )
}

