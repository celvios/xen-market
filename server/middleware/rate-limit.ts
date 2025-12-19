import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

export const tradeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: "Trading too fast, please slow down",
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many authentication attempts",
  standardHeaders: true,
  legacyHeaders: false,
});
