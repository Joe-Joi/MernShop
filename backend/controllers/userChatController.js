import asyncHandler from 'express-async-handler'
import UserChat from '../models/userChatModel.js'

const getChatList = asyncHandler(async (req, res) => {
    const sellerChat = await UserChat.find({sellerId:req.params.userId});
    const buyerChat = await UserChat.find({buyerId:req.params.userId});
    const chatlist = sellerChat.concat(buyerChat);
    //console.log('请求来了')
    if (chatlist) {
        //console.log(chatlist)
      res.json(
        chatlist
      )
    } else {
      res.status(404)
      throw new Error('chatlist not found')
    }
  })


const getChat = asyncHandler(async (req,res)=>{
  const chatKey = { 
    productId: req.body.product_id, 
    sellerId: req.body.seller_id, 
    buyerId: req.body.buyer_id }
  const chat = await UserChat.findOne(chatKey)
  if(chat){
    res.json(chat)
  }else{
    res.json('none')
  }
})


const createChat = asyncHandler(async(chat)=>{
  let newchat = await UserChat.create(chat)
  return newchat
})

const updateChat = asyncHandler(async (chatId,message) => {
  var chat = await UserChat.findById(chatId)
  if (chat) {
    chat.unread = true;
    chat.messages = chat.messages.concat(message)
    const updatedChat = await chat.save()
  }else{
    return 'failed'
  }
})


export {getChatList,getChat,createChat, updateChat}