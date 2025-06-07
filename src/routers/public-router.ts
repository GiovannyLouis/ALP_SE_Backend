import  express  from "express";
import {AuthController} from "../controllers/auth-controller"

export const publicRouter = express.Router()

publicRouter.post("/api/register", AuthController.register)
publicRouter.post("/api/login", AuthController.login)
