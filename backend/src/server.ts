import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { createGroupRoutes } from './routes/groups';
import { GROUP_PRESETS } from './services/algorithm/GroupConfig';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'SoSo API is running' });
});

app.get('/api/v1/system/info', (_req: Request, res: Response) => {
  res.json({
    architecture: 'SoSo Unified Engine v2',
    description:
      'One core ROSCA with composable add-ons (solidarity, loan pool, foreman, collector, guarantor-first, goal payout, accumulating pool)',
    payoutSelections: ['FIXED_ORDER', 'AUCTION', 'LOTTERY'],
    poolStructures: ['ROTATING', 'ACCUMULATING'],
    culturalPresets: Object.keys(GROUP_PRESETS),
    addons: [
      'solidarityFund',
      'loanPool',
      'foremanFee',
      'collectorFee',
      'guarantorFirstPot',
      'penalties',
      'goalPayout',
    ],
  });
});

app.use('/api/v1/groups', createGroupRoutes(prisma));

app.listen(port, () => {
  console.log(`SoSo Backend running on port ${port}`);
});

export default app;