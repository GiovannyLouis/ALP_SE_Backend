import { NextFunction, Request, Response } from "express";
import { LoginUserRequest, RegisterUserRequest, UserResponse } from "../models/user-model";
import { UserService } from "../services/auth-service";
import { UserRequest } from "../types/user-request";

export class AuthController {
    static async register (req: Request, res: Response, next: NextFunction) {
        try{
             const request:RegisterUserRequest = req.body as RegisterUserRequest
             const response: UserResponse = await UserService.register(request)

             res.status(200).json({
                data: response
             })
        } catch (error) {
            //ini pass error ke middleware
            next(error)
        }
    }

    static async login (req: Request, res: Response, next: NextFunction) {
        try{
             const request:LoginUserRequest = req.body as LoginUserRequest
             const response: UserResponse = await UserService.login(request)

             res.status(200).json({
                data: response
             })
        } catch (error) {
            //ini pass error ke middleware
            next(error)
        }
    }

    static async logout (req: UserRequest, res: Response, next: NextFunction) {
        try{
             const response = await UserService.logout(req.user!)

             res.status(200).json({
                data: response
             })
        } catch (error) {
            //ini pass error ke middleware
            next(error)
        }
    }
}