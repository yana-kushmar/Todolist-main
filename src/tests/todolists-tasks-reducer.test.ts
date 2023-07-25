import { TasksStateType } from "../features/TodolistsList/tasks-reducer";
import { TodolistDomainType } from "../features/TodolistsList/todolists-reducer";
import { addTodolistAC, todolistsReducer } from "../features/TodolistsList/todolists-reducer";
import { tasksReducer } from "../features/TodolistsList/tasks-reducer";
import { TodolistType } from "../api/todolists-api";

test("ids should be equals", () => {
  const startTasksState: TasksStateType = {};
  const startTodoListsState: Array<TodolistDomainType> = [];

  let todolist: TodolistType = {
    title: "new todolist",
    id: "any id",
    addedDate: "",
    order: 0,
  };

  const action = addTodolistAC(todolist);

  const endTasksState = tasksReducer(startTasksState, action);
  const endTodoListsState = todolistsReducer(startTodoListsState, action);

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodoLists = endTodoListsState[0].id;

  expect(idFromTasks).toBe(action.todolist.id);
  expect(idFromTodoLists).toBe(action.todolist.id);
});
