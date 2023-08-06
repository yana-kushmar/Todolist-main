import { tasksAction, tasksReducer, TasksStateType } from "features/TodolistsList/tasks-reducer";

import { TaskPriorities, TaskStatuses, UpdateTaskArgType } from "api/todolists-api";
import { todolistsAction, todolistsThunk } from "features/TodolistsList/todolists-reducer";
import { tasksThunk } from "features/TodolistsList/tasks-reducer";

let startState: TasksStateType = {};
beforeEach(() => {
  startState = {
    todolistId1: [
      {
        id: "1",
        title: "CSS",
        status: TaskStatuses.New,
        todoListId: "todolistId1",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
      },
      {
        id: "2",
        title: "JS",
        status: TaskStatuses.Completed,
        todoListId: "todolistId1",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
      },
      {
        id: "3",
        title: "React",
        status: TaskStatuses.New,
        todoListId: "todolistId1",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
      },
    ],
    todolistId2: [
      {
        id: "1",
        title: "bread",
        status: TaskStatuses.New,
        todoListId: "todolistId2",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
      },
      {
        id: "2",
        title: "milk",
        status: TaskStatuses.Completed,
        todoListId: "todolistId2",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
      },
      {
        id: "3",
        title: "tea",
        status: TaskStatuses.New,
        todoListId: "todolistId2",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
      },
    ],
  };
});

test("correct task should be deleted from correct array", () => {
  const action = {
    type: tasksThunk.removeTask.fulfilled.type,
    payload: { taskId: "2", todolistId: "todolistId2" },
  };
  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(2);
  expect(endState["todolistId2"].every((t) => t.id != "2")).toBeTruthy();
});
test("correct task should be added to correct array", () => {
  const task = {
    todoListId: "todolistId2",
    title: "juce",
    status: TaskStatuses.New,
    addedDate: "",
    deadline: "",
    description: "",
    order: 0,
    priority: 0,
    startDate: "",
    id: "id exists",
  };
  const action = tasksThunk.addTask.fulfilled({ task }, "requestId", {
    title: task.title,
    todolistId: task.todoListId,
  });

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(4);
  expect(endState["todolistId2"][0].id).toBeDefined();
  expect(endState["todolistId2"][0].title).toBe("juce");
  expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
});
test("status of specified task should be changed", () => {
  const action = {
    type: tasksThunk.updateTask.fulfilled.type,
    payload: { taskId: "2", domainModel: { status: TaskStatuses.New }, todolistId: "todolistId2" },
  };

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"][1].status).toBe(TaskStatuses.Completed);
  expect(endState["todolistId2"][1].status).toBe(TaskStatuses.New);
});
test("title of specified task should be changed", () => {
  type TaskType = {
    type: typeof tasksThunk.updateTask.fulfilled.type;
    payload: UpdateTaskArgType;
  };
  const action: TaskType = {
    type: tasksThunk.updateTask.fulfilled.type,
    payload: { taskId: "2", domainModel: { title: "yogurt" }, todolistId: "todolistId2" },
  };

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"][1].title).toBe("JS");
  expect(endState["todolistId2"][1].title).toBe("yogurt");
  expect(endState["todolistId2"][0].title).toBe("bread");
});
test("new array should be added when new todolist is added", () => {
  const action = {
    type: todolistsAction.addTodolist.type,
    payload:{todolist: {id: "blabla", title: "new todolist", order: 0, addedDate: ""}},
  };


  const endState = tasksReducer(startState, action);

  const keys = Object.keys(endState);
  const newKey = keys.find((k) => k != "todolistId1" && k != "todolistId2");
  if (!newKey) {
    throw Error("new key should be added");
  }

  expect(keys.length).toBe(3);
  expect(endState[newKey]).toEqual([]);
});
test("propertry with todolistId should be deleted", () => {
  const action = todolistsAction.removeTodolist({ id: "todolistId2" });

  const endState = tasksReducer(startState, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState["todolistId2"]).not.toBeDefined();
});

test("empty arrays should be added when we set todolists", () => {

  const action = {
    type: todolistsAction.setTodolists.type,
    payload: {
      todolists: [
        { id: "1", title: "title 1", order: 0, addedDate: "" },
        { id: "2", title: "title 2", order: 0, addedDate: "" },
      ],
    },
  };


  const endState = tasksReducer({}, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(2);
  expect(endState["1"]).toBeDefined();
  expect(endState["2"]).toBeDefined();
});
test("tasks should be added for todolist", () => {

  const action = {
    type: tasksThunk.fetchTasks.fulfilled.type,
    payload: {
      todolistId: "todolistId1",
      tasks: [1,2,3]
    },
  };
  const endState = tasksReducer(
    {
      todolistId2: [],
      todolistId1: [],
    },
    action
  );

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(0);
});
