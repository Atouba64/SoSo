import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'SoSo API is running perfectly!' });
});

// Mock Route for Algorithm testing (Can be expanded into full controller)
app.get('/api/v1/system/info', (req: Request, res: Response) => {
    res.json({
        architecture: 'SoSo Trust Engine V1',
        modes: ['FIXED', 'BIDDING', 'LOTTERY', 'GUARANTOR'],
        dbStatus: 'Connected'
    });
});

app.listen(port, () => {
    console.log(`🚀 SoSo Backend Server is running on port ${port}`);
});

export default app;