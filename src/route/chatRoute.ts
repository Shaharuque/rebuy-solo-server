import express from "express";
import { verifyToken } from "../utils/verifyToken";
import { accessChat,fetchChats,createGroupChat } from "../controller/chat";

const router=express.Router()

router.post('/',verifyToken,accessChat)
router.get('/',verifyToken,fetchChats)
router.post('/create/group',verifyToken,createGroupChat)
// router.put('/rename/group',verifyToken,renameGroup)
// router.put('/remove/from/group',verifyToken,removeFromGroup)
// router.put('/add/to/group',verifyToken,addToGroup)



export default router