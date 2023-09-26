import { Schema, model } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
interface IOrder {
  buyerId: object;
  productName: string;
  description: string;
  productPrice: number;
  deliveryCharge: number;
  duration: number;
  pickupPoint: string;
}
// 2. Create a Schema corresponding to the document interface.
const orderSchema = new Schema<IOrder>(
  {
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    productName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    deliveryCharge: {
      type: Number,
      required: true,
    },
    pickupPoint: {
      type: String,
    },
  },
  { timestamps: true }
);
//minimize option is used within a schema to control whether empty objects (objects with no properties) should be saved in the MongoDB documents or not. When minimize is set to false, Mongoose will store empty objects in the documents, while setting it to true (which is the default) will remove empty objects when saving.

// 3. Create a Model.
const Order = model<IOrder>("Order", orderSchema);

export default Order;
