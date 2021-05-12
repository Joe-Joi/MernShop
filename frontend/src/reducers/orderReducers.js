import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_COMPLETE_REQUEST,
  ORDER_COMPLETE_FAIL,
  ORDER_COMPLETE_SUCCESS,
  ORDER_COMPLETE_RESET,
  ORDER_LIST_MY_REQUEST,
  ORDER_LIST_MY_SUCCESS,
  ORDER_LIST_MY_FAIL,
  ORDER_LIST_MY_RESET,
  ORDER_LIST_FAIL,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_REQUEST,
  ORDER_ARRANGE_FAIL,
  ORDER_ARRANGE_SUCCESS,
  ORDER_ARRANGE_REQUEST,
  ORDER_ARRANGE_RESET,
  ORDER_CREATE_RESET,
  CART_SAVE_SHIPPING_ADDRESS,
  ORDER_PRODUCT_INFO,
  ORDER_LIST_MY_SOLD_REQUEST,
  ORDER_LIST_MY_SOLD_SUCCESS,
  ORDER_LIST_MY_SOLD_FAIL,
  ORDER_LIST_MY_SOLD_RESET,
  ORDER_CREATE_REVIEW_REQUEST,
  ORDER_CREATE_REVIEW_SUCCESS,
  ORDER_CREATE_REVIEW_FAIL,
  ORDER_CREATE_REVIEW_RESET,
} from '../constants/orderConstants';

export const orderInfoReducer = (state = { shippingAddress: {} }, action) => {
  switch (action.type) {
    case CART_SAVE_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: action.payload,
      };

    case ORDER_PRODUCT_INFO:
      return { ...state, product: action.payload };
    default:
      return state;
  }
};

export const orderCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_CREATE_REQUEST:
      return {
        loading: true,
      };
    case ORDER_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        order: action.payload,
      };
    case ORDER_CREATE_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case ORDER_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const orderDetailsReducer = (
  state = { loading: true, orderItem: {}, shippingAddress: {} },
  action
) => {
  switch (action.type) {
    case ORDER_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ORDER_DETAILS_SUCCESS:
      return {
        loading: false,
        order: action.payload,
      };
    case ORDER_DETAILS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const orderCompleteReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_COMPLETE_REQUEST:
      return {
        loading: true,
      };
    case ORDER_COMPLETE_SUCCESS:
      return {
        loading: false,
        success: true,
      };
    case ORDER_COMPLETE_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case ORDER_COMPLETE_RESET:
      return {};
    default:
      return state;
  }
};

export const orderArrangeReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_ARRANGE_REQUEST:
      return {
        loading: true,
      };
    case ORDER_ARRANGE_SUCCESS:
      return {
        loading: false,
        success: true,
      };
    case ORDER_ARRANGE_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case ORDER_ARRANGE_RESET:
      return {};
    default:
      return state;
  }
};

export const orderListMyReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case ORDER_LIST_MY_REQUEST:
      return {
        loading: true,
      };
    case ORDER_LIST_MY_SUCCESS:
      return {
        loading: false,
        orders: action.payload,
      };
    case ORDER_LIST_MY_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case ORDER_LIST_MY_RESET:
      return { orders: [] };
    default:
      return state;
  }
};

export const orderListMySoldReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case ORDER_LIST_MY_SOLD_REQUEST:
      return {
        loading: true,
      };
    case ORDER_LIST_MY_SOLD_SUCCESS:
      return {
        loading: false,
        orders: action.payload,
      };
    case ORDER_LIST_MY_SOLD_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case ORDER_LIST_MY_SOLD_RESET:
      return { orders: [] };
    default:
      return state;
  }
};

export const orderListReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case ORDER_LIST_REQUEST:
      return {
        loading: true,
      };
    case ORDER_LIST_SUCCESS:
      return {
        loading: false,
        orders: action.payload,
      };
    case ORDER_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const orderReviewCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_CREATE_REVIEW_REQUEST:
      return { loading: true };
    case ORDER_CREATE_REVIEW_SUCCESS:
      return { loading: false, success: true };
    case ORDER_CREATE_REVIEW_FAIL:
      return { loading: false, error: action.payload };
    case ORDER_CREATE_REVIEW_RESET:
      return {};
    default:
      return state;
  }
};
