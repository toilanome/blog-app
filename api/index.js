import express from 'express';
import dotenv from 'dotenv';
import router from './routes/IndexRoute.js';
import mongoose from 'mongoose';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cookieParser from 'cookie-parser';

dotenv.config();

const { PORT, DB_URL, SECRET_KEY } = process.env;

// Get the current module's file path
const __filename = fileURLToPath(import.meta.url);

// Get the directory name from the file path
const __dirname = dirname(__filename);



const app = express();
app.use(express.json());
app.use(cookieParser(SECRET_KEY));

app.use(cors());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/api', router);



mongoose.connect(DB_URL).then(() => {
    console.log('database connection');
});

app.listen(PORT, () => {
    console.log(`dang chay o port ${PORT}`);
});
