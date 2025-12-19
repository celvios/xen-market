import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export function validateRequest(schema: z.ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.errors.map(e => ({
            field: e.path.join("."),
            message: e.message
          }))
        });
      }
      next(error);
    }
  };
}

export const tradeSchema = z.object({
  userId: z.string().min(1),
  marketId: z.number().int().positive(),
  outcomeId: z.number().int().positive(),
  amountUSD: z.number().positive().optional(),
  shares: z.number().positive().optional(),
  price: z.number().positive(),
});

export const resolutionSchema = z.object({
  outcomeId: z.number().int().positive(),
  evidence: z.string().min(10),
  proposer: z.string().min(1),
});

export const depositSchema = z.object({
  amount: z.string().refine(val => parseFloat(val) > 0, "Amount must be positive"),
  txHash: z.string().optional(),
});
