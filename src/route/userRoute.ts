import express from "express";
import { verifyToken } from "../utils/verifyToken";
import { allUsers } from "../controller/user";

const router=express.Router()

router.get('/all',verifyToken,allUsers)



export default router