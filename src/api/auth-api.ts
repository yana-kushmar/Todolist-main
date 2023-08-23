import {ResponseType} from "common /common-types";
import axios, {AxiosResponse} from "axios";
import {LoginType} from "api/todolists-api";

type UserType = {
    id: number;
    email: string;
    login: string;
};

const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/",
    withCredentials: true,
    headers: {
        "API-KEY": "b5d3cf05-af76-4fa9-a21c-3372c69b1b8c",
    },
});
export const authAPI = {
    login(data: LoginType) {
        return instance.post<ResponseType<{ userId: number }>, AxiosResponse<ResponseType<{ userId: number }>>, LoginType>(
            "/auth/login",
            data
        );
    },
    me() {
        return instance.get<ResponseType<UserType>>("/auth/me");
    },
    logOut() {
        return instance.delete<ResponseType<UserType>>("/auth/login");
    },
};