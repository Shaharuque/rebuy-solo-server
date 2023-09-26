import { RequestHandler } from "express";
import Cart from "../model/Cart";

//product add to cart
export const addToCart: RequestHandler = async (req, res) => {
  try {
    const { productId } = req.body;
    //add product to cart
    const cart = await Cart.create({
      productInfo: productId,
      userInfo: req.user.id,
    });
    res.status(200).json({
      success: true,
      message: "product added to cart",
    });
  } catch (err) {
    res.status(500).json({
      message: "error",
      err,
    });
  }
};

//find the product through its product id is on the cart or not
export const checkItemOnCart: RequestHandler = async (req, res) => {
  try {
    const productId = req.body.productId;
    const cart = await Cart.find({
      productInfo: productId,
      userInfo: req.user.id,
    });
    res.status(200).json({
      success: true,
      message: "product is on the cart",
      cart,
    });
  } catch (err) {
    res.status(500).json({
      message: "error",
      err,
    });
  }
};

//get all the items on cart for individual user
export const getCart: RequestHandler = async (req, res) => {
  try {
    const cart = await Cart.find({ userInfo: req.user.id })
      .populate("productInfo")
      .populate("userInfo");

    //get total price of all the items on cart of logged in user
    let totalPrice = 0;
    if (cart) {
      cart.forEach((item: any) => {
        totalPrice += item?.productInfo?.basePrice;
      });
    }

    res.status(200).json({
      success: true,
      message: "all items on cart",
      cart,
      totalPrice,
    });
  } catch (err) {
    res.status(500).json({
      message: "error",
      err,
    });
  }
};

//delete item from cart id wise
export const deleteItemFromCart: RequestHandler = async (req, res) => {
  try {
    const itemId = req.body.productId;
    const deletedItem = await Cart.findByIdAndDelete(itemId);    
    
    let existingCart:any = null
    let totalPrice = 0;
    if(deletedItem){
        existingCart = await Cart.find({ userInfo: req.user.id })
        .populate("productInfo")
        .populate("userInfo");
  
      //get total price of all the items on cart of logged in user
      if (existingCart) {
        existingCart.forEach((item: any) => {
          totalPrice += item?.productInfo?.basePrice;
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "item deleted from cart",
      cart:existingCart,
      totalPrice,
    });
  } catch (err) {
    res.status(500).json({
      message: "error",
      err,
    });
  }
};

//bulk delete from cart for logged in user
export const bulkDeleteFromCart: RequestHandler = async (req, res) => {
  try {
    const { cart } = req.body;
    console.log(cart)
    const deletedItems = await Cart.deleteMany({ _id: cart, userInfo: req.user.id });
    res.status(200).json({
      success: true,
      message: "items deleted from cart",
      deletedItems,
    });
  } catch (err) {
    res.status(500).json({
      message: "error",
      err,
    });
  }
}

