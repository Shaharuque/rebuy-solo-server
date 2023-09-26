import { Schema, model } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
interface ICart {
  productInfo: object;
  userInfo: object;
}
// 2. Create a Schema corresponding to the document interface.
const cartSchema = new Schema<ICart>(
  {
    productInfo: {
      type: Schema.Types.ObjectId,
      ref: "Ad",
    },
    userInfo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
//minimize option is used within a schema to control whether empty objects (objects with no properties) should be saved in the MongoDB documents or not. When minimize is set to false, Mongoose will store empty objects in the documents, while setting it to true (which is the default) will remove empty objects when saving.

// 3. Create a Model.
const Cart = model<ICart>("Cart", cartSchema);

export default Cart;
