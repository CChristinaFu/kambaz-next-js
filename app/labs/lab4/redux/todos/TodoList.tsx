import React from "react";
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { ListGroup, ListGroupItem, FormControl, Button } from "react-bootstrap";
export default function TodoList() {
  const { todos } = useSelector((state: RootState) => state.todosReducer);
  return (
    <div id="wd-todo-list-redux">
      <h2>Todo List</h2>
      <ListGroup>
        <TodoForm />
        {todos.map((todo: any) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ListGroup>
      <hr/>
    </div>
);}

// import { useState } from "react";
// import { ListGroup, ListGroupItem, FormControl, Button } from "react-bootstrap";
// import TodoForm from "./TodoForm";
// import TodoItem from "./TodoItem";
// import { useSelector } from "react-redux";

// export default function TodoList() {
//   const [todos, setTodos] = useState([
//     { id: "1", title: "Learn React" },
//     { id: "2", title: "Learn Node" },
//   ]);
//   const [todo, setTodo] = useState({ id: "-1", title: "Learn Mongo" });

//   const addTodo = (todo: any) => {
//     const newTodos = [...todos, { ...todo, id: new Date().getTime().toString() }];
//     setTodos(newTodos);
//     setTodo({ id: "-1", title: "" });
//   };

//   const deleteTodo = (id: string) => {
//     const newTodos = todos.filter((todo) => todo.id !== id);
//     setTodos(newTodos);
//   };

//   const updateTodo = (todo: any) => {
//     const newTodos = todos.map((item) => (item.id === todo.id ? todo : item));
//     setTodos(newTodos);
//     setTodo({ id: "-1", title: "" });
//   };
  

//   return (
//     <div>
//       <h2>Todo List</h2>
//       <ListGroup>
//         <ListGroupItem className="d-flex align-items-center">
//           <FormControl
//             className="me-2"
//             value={todo.title}
//             onChange={(e) => setTodo({ ...todo, title: e.target.value })}
//           />
//           <Button
//             onClick={() => updateTodo(todo)}
//             id="wd-update-todo-click"
//             variant="warning"
//             className="me-2 text-black"
//           >
//             Update
//           </Button>
//           <Button
//             onClick={() => addTodo(todo)}
//             id="wd-add-todo-click"
//             variant="success"
//           >
//             Add
//           </Button>
//         </ListGroupItem>
//         {todos.map((todo) => (
//           <ListGroupItem key={todo.id} className="d-flex align-items-center">
//             <span className="flex-fill fs-5">{todo.title}</span>
//             <Button
//               onClick={() => setTodo(todo)}
//               id="wd-set-todo-click"
//               variant="primary"
//               className="me-2"
//             >
//               Edit
//             </Button>
//             <Button
//               onClick={() => deleteTodo(todo.id)}
//               id="wd-delete-todo-click"
//               variant="danger"
//             >
//               Delete
//             </Button>
//           </ListGroupItem>
//         ))}
//       </ListGroup>
//       <ListGroup>
//         <TodoForm
//           todo={todo}
//           setTodo={setTodo}
//           addTodo={addTodo}
//           updateTodo={updateTodo}/>
//         {todos.map((todo) => (
//           <TodoItem
//             key={todo.id}
//             todo={todo}
//             deleteTodo={deleteTodo}
//             setTodo={setTodo} />
//         ))}
//       </ListGroup>
//       <hr />
      
//     </div>
//   );
// }