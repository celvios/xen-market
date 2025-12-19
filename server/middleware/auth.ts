import { Request, Response, NextFunction } from "express";
import { storage } from "../storage";

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const { proposer } = req.body;
    
    if (!proposer) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const user = await storage.getUserByWallet(proposer);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const adminWallets = [
      "0x1234",
      process.env.ADMIN_WALLET_1,
      process.env.ADMIN_WALLET_2,
    ].filter(Boolean);

    if (!adminWallets.includes(user.walletAddress || "")) {
      return res.status(403).json({ error: "Admin access required" });
    }

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
}
