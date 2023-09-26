import express from "express";
import { verifyToken } from "../utils/verifyToken";
import openAIText from "../controller/openAIText";



const router=express.Router()

router.post('/text',openAIText);

export default router
