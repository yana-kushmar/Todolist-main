import {ResponseType} from "common /common-types";
import axios, {AxiosResponse} from "axios";
import {AddTaskArgType, TaskType, UpdateTaskModelType} from "api/todolists-api";


type GetTasksResponse = {
    error: string | null;
    totalCount: number;
    items: TaskType[];
};

const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/",
    withCredentials: true,
    headers: {
        "API-KEY": "b5d3cf05-af76-4fa9-a21c-3372c69b1b8c",
    },
});

export const tasksAPI = {
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`);
    },
    createTask( arg: AddTaskArgType) {
        return instance.post<
            ResponseType<{ item: TaskType }>,
            AxiosResponse<ResponseType<{ item: TaskType }>>,
            { title: string }
        >(`todo-lists/${arg.todolistId}/tasks`, { title: arg.title });
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<
            ResponseType<{ item: TaskType }>,
            AxiosResponse<ResponseType<{ item: TaskType }>>,
            UpdateTaskModelType
        >(`todo-lists/${todolistId}/tasks/${taskId}`, model);
    },

}