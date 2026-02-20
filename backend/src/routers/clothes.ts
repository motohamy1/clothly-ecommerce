import express from 'express';
import { menclothesModel } from '../models/menclothes';

const router = express.Router();

router.get('/men',async (req, res) => {
    const menclothes = await menclothesModel.find();
    console.log(menclothes);
    res.json(menclothes)
})



export default router;