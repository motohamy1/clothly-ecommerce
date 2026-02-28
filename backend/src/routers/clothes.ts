import express from 'express';
import { menclothesModel } from '../models/menclothes';
import {womenClothesModel} from "../models/womenclothes";

const router = express.Router();

router.get('/men', async (req, res) => {
    const menclothes = await menclothesModel.find();
    console.log(menclothes);
    res.json(menclothes)
})
router.get('/men/:id', async (req, res) => {
    const oneclothe = await menclothesModel.findById();
    res.json(oneclothe)
})

router.get('/women',async (req, res) => {
    const womenclothes = await womenClothesModel.find();
    console.log(womenclothes);
    res.json(womenclothes)
})

router.get('/kids',async (req, res) => {
    const menclothes = await menclothesModel.find();
    console.log(menclothes);
    res.json(menclothes)
})

router.get('/couples',async (req, res) => {
    const menclothes = await menclothesModel.find();
    console.log(menclothes);
    res.json(menclothes)
})



export default router;