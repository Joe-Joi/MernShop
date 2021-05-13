import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
  productListReducer,
  productDetailsReducer,
  productDeleteReducer,
  productCreateReducer,
  productUpdateReducer,
  productReviewCreateReducer,
  productTopRatedReducer,
  myProductListReducer,
  productStatusUpdateReducer,
} from './reducers/productReducers';
import { cartReducer } from './reducers/cartReducers';
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userListReducer,
  userDeleteReducer,
  userUpdateReducer,
  userSocketReducer,
} from './reducers/userReducers';
import {
  orderCreateReducer,
  orderDetailsReducer,
  orderCompleteReducer,
  orderArrangeReducer,
  orderListMyReducer,
  orderListMySoldReducer,
  orderListReducer,
  orderInfoReducer,
  
} from './reducers/orderReducers';

import {
  userChatListReducer,
  userMessageSendReducer,
  selectedChatReducer
} from './reducers/userChatReducers'

const reducer = combineReducers({
  productList: productListReducer,
  myProductList: myProductListReducer,
  productDetails: productDetailsReducer,
  productDelete: productDeleteReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  productReviewCreate: productReviewCreateReducer,
  productTopRated: productTopRatedReducer,
  productStatusUpdate: productStatusUpdateReducer,
  orderInfo: orderInfoReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderComplete: orderCompleteReducer,
  orderArrange: orderArrangeReducer,
  orderListMy: orderListMyReducer,
  orderListMySold: orderListMySoldReducer,
  orderList: orderListReducer,
  userChatList: userChatListReducer,
  userMessageSend: userMessageSendReducer,
  selectedChat: selectedChatReducer,
  userGlobalSocket:userSocketReducer,
});

// const userInfoFromStorage = localStorage.getItem('userSocket')
//   ? JSON.parse(localStorage.getItem('userSocket'))
//   : null;

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : {};

const initialState = {
  orderInfo: {
    shippingAddress: shippingAddressFromStorage,
  },
  userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
