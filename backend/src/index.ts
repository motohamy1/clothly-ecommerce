import express from 'express';
import mongoose from 'mongoose';
import clothesRouter from './routers/clothes'

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use('/shop', clothesRouter)

mongoose.connect('mongodb://localhost:27017/Clothely-ecommerce')
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Server is Running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
