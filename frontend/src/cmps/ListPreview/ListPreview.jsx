import { Component } from 'react'
import { Draggable } from 'react-beautiful-dnd';
// import { connect } from 'react-redux';
// import { getBoardById } from '../../store/actions/boardActions';
// import { addCard } from '../../store/actions/cardActions';

import { AddCard } from '../AddCard/AddCard';
import { CardPreview } from '../CardPreview';


import './ListPreview.scss'

// const reorder = (list, startIndex, endIndex) => {
//     const result = Array.from(list);
//     const [removed] = result.splice(startIndex, 1);
//     result.splice(endIndex, 0, removed);

//     return result;
// };

// //
// const getListStyle = isDraggingOver => ({
//     background: isDraggingOver ? '#6a7eb4' : '#ebecf0',
//     // display: 'flex',
// });

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',

    // change background colour if dragging
    background: isDragging ? '' : '#ebecf0',

    // styles we need to apply on draggables
    ...draggableStyle,
});
//

export class ListPreview extends Component {

    state = {
        listToEdit: null,
        listActionOpen: false
    }

    componentDidMount() {
        const listToEdit = this.props.list;
        this.setState({ listToEdit });
    }

    handleChange = ({ target }) => {
        const field = target.name;
        const value = target.value;
        this.setState(prevState => ({ listToEdit: { ...prevState.listToEdit, [field]: value } }));
    }

    onEnterPress = (ev) => {
        if (ev.keyCode == 13 && ev.shiftKey == false) {
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

    toggleListOptionModel = (ev) => {
        ev.stopPropagation();
        this.setState({ listActionOpen: !this.state.listActionOpen })
    }

    closeListOptionModel = (ev) => {
        ev.stopPropagation();
        this.setState({ listActionOpen: false })
    }

    copyList() {

    }

    onDeleteList = () => {
        const { list } = this.props;
        this.props.onDeleteList(list._id);
        this.setState({ listActionOpen: false });
    }

    onDeleteCard = (cardId) => {
        this.props.onDeleteCard(this.props.idx, cardId);
    }

    onUpdateCard = (card) => {
        this.props.onUpdateCard(card);
    }

    render() {
        const { list, idx, board } = this.props;
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
                    <p>List Actions</p>
                    <ul>
                        <li onClick={this.copyList}>Copy List</li>
                        <li onClick={this.onDeleteList}>Delete List</li>
                    </ul>
                    <button className="close-btn" onClick={this.closeListOptionModel}>X</button>
                </div>}
                {list.cards && <div className={"card-container" + (isDraggingOver ? " isDraggingOver" : "")}
                    {...provided.droppableProps}
                    ref={innerRef}>
                    {list.cards.map((card, idx) => {
                        if (card) {
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
                                            <CardPreview card={card} idx={idx} key={card._id} onDeleteCard={this.onDeleteCard} onUpdateCard={this.onUpdateCard} />
                                        </div>
                                    )}
                                </Draggable>
                            )
                        }
                    })}
                    {provided.placeholder}
                </div>}

                {/* <CardList list={list} cards={list.cards} idx={idx} key={list._id} /> */}
                <AddCard listIdx={idx} boardId={board._id} />
            </section >
        )
    }
}