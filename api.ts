import express from 'express';
import { INITIAL_STOCKS, WISH_AXX_CONTACTS } from '../src/data/stocksData';

export const apiRouter = express.Router();

// Calculate penalty helper endpoint
apiRouter.get('/vault/calculate-penalty', (req, res) => {
  const principal = parseFloat(req.query.principal as string) || 0;
  const lockedAt = req.query.lockedAt ? new Date(req.query.lockedAt as string) : new Date();
  const unlockDate = req.query.unlockDate ? new Date(req.query.unlockDate as string) : new Date(Date.now() + 30 * 24 * 3600 * 1000);
  const now = new Date();

  const isMatured = now.getTime() >= unlockDate.getTime();
  const daysElapsed = Math.floor((now.getTime() - lockedAt.getTime()) / (24 * 3600 * 1000));
  const remainingDays = Math.max(0, Math.ceil((unlockDate.getTime() - now.getTime()) / (24 * 3600 * 1000)));

  // If before 1 month (30 days), 10% penalty applies strictly
  const penaltyRate = isMatured ? 0 : 0.10;
  const penaltyAmount = +(principal * penaltyRate).toFixed(2);
  const netPayout = +(principal - penaltyAmount).toFixed(2);

  res.json({
    principal,
    isMatured,
    daysElapsed,
    remainingDays,
    penaltyRate,
    penaltyAmount,
    netPayout,
    penaltyNote: isMatured
      ? 'Lock period completed! No penalty, 100% of funds plus yields are ready to claim.'
      : 'Early exit penalty strictly applies: 10% will be deducted from your principal if withdrawn before 30 days.'
  });
});

// Get market stock list
apiRouter.get('/market', (_req, res) => {
  res.json({
    updatedAt: new Date().toISOString(),
    stocks: INITIAL_STOCKS
  });
});

// Get contacts for Wish Money & Axx transfers
apiRouter.get('/contacts', (_req, res) => {
  res.json(WISH_AXX_CONTACTS);
});
