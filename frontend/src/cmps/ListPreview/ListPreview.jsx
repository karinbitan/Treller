import { Component } from 'react'
import { Draggable } from 'react-beautiful-dnd';
import { AddCard } from '../AddCard/AddCard';
import { CardPreview } from '../CardPreview';


import './ListPreview.scss';

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',

    // change background colour if dragging
    background: isDragging ? '' : '#ebecf0',

    // styles we need to apply on draggables
    ...draggableStyle,
});

export class ListPreview extends Component {

    state = {
        listToEdit: null,
        listActionOpen: false
    }

    componentDidMount() {
        const listToEdit = this.props.list;
        this.setState({ listToEdit });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.list !== this.props.list) {
            const listToEdit = this.props.list;
            this.setState({ listToEdit });
        }
    }

    handleChange = ({ target }) => {
        const field = target.name;
        const value = target.value;
        this.setState(prevState => ({ listToEdit: { ...prevState.listToEdit, [field]: value } }));
    }

    onEnterPress = (ev) => {
        if (ev.keyCode === 13 && ev.shiftKey === false) {
            ev.preventDefault();
            this.changeListTitle(ev);
            this.handleChange(ev);
        }
    }

    changeListTitle = (ev) => {
        ev.preventDefault();
        this.props.onUpdateList(this.state.listToEdit);
        this.myTextareaRef.blur();
    }

    deleteList = () => {
        const { list } = this.props;
        this.props.deleteList(list);
        this.setState({ listActionOpen: false });
    }

    // MODALS //
    toggleListOptionModel = (ev) => {
        ev.stopPropagation();
        this.setState({ listActionOpen: !this.state.listActionOpen })
    }

    closeListOptionModel = (ev) => {
        ev.stopPropagation();
        this.setState({ listActionOpen: false })
    }

    // CARD //
    addCard = (card) => {
        const { list, listIdx } = this.props;
        this.props.addCard(list._id, listIdx, card)
    }

    deleteCard = (cardId) => {
        const { listIdx } = this.props;
        this.props.deleteCard(listIdx, cardId);
    }

    updateCardTitle = (cardId, cardTitle) => {
        this.props.updateCardTitle(cardId, cardTitle);
    }

    render() {
        const { list, listIdx } = this.props;
        const { provided, innerRef, isDraggingOver } = this.props;
        const { listToEdit, listActionOpen } = this.state;
        return (
            <section className="list-preview">
                {listToEdit && <form onSubmit={this.changeListTitle} >
                    <textarea ref={el => this.myTextareaRef = el} className="list-title" name="title" value={listToEdit.title}
                        onChange={this.handleChange} onKeyDown={this.onEnterPress}>
                    </textarea>
                </form>}
                <button onClick={this.toggleListOptionModel} className="list-menu-icon"><i className="fas fa-ellipsis-h"></i></button>
                {listActionOpen && <div className="list-actions">
                    <button className="close-btn" onClick={this.closeListOptionModel}><i className="fas fa-times"></i></button>
                    <p>List Actions</p>
                    <ul>
                        <li onClick={this.onDeleteList}>Delete List</li>
                    </ul>
                </div>}
                {(list.cards && list.cards.length > 0) && <div className={"card-container" + (isDraggingOver ? " isDraggingOver" : "")}
                    {...provided.droppableProps}
                    ref={innerRef}>
                    {list.cards.map((card, idx) => {
                        if (card)
                            return (
                                <Draggable draggableId={card._id} key={card._id} index={idx}>
                                    {(provided, snapshot) => (
                                        <div className="card"
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={getItemStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style
                                            )}
                                            ref={provided.innerRef}>
                                            <CardPreview
                                                card={card}
                                                key={card._id}
                                                deleteCard={this.deleteCard}
                                                updateCardTitle={this.updateCardTitle}
                                                addCard={this.addCard} />
                                        </div>
                                    )}
                                </Draggable>
                            )
                    })}
                    {provided.placeholder}
                </div>}
                <AddCard addCard={this.addCard} />
            </section >
        )
    }
}