import { Request, Response } from "express";
import { UserRequest } from "../types/user-request";
import { MemoryService } from "../services/memory-service";

export class MemoryController {
  /**
   * Fetches a memory by its ID.
   * @param req - Express request object.
   * @param res - Express response object.
   */
  static async getMemoryById(req: Request, res: Response): Promise<void> {
    const { memoryId } = req.params;

    try {
      const memory = await MemoryService.getMemoryById(parseInt(memoryId, 10));

      if (!memory) {
        res.status(404).json({ error: "Memory not found" });
      } else {
        res.status(200).json(memory);
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  /**
   * Creates a new memory.
   * @param req - Express request object.
   * @param res - Express response object.
   */
  static async createMemory(req: UserRequest, res: Response): Promise<void> {
    const { caption, imageUrl, location } = req.body;

    const userId = req.user?.id;

    if (!userId) {
        res.status(401).json({ error: "Unauthorized: User not found" });
        return;
    }

    try {
      const memory = await MemoryService.createMemory({
        userId,
        caption,
        imageUrl,
        location,
      });

      res.status(201).json(memory);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  static async getAllMemories(req: Request, res: Response): Promise<void> {
    try {
      const memories = await MemoryService.getAllMemories();
      res.status(200).json(memories);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  /**
   * Fetches all memories for a specific user.
   * @param req - Express request object.
   * @param res - Express response object.
   */
  static async getMemoriesByUser(req: UserRequest, res: Response): Promise<void> {
    const userId = req.user?.id;

    if (!userId) {
        res.status(401).json({ error: "Unauthorized: User not found" });
        return;
    }

    try {
      const memories = await MemoryService.getMemoriesByUser(userId);
      res.status(200).json(memories);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  /**
   * Updates a memory by ID.
   * @param req - Express request object.
   * @param res - Express response object.
   */
  static async updateMemory(req: UserRequest, res: Response): Promise<void> {
    const { memoryId } = req.params;
    const { caption, imageUrl, location } = req.body;
    const userId = req.user?.id;

    if (!userId) {
        res.status(401).json({ error: "Unauthorized: User not found" });
        return;
    }

    try {
        // Fetch the memory first
        const memory = await MemoryService.getMemoryById(parseInt(memoryId, 10));

        if (!memory) {
        res.status(404).json({ error: "Memory not found" });
        return;
        }

        // Check ownership
        if (memory.userId !== userId) {
        res.status(403).json({ error: "Forbidden: You can only update your own memories" });
        return;
        }

        // Proceed with update
        const updatedMemory = await MemoryService.updateMemory(
        parseInt(memoryId, 10),
        { userId, caption, imageUrl, location }
        );

        res.status(200).json(updatedMemory);
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        } else {
        res.status(500).json({ error: "Internal server error" });
        }
    }
    }

    static async deleteMemory(req: UserRequest, res: Response): Promise<void> {
    const { memoryId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        res.status(401).json({ error: "Unauthorized: User not found" });
        return;
    }

    try {
        // Fetch the memory first
        const memory = await MemoryService.getMemoryById(parseInt(memoryId, 10));

        if (!memory) {
        res.status(404).json({ error: "Memory not found" });
        return;
        }

        // Check ownership
        if (memory.userId !== userId) {
        res.status(403).json({ error: "Forbidden: You can only delete your own memories" });
        return;
        }

        // Proceed with delete
        await MemoryService.deleteMemory(parseInt(memoryId, 10));
        res.status(200).json({ message: "Memory deleted successfully" });
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        } else {
        res.status(500).json({ error: "Internal server error" });
        }
    }
    }
}
