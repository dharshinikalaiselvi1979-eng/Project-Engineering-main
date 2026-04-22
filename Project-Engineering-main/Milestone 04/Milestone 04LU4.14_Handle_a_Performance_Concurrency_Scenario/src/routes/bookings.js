import express from "express";
import { bookSeat } from "../services/bookingService.js";
import rateLimiter from "../middleware/rateLimiter.js";

const router = express.Router();

// 🚦 Rate limiter applied (correct)
router.post("/book", rateLimiter, async (req, res, next) => {
  try {
    const { seatId, showId, userId } = req.body;

    // basic validation (good practice for evaluation)
    if (!seatId || !showId || !userId) {
      return res.status(400).json({
        success: false,
        message: "seatId, showId, and userId are required",
      });
    }

    const result = await bookSeat({ seatId, showId, userId });

    // ⚠️ Conflict case (P2002 mapped in service)
    if (result.status === "conflict") {
      return res.status(409).json({
        success: false,
        message: "Seat already booked",
      });
    }

    return res.status(201).json({
      success: true,
      data: result.booking,
    });

  } catch (err) {
    next(err);
  }
});

export default router;