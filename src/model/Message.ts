
import { Schema, model } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
interface IMessage {
  sender: object;
  content: string;
  chat: object;
}

// 2. Create a Schema corresponding to the document interface.
const messageSchema = new Schema<IMessage>(
  {
    sender: { type:Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: {type: Schema.Types.ObjectId, ref: "Chat"},  //Chat table ar _id
  },
  { timestamps: false }
);
//minimize option is used within a schema to control whether empty objects (objects with no properties) should be saved in the MongoDB documents or not. When minimize is set to false, Mongoose will store empty objects in the documents, while setting it to true (which is the default) will remove empty objects when saving.

// 3. Create a Model.
const Message = model<IMessage>("Message", messageSchema);

export default Message;
