import { Button, Row, Form } from "react-bootstrap";

export function TodoForm({ addTodo, handleInputChange, inputValue }) {
  return (
    <Row>
      <Form onSubmit={addTodo}>
        <Form.Group
          className="mb-3 mt-3 "
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Form.Control
            type="text"
            placeholder="Enter todo"
            onChange={handleInputChange}
            value={inputValue}
            style={{
              maxWidth: "500px",
            }}
          />
        </Form.Group>

        <Button
          type="submit"
          className="text-white"
          style={{ backgroundColor: "#3ab5cd", border: "1px solid #6ecadd" }}
        >
          Submit
        </Button>
      </Form>
    </Row>
  );
}
