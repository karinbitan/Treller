import { boardService } from './../../services/boardService.js';
import { Component } from 'react';

import './AddList.scss';

export class AddList extends Component {

    state = {
        listToEdit: null,
        showingAddListForm: false
    }

    componentDidMount() {
        const listToEdit = boardService.getEmptyList();
        this.setState({ listToEdit });
    }

    handleChangeList = ({ target }) => {
        const field = target.name;
        const value = target.value;
        this.setState(prevState => ({ listToEdit: { ...prevState.listToEdit, [field]: value } }));
    }


    toggleListForm = (ev) => {
        ev.stopPropagation();
        this.setState({ showingAddListForm: !this.state.showingAddListForm })
    }

    onAddList = (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        const { listToEdit } = this.state;
        this.props.onAddList(listToEdit);
        this.setState({ showingAddListForm: false });
        this.setState(({ listToEdit: { ...this.state.listToEdit, title: '' } }));
    }

    render() {
        const { listToEdit, showingAddListForm } = this.state;
        return (
            <section className="add-container">
                {!showingAddListForm ? <div className="add-btn" onClick={this.toggleListForm}><i className="fas fa-plus"></i> Add another list</div>
                    : <form onSubmit={this.onAddList} className="add-list-form">
                        <input type="text" className="add-form" name="title"
                            value={listToEdit.title} onChange={this.handleChangeList}
                            placeholder="Enter a title for this card" onBlur={this.toggleListForm} />
                        <br />
                        <button className="add-form-btn">Add list</button>
                        <button className="exit-btn" onClick={this.toggleListForm}><i className="fas fa-times"></i></button>
                    </form>}
            </section>
        )
    }
}

