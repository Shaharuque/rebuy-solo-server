import express from "express";
import { verifyToken } from "../utils/verifyToken";
import { addBid, getAllBids } from "../controller/bid";



const router=express.Router()

//get all the bids for a product id
router.get('/get/:id',verifyToken,getAllBids)
router.post('/post',verifyToken,addBid)

export default router
