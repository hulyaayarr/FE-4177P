import { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

type Todo = {
  id: string;
  content: string;
};
// fake data generator
const getItems = (count: number): Todo[] =>
  Array.from({ length: count }, (_, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

/*
type Quote = {
  id: string;
  content: string;
};



a little function to help us with reordering the result
const reorder = (
  list: Quote[],
  startIndex: number,
  endIndex: number
): Quote[] => {
  const result: Quote[] = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
*/

/**
 * Moves an item from one list to another list.
 
const move = (
  source: Quote[],
  destination: Quote[],
  droppableSource,
  droppableDestination
): Quote[] => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};
*/
const grid = 8;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background color if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggable
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250,
});

class App extends Component {
  state = {
    items: getItems(0),
    todos: [] as Todo[],
    inputValue: "",
  };
  addTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { inputValue, todos } = this.state;

    if (inputValue.trim() !== "") {
      const newTodo: Todo = { id: `todo-${todos.length}`, content: inputValue };
      this.setState({
        todos: [...todos, newTodo],
        inputValue: "", // Clearing the input field after adding todo
        items: getItems(todos.length + 1),
      });
    }
  };
  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: e.target.value });
  };

  /**
   * A semi-generic way to handle multiple lists. Matches
   * the IDs of the droppable container to the names of the
   * source arrays stored in the state.
   
  id2List = {
    droppable: "items",
    droppable2: "selected",
  };

  getList = (id: string) => this.state[this.id2List[id]];*/

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDragEnd = (result: any) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      /*
      const items: Quote[] = reorder(
        this.state.items,
        source.index,
        destination.index
      );
      */
      const todos = [...this.state.todos];
      const [reorderedItem] = todos.splice(source.index, 1);
      todos.splice(destination.index, 0, reorderedItem);

      const state = { todos };

      /*
      if (source.droppableId === "droppable2") {
        state = { selected: items };
      }
      */

      this.setState(state);
    }
    /*else {
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );

      this.setState({
        items: result.droppable,
        selected: result.droppable2,
      });
    }
    */
  };

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    const { todos, inputValue } = this.state;
    return (
      <>
        <form
          action="
        "
          onSubmit={this.addTodo}
        >
          <input
            type="text"
            value={inputValue}
            onChange={this.handleInputChange}
          />
          <button type="submit">Add Todo</button>
        </form>

        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {todos.map((todo, index) => (
                  <Draggable key={todo.id} draggableId={todo.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        {todo.content}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </>
    );
  }
}

export default App;
