import { RequestHandler } from "express";
import Bid from "../model/Bid";
import Ad from "../model/Ad";

//bid amount post by user from client side now have to save in database
export const addBid: RequestHandler = async (req, res) => {
  try {
    const { productId, bidAmount, userId } = req.body;

    //find if product already have a bid
    const existingBid = await Bid.findOne({ productId: productId });
    console.log(existingBid);

    if (existingBid) {
      //if bid already exist then update the bid
      const updatedBid =await Bid.findOneAndUpdate(
        { productId: productId },
        {
          $push: {
            bids: {                  //Add the bid to the array
              user: userId,
              amount: bidAmount,
              time: Date.now(),
            },
          },
          $addToSet: {
            participatedUsers: userId, // Add the user to the array if not already present
          },
          $set: {
            bidTimeline: Date.now(),
          },
          status: "active",
        },
        { new: true }
      );

       // Now, update the corresponding Ad's currentPrice if the new bid is higher
       const ad = await Ad.findOne({ _id: productId });

       if (ad && bidAmount > ad.currentPrice) {
         ad.currentPrice = bidAmount;
         await ad.save();
       }

      res.status(201).json({
        success: true,
        message: "bid updated",
        updatedBid,
      });
    } else {
      //if bid not exist then create a new bid
      const bid = await Bid.create({
        productId: productId,
        participatedUsers: [userId],
        bids: [
          {
            user: userId,
            amount: bidAmount,
            time: Date.now(),
          },
        ],
        bidTimeline: Date.now(),
        status: "active",
      });

      // Update the corresponding Ad's currentPrice
      const ad = await Ad.findOne({ _id: productId });

      if (ad && bidAmount > ad.currentPrice) {
        ad.currentPrice = bidAmount;
        await ad.save();
      }

      res.status(201).json({
        success: true,
        message: "bid created",
        bid,
      });
    }

  } catch (err) {
    res.status(500).json({
      message: "error",
      err,
    });
  }
};

//get all the bids for a product through its productId
export const getAllBids: RequestHandler = async (req, res) => {
    try{
        const productId=req.params.id
        const bid=await Bid.findOne({productId:productId}).populate('productId').populate('participatedUsers').populate('bids.user')
        
        res.status(200).json({
            success:true,
            message:"bid found",
            bid
        })

    }catch(err){
        res.status(500).json({
            message: "error",
            err,
            });

    }
}
