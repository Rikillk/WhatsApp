
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface AuthInput {
    username: string;
    email: string;
    password: string;
}

export interface DeleteUserInput {
    userId: string;
}

export interface User {
    id: number;
    username?: Nullable<string>;
    email: string;
    password?: Nullable<string>;
}

export interface AuthResponse {
    message: string;
    user: User;
}

export interface IQuery {
    getUser(id: number): User | Promise<User>;
}

export interface IMutation {
    signup(input: AuthInput): AuthResponse | Promise<AuthResponse>;
    deleteUser(input: DeleteUserInput): boolean | Promise<boolean>;
}

type Nullable<T> = T | null;
