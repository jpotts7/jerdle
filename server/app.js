import dotenv from 'dotenv';
import express from 'express';
import checkWordRouter from './routes/check-word.mjs';
import submitWordRouter from './routes/submit-word.mjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('public'));
app.use(express.json());
app.use('/check-word', checkWordRouter);
app.use('/submit-word', submitWordRouter);

app.listen(PORT);
