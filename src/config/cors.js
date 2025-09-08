import cors from 'cors';

export const corsConfig = cors({
    origin: ['https://shopping-list-lc.netlify.app', 'http://localhost:5173'],
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true
});
