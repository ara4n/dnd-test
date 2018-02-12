import React, { Component } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { Droppable } from 'react-beautiful-dnd';
import { Draggable } from 'react-beautiful-dnd';
import './App.css';

let groups = [];

class Tile extends Component {
    render() {
        // FIXME: we should only be adding Droppable targets to TILE1s
        return (
            <Draggable draggableId={ this.props.id } type={ this.props.type } index={ this.props.index }>
                {(provided, snapshot) => (
                    <Droppable droppableId={ 'drop_' + this.props.id } type="TILE2">
                        {(provided2, snapshot2) => (
                            <div className="Tile" 
                                 style={{ border: snapshot2.isDraggingOver ? '1px solid #f00' : 'none' }}
                                 ref={ provided2.innerRef }>
                                <div className="Tile_body"
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                >
                                    { this.props.name }
                                </div>
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                )}
            </Draggable>
        );
    }
}

class TileList extends Component {
    getTiles(isDraggingOver) {
        let tiles = [];
        console.log("type = " + this.props.type);        
        for (let i = 0; i < 10; i++) {
            tiles.push(<Tile key={ i } id={ "tile_" + this.props.id + "_" + i } index={ i } name={ "Test " + i } type={ this.props.type }/>);
        }

        if (this.props.type === 'TILE1') {
            for (let i = 0; i < groups.length; i++) {
                const group = groups[i];
                tiles.push(<Tile key={ i+10 } id={ "tile_" + this.props.id + "_" + group } index={ i+10 } name={ "Test " + group }/>);
            }            
        }

        return tiles;
    }

    render() {
        return (
            <Droppable droppableId={ this.props.id } type={ this.props.type }>
              {(provided, snapshot) => (
                <div
                  className="TileList"
                  ref={ provided.innerRef }
                  style={{ backgroundColor: snapshot.isDraggingOver ? 'blue' : 'grey' }}
                >
                  { this.getTiles(snapshot.isDraggingOver) }
                  { provided.placeholder }
                </div>
              )}
            </Droppable>
        );
    }
}

class App extends Component {
    onDragStart = (initial) => {
        console.log("onDragStart for " + initial.type);
        if (initial.type === 'TILE2') {
            // add placeholders to the top of the Tile1 list as drop targets
            groups = ['one', 'two'];
            this.forceUpdate(); // crassly kick the drop target list into updating
        }
    };

    onDragEnd = (result) => {
        console.log("onDragEnd for " + result.type);
        if (result.type === 'TILE2') {
            groups = [];
            this.forceUpdate();
        }
    };

    render() {
        return (
            <DragDropContext
                onDragStart={this.onDragStart}
                onDragEnd={this.onDragEnd}>
                <div className="App">
                    <TileList id="droppable-1" type="TILE1" />
                    <TileList id="droppable-2" type="TILE2" />
                </div>
            </DragDropContext>
        );
    }
}

export default App;
