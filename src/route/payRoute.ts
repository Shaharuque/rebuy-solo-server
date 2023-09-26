import { verifyToken } from "../utils/verifyToken";
import { pay, payIntent, savePaymentInfo } from "../controller/pay";
import express from "express";

const router=express.Router()

router.post("/sold/info",verifyToken,savePaymentInfo)
router.post("/create-payment-intent",payIntent)
//Payment with intregated checkout page
router.post('/create-checkout-session',pay)




export default router