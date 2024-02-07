import { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Container, Row, Button, Modal, Form } from "react-bootstrap";
import { TodoForm } from "./Form";

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

const grid = 10;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid,
  margin: `0 0 ${grid}px 0`,
  display: "flex",
  justifyContent: "space-between",
  overflow: "auto",
  alignItems: "center",

  // change background color if dragging
  background: isDragging ? "#b9a5ca" : "white",
  color: isDragging ? "white" : "#b9a5ca",

  // styles we need to apply on draggable
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "lightblue" : "#b9a5ca",
  padding: grid,
  width: 400,
});
interface ModalState {
  show: boolean;
}

class App extends Component<{
  items: Todo[];
  todos: Todo[];
  inputValue: string;
  modalState: ModalState;
  editTodoId: string | null;
}> {
  state = {
    items: getItems(0),
    todos: [] as Todo[],
    inputValue: "",
    modalState: { show: false },
    editTodoId: null,
  };

  handleClose = () => {
    this.setState({ modalState: { show: false } });
  };

  handleEditTodo = (id: string) => {
    this.setState({ editTodoId: id, modalState: { show: true } });
  };

  handleShow = () => {
    this.setState({ modalState: { show: true } });
  };
  handleSaveEdit = () => {
    // Save the edited todo
    // For simplicity, let's just update the content of the todo with the input value
    const { todos, editTodoId, inputValue } = this.state;
    const updatedTodos = todos.map((todo) =>
      todo.id === editTodoId ? { ...todo, content: inputValue } : todo
    );
    this.setState({
      todos: updatedTodos,
      editTodoId: null,
      modalState: { show: false },
      inputValue: "",
    });
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: e.target.value });
  };

  addTodo = (e) => {
    e.preventDefault();

    if (this.state.inputValue.trim() !== "") {
      const newTodo = {
        id: `todo-${this.state.todos.length}`,
        content: this.state.inputValue,
      };
      this.setState({
        todos: [...this.state.todos, newTodo],
        inputValue: "", // Clearing the input field after adding todo
      });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const todos = [...this.state.todos];
      const [reorderedItem] = todos.splice(source.index, 1);
      todos.splice(destination.index, 0, reorderedItem);

      const state = { todos };

      this.setState(state);
    }
  };
  handleNewInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newInputValue: e.target.value });
  };

  render() {
    const { todos, inputValue } = this.state;
    return (
      <>
        <Container className="my-5 text-center">
          <Row className="pt-5">
            <TodoForm
              addTodo={this.addTodo}
              handleInputChange={this.handleInputChange}
              inputValue={inputValue}
            />
          </Row>
          <Row
            className="my-5"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <DragDropContext onDragEnd={this.onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {todos.map((todo, index) => (
                      <Draggable
                        key={todo.id}
                        draggableId={todo.id}
                        index={index}
                      >
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
                            <Button
                              variant="button"
                              className="btn-outline-danger"
                              onClick={() => {
                                const newTodos = [...this.state.todos];
                                newTodos.splice(index, 1);
                                this.setState({ todos: newTodos });
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-trash"
                                viewBox="0 0 16 16"
                              >
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                              </svg>
                            </Button>
                            <Button variant="primary" onClick={this.handleShow}>
                              Edit
                            </Button>
                            <Modal
                              show={this.state.modalState.show}
                              onHide={this.handleClose}
                            >
                              <Modal.Header closeButton>
                                <Modal.Title>Edit ToDo</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                <Form>
                                  <Form.Control
                                    type="text"
                                    placeholder="Enter todo"
                                    onChange={this.handleNewInputChange}
                                    value={inputValue}
                                    style={{
                                      maxWidth: "500px",
                                    }}
                                  />
                                </Form>
                              </Modal.Body>
                              <Modal.Footer>
                                <Button
                                  variant="secondary"
                                  onClick={this.handleClose}
                                >
                                  Close
                                </Button>
                                <Button
                                  variant="primary"
                                  onClick={this.handleSaveEdit}
                                >
                                  Save Changes
                                </Button>
                              </Modal.Footer>
                            </Modal>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </Row>
        </Container>
      </>
    );
  }
}

export default App;
