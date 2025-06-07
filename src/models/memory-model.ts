export interface CreateMemoryRequest {
    userId: number; 
    caption: string; 
    imageUrl: string;
    location?: string;
  }
  
  export interface MemoryResponse {
    id: number; 
    userId: number; 
    caption: string; 
    imageUrl: string;
    location?: string;
    createdAt: Date;
  }
  
  export const toMemoryResponse = (memory: any): MemoryResponse => {
    return {
      id: memory.id,
      userId: memory.userId,
      caption: memory.caption,
      imageUrl: memory.imageUrl,
      location: memory.location || "",
      createdAt: memory.createdAt
    };
  };
  