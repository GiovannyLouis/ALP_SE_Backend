import express from "express"
import { authMiddleware } from "../middlewares/auth-middleware"
import { AuthController } from "../controllers/auth-controller"
import { MemoryController } from "../controllers/memory-controller"


export const protectedRouter = express.Router()
protectedRouter.use(authMiddleware)

protectedRouter.put("/api/logout", AuthController.logout)

protectedRouter.post("/api/memories", MemoryController.createMemory);
protectedRouter.get("/api/memories", MemoryController.getAllMemories);
protectedRouter.get("/api/memories/user", MemoryController.getMemoriesByUser);
protectedRouter.get("/api/memories/:memoryId", MemoryController.getMemoryById);
protectedRouter.put("/api/memories/:memoryId", MemoryController.updateMemory);
protectedRouter.delete("/api/memories/:memoryId", MemoryController.deleteMemory);