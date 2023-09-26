import { RequestHandler } from "express";
import Ad from "../model/Ad";
import Payment from "../model/Payment";

export const postAd: RequestHandler = async (req, res) => {
  try {
    const {
      type,
      status,
      title,
      brand,
      description,
      model,
      category,
      price,
      images,
      auctionEnd
    } = req.body;

    //get todays date
    const today = new Date();
    //now add auctionEnd days to todays date
    const auctionEnds = new Date(today.setDate(today.getDate() + auctionEnd));

    const ad = await Ad.create({
      owner: req.user.id,
      category: category,
      choosenType: type,
      productName: title,
      brand,
      model,
      description,
      images,
      productStatus: status,
      basePrice: price,
      currentPrice: price,
      biddingEndsAt: auctionEnds,
    });
    res.status(201).json({
      success: true,
      message: "ad created",
      ad,
    });
  } catch (err) {
    res.status(500).json({
      message: "error",
      err,
    });
  }
};

export const getAllAd: RequestHandler = async (req, res) => {
  try {
    const searched = req.query.search;
    const tag = req.query.tag;

    if (searched && !tag) {
      const keyword = {
        $or: [
          { category: { $regex: searched, $options: "i" } },
          { productName: { $regex: searched, $options: "i" } },
          { brand: { $regex: searched, $options: "i" } },
          { model: { $regex: searched, $options: "i" } },
        ],
      };
      const ads = await Ad.find({
        $and: [
          { sold: false },
          { auctionEnded: false },
          { owner: { $ne: req.user.id } },
        ],
      }).find(keyword).populate("owner", "-password");

      res.status(200).json({
        success: true,
        message: "all ads",
        ads,
      });
    }

    if (tag && !searched) {
      const keyword = {
        $or: [
          { model: { $regex: tag, $options: "i" } },
          { category: { $regex: tag, $options: "i" } },
        ],
      };
      //get the ads which are not sold or auction ended or user who gives the ad is not the same user who is logged in
      const ads = await Ad.find({
        $and: [
          { sold: false },
          { auctionEnded: false },
          { owner: { $ne: req.user.id } },
        ],
      })
        .find(keyword)
        .populate("owner", "-password");

      res.status(200).json({
        success: true,
        message: "all ads",
        ads,
      });
    }
    if (searched && tag) {
      const keyword = {
        $and: [
          { category: { $regex: tag, $options: "i" } },
          {
            $or: [
              { productName: { $regex: searched, $options: "i" } },
              { brand: { $regex: searched, $options: "i" } },
              { model: { $regex: searched, $options: "i" } },
            ],
          },
        ],
      };

      const ads = await Ad.find({
        $and: [
          { sold: false },
          { auctionEnded: false },
          { owner: { $ne: req.user.id } },
        ],
      })
        .find(keyword)
        .populate("owner", "-password");

      res.status(200).json({
        success: true,
        message: "all ads",
        ads,
      });
    }

    if (!searched && !tag) {
      const ads = await Ad.find({
        $and: [
          { sold: false },
          { auctionEnded: false },
          { owner: { $ne: req.user.id } },
        ],
      }).populate("owner", "-password");

      res.status(200).json({
        success: true,
        message: "all ads",
        ads,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "error",
      err,
    });
  }
};

export const adDetails: RequestHandler = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id).populate("owner", "-password");
    res.status(200).json({
      success: true,
      message: "ad details",
      ad,
    });
  } catch (err) {
    res.status(500).json({
      message: "error",
      err,
    });
  }
};

//show all new ads which are not sold or auction ended or user who gives the ad is not the same user who is logged in and sort by created time descending
export const newAds: RequestHandler = async (req, res) => {
  try {
    const ads = await Ad.find({
      $and: [
        { sold: false },
        { auctionEnded: false },
        { owner: { $ne: req.user.id } },
      ],
    })
      .sort({ createdAt: -1 })
      
    res.status(200).json({
      success: true,
      message: "all ads",
      ads,
    });
  } catch (err) {
    res.status(500).json({
      message: "error",
      err,
    });
  }
};

//get all the ads given by logged in user
export const getUserAds: RequestHandler = async (req, res) => {
  try {
    const ads=await Ad.find({owner:req.user.id})
    res.status(200).json({
      success: true,
      message: "all ads",
      ads,
    });
  } catch (err) {
    res.status(500).json({
      message: "error",
      err,
    });
  }
};

export const getSoldProducts: RequestHandler = async (req, res) => {
  try {
    const soldProducts=await Ad.find({sold:true, owner:req.user.id})
    res.status(200).json({
      success: true,
      message: "all sold products",
      soldProducts,
    });
  } catch (err) {
    res.status(500).json({
      message: "error",
      err,
    });
  }
};

export const getUserPurchasedProducts: RequestHandler = async (req, res) => {
  try {
    const purchasedProducts=await Payment.find({owner:req.user.id})

    let result=[]
    for(let i=0 ; i<purchasedProducts.length ; i++){
      for(let j=0 ; j<purchasedProducts[i].soldProducts.length ; j++){
      //  const r =await Ad.findById({_id:purchasedProducts[i].soldProducts[j]})
      //Ad details of the purchased products through sold products id
      const r =await Ad.findById({_id:purchasedProducts[i].soldProducts[j]})
      result.push(r)
      }
    }
    

    res.status(200).json({
      success: true,
      message: "all purchased products",
      purchased:result,
    });
  } catch (err) {
    res.status(500).json({
      message: "error",
      err,
    });
  }
}


//findOneAndUpdate:Usage: This method is used when you want to find and update a document based on custom query criteria.
//findByIdAndUpdate:Usage: This method is used when you know the id of the document you want to update.

export const likedByUser: RequestHandler = async (req, res) => {
  try {
    const { productId } = req.body;

    // Check if the ad is already liked by the user or not
    const existingLikedByUser = await Ad.findOne({ _id: productId, likedBy: req.user.id });

    let result = {};

    if (existingLikedByUser) {
      // If ad is already liked, remove the user id from likedBy array
      result = await Ad.findByIdAndUpdate(
        productId,
        { $pull: { likedBy: req.user.id } },
        { new: true }
      );
    } else {
      // If ad isn't already liked by the user, push the user id to likedBy array
      result = await Ad.findByIdAndUpdate(
        productId,
        { $push: { likedBy: req.user.id } },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: "ad liked by user",
      updatedAd: result,
    });
  } catch (err) {
    res.status(500).json({
      message: "error",
      err,
    });
  }
};

//get all the products which are liked by the logged in user
export const userLikedProducts: RequestHandler = async (req, res) => {
  try {
    const likedProducts = await Ad.find({ likedBy: req.user.id, sold: false });
    res.status(200).json({
      success: true,
      message: "all liked products",
      likedProducts,
    });
  } catch (err) {
    res.status(500).json({
      message: "error",
      err,
    });
  }
}

//check user have already liked the product or not
export const checkLiked: RequestHandler = async (req, res) => {
  try {
    const { productId } = req.body;
    const ad = await Ad.findOne({ _id: productId, likedBy: req.user.id });

    if (ad) {
      res.status(200).json({
        success: true,
        message: "user already liked the product",
        liked: true,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "user have not liked the product",
        liked: false,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "error",
      err,
    });
  }
}







