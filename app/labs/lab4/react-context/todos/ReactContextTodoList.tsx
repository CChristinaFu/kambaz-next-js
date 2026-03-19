"use client";
import { ListGroup, Button, FormControl } from "react-bootstrap";
import { useTodos } from "./todosContext";

export default function ReactContextTodoList() {
  const { todos, todo, setTodo, addTodo, deleteTodo, updateTodo } = useTodos();
  return (
    <div id="wd-react-context-todo-list">
      <h2>Todo List</h2>
      <ListGroup>
        <ListGroup.Item className="d-flex align-items-center">
          <FormControl className="me-2" value={todo.title}
            onChange={(e) => setTodo({ ...todo, title: e.target.value })} />
          <Button onClick={updateTodo} id="wd-update-todo-click"
            variant="warning" className="me-2 text-black"> Update </Button>
          <Button onClick={addTodo} id="wd-add-todo-click"
            variant="success"> Add </Button>
        </ListGroup.Item>
        {todos.map((t: any) => (
          <ListGroup.Item key={t.id} className="d-flex align-items-center">
            <span className="flex-fill fs-5">{t.title}</span>
            <Button onClick={() => setTodo(t)} id="wd-set-todo-click"
              variant="primary" className="me-2"> Edit </Button>
            <Button onClick={() => deleteTodo(t.id)} id="wd-delete-todo-click"
              variant="danger"> Delete </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <hr />
    </div>
  );
}