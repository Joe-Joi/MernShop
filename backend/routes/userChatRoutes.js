import express from 'express'
const router = express.Router()
import {getChatList,getChat} from '../controllers/userChatController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/:userId').get(getChatList)

router.route('/chat').post(getChat)
export default router