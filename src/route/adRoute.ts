import express from "express";
import { verifyToken } from "../utils/verifyToken";
import { getAllAd, getUserAds,getSoldProducts, postAd, adDetails, newAds,likedByUser,userLikedProducts, checkLiked, getUserPurchasedProducts } from "../controller/ad";


const router=express.Router()

router.post('/add',verifyToken,postAd)
router.get('/get/all/ad',verifyToken,getAllAd)
router.get('/get/ad/details/:id',verifyToken,adDetails)
router.get('/get/recent/ads',verifyToken,newAds)
router.get('/get/user/posted/ads',verifyToken,getUserAds)
//get all the user products which are sold
router.get('/get/user/sold/products',verifyToken,getSoldProducts)
router.get('/get/user/purchased',verifyToken,getUserPurchasedProducts)
//liked by logged in user
router.post('/liked/by/user',verifyToken,likedByUser)
router.get('/get/liked/products/by/user',verifyToken,userLikedProducts)
router.post('/liked/by/user/check',verifyToken,checkLiked)





export default router