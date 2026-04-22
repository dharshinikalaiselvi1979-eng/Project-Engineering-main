const express = require('express');
const router = express.Router();
const bookingService = require('../services/bookingService');
const bookingLimiter = require('../middleware/rateLimiter');

// 🚦 APPLY RATE LIMITER HERE (IMPORTANT FIX)
router.post('/book', bookingLimiter, async (req, res, next) => {
  try {
    const { userId, seatId, showId } = req.body;

    if (!userId || !seatId || !showId) {
      return res.status(400).json({
        message: 'userId, seatId, and showId are required'
      });
    }

    const result = await bookingService.createBooking({
      userId: Number(userId),
      seatId: Number(seatId),
      showId: Number(showId)
    });

    // 🔥 Handle conflict from service (P2002 case)
    if (result.status === "conflict") {
      return res.status(409).json({
        message: "Seat already booked"
      });
    }

    return res.status(201).json(result.booking);

  } catch (err) {
    next(err);
  }
});

router.get('/show/:showId', async (req, res, next) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const bookings = await prisma.booking.findMany({
      where: { showId: Number(req.params.showId) },
      include: {
        user: { select: { id: true, name: true } },
        seat: { select: { id: true, number: true } }
      },
      orderBy: { createdAt: 'asc' }
    });

    res.status(200).json({
      total: bookings.length,
      bookings
    });

  } catch (err) {
    next(err);
  }
});

module.exports = router;