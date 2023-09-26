import { RequestHandler } from "express";
import Payment from "../model/Payment";

import Stripe from "stripe";
import Cart from "../model/Cart";
import Ad from "../model/Ad";

const stripe = new Stripe(
  "sk_test_51K8U3bA8Wu6mzkGu5nh3VeyKBXsYzcknntMgfOne75UuPdvl2zincfWrFBxkOjQRwBZIjlODiNqrgLaGebi5DlCa00Ec2lfcDt",
  {
    apiVersion: "2023-08-16", // Use the appropriate API version
  }
);
export const payIntent: RequestHandler = async (req, res) => {
  try {
    const service = req.body;
    const price = service.price;
    const amount = price / 100;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while creating a PaymentIntent" });
  }
};

//save payment info to db. cart from client side will be an array of object
export const savePaymentInfo: RequestHandler = async (req, res) => {
  try {
    const { cart,totalPrice } = req.body;
    console.log(cart,totalPrice)
    const payment = new Payment({
      owner: req.user.id,
      soldProducts:cart,
      totalAmount:totalPrice,
    });
    await payment.save();


    //After Payment Instance create have to update the Ad sold status to true
    cart.map(async (item:any)=>{
      await Ad.findByIdAndUpdate(item,{sold:true})
    })


    //delete all the items from cart after payment
    // await Cart.deleteMany({ userInfo: req.user.id });

  
    res.status(200).json({
      success: true,
      message: "payment info saved",
      payment
    });
  } catch (err) {
    res.status(500).json({
      message: "error",
      err,
    });
  }
};

//Payment with intregated checkout page of stripe
// export const pay: RequestHandler = async (req, res) => {
//   const l = req.body.cartItems;
//   console.log(l)
//   const session = await stripe.checkout.sessions.create({

//     line_items: [
//       {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: "T-shirt",
//           },
//           unit_amount: 2000,
//         },
//         quantity: 1,
//       },
//       {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: "T-shirt",
//           },
//           unit_amount: 2000,
//         },
//         quantity: 1,
//       },
//     ],
//     mode: "payment",
//     success_url: `http://localhost:5173/success`,
//     cancel_url: `http://localhost:5173/cart`,
//   });

//   res.send({url:session.url});
// };

export const pay: RequestHandler = async (req, res) => {
  const line_items = req.body.cartItems?.map((item:any)=>{
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item?.productInfo?.productName,
          metadata:{
            productId:item?.productInfo?._id
          }
        },
        unit_amount: (item?.productInfo?.basePrice),
      },
      quantity: 1,
    }
  });
  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    success_url: `http://localhost:5173/success`,
    cancel_url: `http://localhost:5173/cart`,
  });

  res.send({url:session.url});
};

