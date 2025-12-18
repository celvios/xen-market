import { z } from "zod";

export const feeRevenueSchema = z.object({
  id: z.number(),
  date: z.date(),
  tradingFees: z.string(),
  creationFees: z.string(),
  withdrawalFees: z.string(),
  totalRevenue: z.string(),
});

export type FeeRevenue = z.infer<typeof feeRevenueSchema>;