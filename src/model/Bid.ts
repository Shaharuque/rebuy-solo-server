import { Schema, model } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
interface IBid {
  productId: object;
  participatedUsers: Array<object>;
  bids: Array<object>;
  bidTimeline: number;
  status: string;
}
// 2. Create a Schema corresponding to the document interface.
const bidSchema = new Schema<IBid>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Ad",
    },
    participatedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    bids: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        time: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    bidTimeline: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);
//minimize option is used within a schema to control whether empty objects (objects with no properties) should be saved in the MongoDB documents or not. When minimize is set to false, Mongoose will store empty objects in the documents, while setting it to true (which is the default) will remove empty objects when saving.

// 3. Create a Model.
const Bid = model<IBid>("Bid", bidSchema);

export default Bid;
