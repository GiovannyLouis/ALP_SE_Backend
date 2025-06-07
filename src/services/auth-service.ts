import { User } from "@prisma/client";
import { prismaClient } from "../application/database";
import { ResponseError } from "../errors/response-error";
import { LoginUserRequest, RegisterUserRequest, toUserResponse, UserResponse } from "../models/user-model";
import { userValidation } from "../validations/user-validation";
import { Validation } from "../validations/validation";
import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid"

//auth-service.ts
export class UserService{
    static async register(req: RegisterUserRequest): Promise<UserResponse> {


        //validate request
        const registerReq = Validation.validate(
            userValidation.REGISTER,
            req
        )

        const usernameExists = await prismaClient.user.findFirst({
            where:{
                username: registerReq.username
            }
        })

        if (usernameExists) {
            throw new ResponseError(400, "Username already exists!")
        }


        registerReq.password  = await bcrypt.hash(registerReq.password, 10)

        const user = await prismaClient.user.create({
            data: {
                username: registerReq.username,
                password: registerReq.password,
                token: uuid()
            }
        })

        return toUserResponse(user)
        
    }

    static async login(request: LoginUserRequest): Promise<UserResponse>{
        const loginRequest = Validation.validate(userValidation.LOGIN, request)

        let user = await prismaClient.user.findFirst({
            where:{
                username: loginRequest.username,
            },
        })

        if (!user){
            throw new ResponseError(400,"Invalid email or password!")
        }

        const passwordIsValid = await bcrypt.compare(
            loginRequest.password,
            user.password
        )

        if(!passwordIsValid){
            throw new ResponseError(400,"Invalid email or password!")
        }

        user = await prismaClient.user.update({
            where: {
                id: user.id,
            },
            data: {
                token: uuid(),
            },
        })

        const response = toUserResponse(user)

        return response
    }

    static async logout(user: User): Promise<string>{
        await prismaClient.user.update({
            where: {
                id: user.id,
            },
            data: {
                token: null,
            },
        })

        return "Logout Successfull!"
    }
    
}