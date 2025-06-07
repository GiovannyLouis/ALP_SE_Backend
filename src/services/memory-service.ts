import { prismaClient } from "../application/database";
import { ResponseError } from "../errors/response-error";
import {
  CreateMemoryRequest,
  MemoryResponse,
  toMemoryResponse,
} from "../models/memory-model";

export class MemoryService {
  /**
   * Fetch a single memory by ID.
   * @param memoryId - ID of the memory to fetch.
   * @returns The memory as a standardized response.
   */
  static async getMemoryById(memoryId: number): Promise<MemoryResponse> {
    const memory = await prismaClient.memory.findUnique({
      where: { id: memoryId },
    });

    if (!memory) {
      throw new ResponseError(404, "Memory not found.");
    }

    return toMemoryResponse(memory);
  }

  /**
   * Create a new memory.
   * @param request - The memory creation request data.
   * @returns The created memory as a standardized response.
   */
  static async createMemory(request: CreateMemoryRequest): Promise<MemoryResponse> {
    if (!request.caption || !request.imageUrl) {
      throw new ResponseError(400, "Caption and image URL are required.");
    }

    const memory = await prismaClient.memory.create({
      data: {
        userId: request.userId,
        caption: request.caption,
        imageUrl: request.imageUrl,
        location: request.location ?? null,
      },
    });

    return toMemoryResponse(memory);
  }

  static async getAllMemories(): Promise<MemoryResponse[]> {
    const memories = await prismaClient.memory.findMany({
      orderBy: { id: "desc" },
    });

    return memories.map(toMemoryResponse);
  }


  /**
   * Fetch all memories for a specific user.
   * @param userId - ID of the user.
   * @returns List of memories.
   */
  static async getMemoriesByUser(userId: number): Promise<MemoryResponse[]> {
    const memories = await prismaClient.memory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return memories.map(toMemoryResponse);
  }

  /**
   * Update an existing memory.
   * @param memoryId - ID of the memory to update.
   * @param request - The updated memory data.
   * @returns The updated memory as a standardized response.
   */
  static async updateMemory(
    memoryId: number,
    request: Partial<CreateMemoryRequest>
  ): Promise<MemoryResponse> {
    const existingMemory = await prismaClient.memory.findUnique({
      where: { id: memoryId },
    });

    if (!existingMemory) {
      throw new ResponseError(404, "Memory not found.");
    }

    const updatedMemory = await prismaClient.memory.update({
      where: { id: memoryId },
      data: {
        caption: request.caption,
        imageUrl: request.imageUrl,
        location: request.location ?? null,
      },
    });

    return toMemoryResponse(updatedMemory);
  }

  /**
   * Delete a memory by ID.
   * @param memoryId - ID of the memory to delete.
   */
  static async deleteMemory(memoryId: number): Promise<void> {
    const existingMemory = await prismaClient.memory.findUnique({
      where: { id: memoryId },
    });

    if (!existingMemory) {
      throw new ResponseError(404, "Memory not found.");
    }

    await prismaClient.memory.delete({
      where: { id: memoryId },
    });
  }
}
