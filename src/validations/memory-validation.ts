import { z, ZodType } from "zod";

/**
 * Validation schema for report-related operations.
 */
export class MemoryValidation {
  
  static readonly CREATE: ZodType = z.object({
    userId: z.number().nonnegative(), 
    caption: z.string().min(1).max(255),
  });
}
