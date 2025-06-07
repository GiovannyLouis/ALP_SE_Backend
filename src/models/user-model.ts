import { User } from "@prisma/client"

export interface RegisterUserRequest{
    username: string,
    password: string
}

export interface LoginUserRequest{
    username: string,
    password: string
}

export interface UserResponse{
    id: number
    token?: string,
    username: string
}

export function toUserResponse(user:User): UserResponse{
    return{
        id: user.id,
        token: user.token ?? "", 
        username: user.username,
    }
}

