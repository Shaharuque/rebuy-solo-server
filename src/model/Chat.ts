
import { Schema, model } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
interface IChat {
  chatName: string;
  isGroupChat: boolean;
  users: Array<object>;
  latestMessage: object;
  groupAdmin: object;
}

// 2. Create a Schema corresponding to the document interface.
const chatSchema = new Schema<IChat>(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }], //User table ar _id ashbey 
    latestMessage: {type: Schema.Types.ObjectId, ref: "Message"},  //Message table ar _id
    groupAdmin: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
//minimize option is used within a schema to control whether empty objects (objects with no properties) should be saved in the MongoDB documents or not. When minimize is set to false, Mongoose will store empty objects in the documents, while setting it to true (which is the default) will remove empty objects when saving.

// 3. Create a Model.
const Chat = model<IChat>("Chat", chatSchema);

export default Chat;