import { Schema, model } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
interface IAd {
  category: string;
  choosenType: string;
  productStatus: string;
  productName: string;
  brand: string;
  model: string;
  description: string;
  images: string[];
  originalPacking: boolean;
  basePrice: number;
  currentPrice: number;
  duration: number;
  timer: number;
  soldAt: Date;
  catergory: string;
  auctionStarted: boolean;
  auctionEnded: boolean;
  sold: boolean;
  owner: object;
  purchasedBy: object;
  currentBidder: object;
  likedBy: object[];
  biddingEndsAt: Date;
  // bids: Array<object>;
  // room: object;
}
// 2. Create a Schema corresponding to the document interface.
const adSchema = new Schema<IAd>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    category: {
      type: String,
    },
    choosenType: {
      type: String,
    },
    productStatus: {
      type: String,
    },
    productName: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
    },
    model: {
      type: String,
    },
    description: {
      type: String,
    },
    images: {
      type: [String], // Use an array of strings
    },
    originalPacking: {
      type: Boolean,
      default: false,
    },
    basePrice: {
      type: Number,
      required: true,
    },
    currentPrice: {
      type: Number
    },
    duration: {
      type: Number,
      default: 300,
    },
    timer: {
      type: Number,
      default: 300,
    },
    soldAt: {
      type: Date,
    },
    auctionStarted: {
      type: Boolean,
      default: false,
    },
    auctionEnded: {
      type: Boolean,
      default: false,
    },
    sold: {
      type: Boolean,
      default: false,
    },
    purchasedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    currentBidder: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    likedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    biddingEndsAt: {
      type: Date,
    },
    // bids: [
    //   {
    //     user: {
    //       type: Schema.Types.ObjectId,
    //       ref: "User",
    //       required: true,
    //     },
    //     amount: {
    //       type: Schema.Types.ObjectId,
    //       required: true,
    //     },
    //     time: {
    //       type: Date,
    //       default: Date.now,
    //     },
    //   },
    // ],
    // room: {
    //   type: Schema.Types.ObjectId,
    //   ref: "room",
    // },
  },
  { minimize: false,timestamps: true }
);
//minimize option is used within a schema to control whether empty objects (objects with no properties) should be saved in the MongoDB documents or not. When minimize is set to false, Mongoose will store empty objects in the documents, while setting it to true (which is the default) will remove empty objects when saving.

// 3. Create a Model.
const Ad = model<IAd>("Ad", adSchema);

export default Ad;
