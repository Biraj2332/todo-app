import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import { db } from './config/connectDB.js';
import todoRouter from './routes/todoRoute.js';

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: false,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', todoRouter);

async function startServer() {
  try {
    await db.query('SELECT 1');
    console.log('Database connected successfully');

    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1); 
  }
}

startServer();