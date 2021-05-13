import axios from 'axios'
import {
  USER_CHATLIST_REQUEST,
  USER_CHATLIST_SUCCESS,
  USER_CHATLIST_FAIL,
  USER_CHATLIST_ITEM_CLICK,
  USER_MESSAGE_SENDING_REQUEST,
  USER_MESSAGE_SENDING_SUCCESS,
  USER_MESSAGE_SENDING_FAIL,
  USER_MESSAGE_RECEIVE,
  USER_CHATLIST_UPDATE,
} from '../constants/userChatConstants'

export const setSelectedChat = (chatId) => (dispatch) => {
  try{
    dispatch({
      type: USER_CHATLIST_ITEM_CLICK,
      payload: chatId
    })
    //console.log(chatId)
  }catch(error){
    console.log("setSelectedChatErr"+error.message)
  }
}

export const updateChatList = (updatedChatlist) => async (dispatch) =>{
  try{
    dispatch({
      type: USER_CHATLIST_UPDATE,
      payload: updatedChatlist
    })
    //console.log(chatId)
  }catch(error){
    console.log("Chatlist update error"+error.message)
  }
}

export const getChatList = (userId) => async (dispatch) => {
    try {
      dispatch({
        type: USER_CHATLIST_REQUEST,
      })
  
  
      //const userId = userInfo._id
      const { data } = await axios.get(
        `/api/chatlist/${userId}`
      )

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const tmp = data
      var chatlist = []
      for(var chat of tmp){
        const _id = chat._id
        const seller = (await axios.get(`/api/users/userinfo/${chat.sellerId}`)).data
        const buyer = (await axios.get(`/api/users/userinfo/${chat.buyerId}`)).data
        const product = (await axios.get(`/api/products/${chat.productId}`)).data
        var messages = []
        for(var msg of chat.messages){
          var srcUser = {}
          var destUser = {}
          if(seller._id==msg.srcUser){
            srcUser = seller
            destUser = buyer
          }else{
            srcUser = buyer
            destUser = seller
          }
          const msgContent = msg.msgContent
          //const msgTime = msg.msgTime
          const msgTime = Date.now()
          messages.push({srcUser,destUser,msgContent,msgTime})
        }
        chatlist.push({_id,seller,buyer,product,messages})
      }

      //console.log(chatlist)
      dispatch({
        type: USER_CHATLIST_SUCCESS,
        payload: chatlist,
      })
      //console.log(JSON.stringify(data[0]._id))
      //localStorage.setItem('chatList', JSON.stringify(chatlist))
      //console.log(JSON.stringify(data[0]._id))
      //localStorage.setItem('selectedChat',JSON.stringify(data[0]._id))
      //console.log("selected"+localStorage.getItem("selectedChat"))
    } catch (error) {
      dispatch({
        type: USER_CHATLIST_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  }

  export const sendMessage = (chatId,srcUser,destUser,msgContent) => async(dispatch) => {
    try {
      dispatch({
        type: USER_MESSAGE_SENDING_REQUEST,
      })

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }
  
      //const userId = userInfo._id
      const { data } = await axios.post(
        '/api/chatlist',
        {
          chatId,
          message:{srcUser, destUser, msgContent},
        },
        config
      )
  
      dispatch({
        type: USER_MESSAGE_SENDING_SUCCESS,
        payload: data,
      })
      localStorage.setItem('chatList', JSON.stringify(data))

    } catch (error) {
      dispatch({
        type: USER_MESSAGE_SENDING_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  }
