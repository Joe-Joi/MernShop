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


export const selectedChatReducer = (
  state = { selectedChatId: {} },
  action
) => {
  switch (action.type) {
    case USER_CHATLIST_ITEM_CLICK:
      //console.log(selectedChatId)
      return { selectedChatId: action.payload }
    default:
      return state
  }
}



export const userChatListReducer = (
  state = { chatlist: [] },
  action
) => {
  switch (action.type) {
    case USER_CHATLIST_REQUEST:
      return { loading: true }
    case USER_CHATLIST_SUCCESS:
      return {
        loading: false,
        chatlist: action.payload,
      }
    case USER_CHATLIST_FAIL:
      return { loading: false, error: action.payload }
    case USER_CHATLIST_UPDATE:
      return {loading:false, chatlist:action.payload}
    default:
      return state
  }
}

export const userMessageSendReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_MESSAGE_SENDING_REQUEST:
      return { sending: true }
    case USER_MESSAGE_SENDING_SUCCESS:
      return { sending: false, chatlist: action.payload }
    case USER_MESSAGE_SENDING_FAIL:
      return { sending: false, error: action.payload }
    default:
      return state
  }
}
