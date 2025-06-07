import { User } from "@prisma/client";
import { Request } from "express"

//user-request.ts
export interface UserRequest extends Request {
    user?: User
}