import { combineReducers } from "redux";
import url from '../../utils/url';
import { FETCH_DATA } from "../middleware/api";
import {
  schema,
  TO_PAY_TYPE,
  AVAILABLE_TYPE,
  REFUND_TYPE,
  getOrderById,
  actions as orderActions,
  types as orderTypes,
} from "./entities/orders";
import {
  actions as commentActions,
} from './entities/comments';

const initialState = {
  orders: {
    isFetching: false,
    ids: [],
    toPayIds: [], // 待付款订单id
    availableIds: [], // 可使用的订单id
    refundIds: [], // 退款订单id
  },
  currentTab: 0,
  currentOrder: {
    id: null,
    isDeleting: false,
    isCommenting: false,
    comment: "",
    stars: 0,
  },
}

export const types = {
  //获取订单列表
  FETCH_ORDERS_REQUEST: "USER/FETCH_ORDERS_REQUEST",
  FETCH_ORDERS_SUCCESS: "USER/FETCH_ORDERS_SUCCESS",
  FETCH_ORDERS_FAILURE: "USER/FETCH_ORDERS_FAILURE",
  //设置当选选中的tab
  SET_CURRENT_TAB: "USER/SET_CURRENT_TAB",
  // 删除订单
  DELETE_ORDERS_REQUEST: "USER/DELETE_ORDERS_REQUEST",
  DELETE_ORDERS_SUCCESS: "USER/DELETE_ORDERS_SUCCESS",
  DELETE_ORDERS_FAILURE: "USER/DELETE_ORDERS_FAILURE",
  // 删除确认对话框
  SHOW_DELETE_DIALOG: "USER/SHOW_DELETE_DIALOG",
  HIDE_DELETE_DIALOG: "USER/HIDE_DELETE_DIALOG",
  //评价订单编辑
  SHOW_COMMENT_AREA: "USER/SHOW_COMMENT_AREA",
  HIDE_COMMENT_AREA: "USER/HIDE_COMMENT_AREA",
  //编辑评价内容
  SET_COMMENT: "USER/SET_COMMENT",
  //打分
  SET_STARS: "USER/SET_STARS",
  //提交评价
  POST_COMMENT_REQUEST: "USER/POST_COMMENT_REQUEST",
  POST_COMMENT_SUCCESS: "USER/POST_COMMENT_SUCCESS",
  POST_COMMENT_FAILURE: "USER/POST_COMMENT_FAILURE"
}

export const actions = {
  loadOrders: () => {
    return (dispatch, getState) => {
      const { ids } = getState().user.orders;
      if (ids.length > 0) {
        return null;
      }
      const endpoint = url.getOrders();
      return dispatch(fetchOrders(endpoint));
    }
  },
  setCurrentTab: index => ({
    type: types.SET_CURRENT_TAB,
    index
  }),
  removeOrder: () => {
    return (dispatch, getState) => {
      const { id } = getState().user.currentOrder;
      if (id) {
        dispatch(deleteOrderRequest());
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            dispatch(deleteOrderSuccess(id));
            dispatch(orderActions.deleteOrder(id));
            resolve();
          }, 1000);
        })
      }
    }
  },
  //显示删除对话框
  showDeleteDialog: orderId => ({
    type: types.SHOW_DELETE_DIALOG,
    orderId
  }),
  //隐藏删除对话框
  hideDeleteDialog: () => ({
    type: types.HIDE_DELETE_DIALOG,
  }),
  showCommentArea: (orderId) => ({
    type: types.SHOW_COMMENT_AREA,
    orderId,
  }),
  hideCommentArea: () => ({
    type: types.HIDE_COMMENT_AREA,
  }),
  setComment: (comment) => ({
    type: types.SET_COMMENT,
    comment,
  }),
  setStars: (stars) => ({
    type: types.SET_STARS,
    stars,
  }),
  submitComment: () => {
    return (dispatch, getState) => {
      dispatch(postCommentRequest());
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const { id, comment, starts } = getState().user.currentOrder;
          const commentObj = {
            id: +new Date(),
            comment,
            starts,
          }
          dispatch(postCommentSuccess());
          dispatch(commentActions.addComment(commentObj));
          dispatch(orderActions.addComment(id, commentObj.id));
          resolve();
        }, 1000);
      })
    }
  }
}

const postCommentRequest = () => ({
  type: types.POST_COMMENT_REQUEST,
})

const postCommentSuccess = () => ({
  type: types.POST_COMMENT_SUCCESS,
})

const deleteOrderRequest = () => ({
  type: types.DELETE_ORDERS_REQUEST,
})

const deleteOrderSuccess = (orderId) => ({
  type: types.DELETE_ORDERS_SUCCESS,
  orderId,
})

const fetchOrders = (endpoint) => ({
  [FETCH_DATA]: {
    types: [
      types.FETCH_ORDERS_REQUEST,
      types.FETCH_ORDERS_SUCCESS,
      types.FETCH_ORDERS_FAILURE
    ],
    endpoint,
    schema
  }
})

const orders = (state = initialState.orders, action) => {
  switch (action.type) {
    case types.FETCH_ORDERS_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case types.FETCH_ORDERS_SUCCESS:
      const toPayIds = action.response.ids.filter(
        id => action.response.orders[id].type === TO_PAY_TYPE
      );
      const availableIds = action.response.ids.filter(
        id => action.response.orders[id].type === AVAILABLE_TYPE
      );
      const refundIds = action.response.ids.filter(
        id => action.response.orders[id].type === REFUND_TYPE
      );
      return {
        ...state,
        isFetching: false,
        ids: [...state.ids, ...action.response.ids],
        toPayIds: [...state.toPayIds, ...toPayIds],
        availableIds: [...state.availableIds, ...availableIds],
        refundIds: [...state.refundIds, ...refundIds],
      }
    case types.FETCH_ORDERS_FAILURE:
      return {
        ...state,
        isFetching: false,
      }
    case orderTypes.DELETE_ORDER:
    case types.DELETE_ORDERS_SUCCESS:
      return {
        ...state,
        ids: removeOrderId(state, 'ids', action.orderId),
        toPayIds: removeOrderId(state, 'toPayIds', action.orderId),
        availableIds: removeOrderId(state, 'availableIds', action.orderId),
        refundIds: removeOrderId(state, 'refundIds', action.orderId),
      }
    default:
      return state;
  }
}

const removeOrderId = (state, key, orderId) => {
  return state[key].filter(id => id !== orderId);
}

const currentTab = (state = initialState.currentTab, action) => {
  switch (action.type) {
    case types.SET_CURRENT_TAB:
      return action.index;
    default:
      return state;
  }
}

const currentOrder = (state = initialState.currentOrder, action) => {
  switch (action.type) {
    case types.SHOW_DELETE_DIALOG:
      return {
        ...state,
        id: action.orderId,
        isDeleting: true,
      }
    case types.HIDE_DELETE_DIALOG:
    case types.HIDE_COMMENT_AREA:
    case types.DELETE_ORDERS_FAILURE:
    case types.DELETE_ORDERS_SUCCESS:
    case types.POST_COMMENT_FAILURE:
    case types.POST_COMMENT_SUCCESS:
      return initialState.currentOrder;
    case types.SHOW_COMMENT_AREA:
      return {
        ...state,
        isCommenting: true,
        id: action.orderId
      }
    case types.SET_COMMENT:
      return {
        ...state,
        comment: action.comment
      }
    case types.SET_STARS:
      return {
        ...state,
        stars: action.stars
      }
    default:
      return state;
  }
}

const reducer = combineReducers({
  orders,
  currentTab,
  currentOrder,
})

export default reducer;

export const getCurrentTab = state => state.user.currentTab;

export const getOrders = state => {
  const { currentTab, orders } = state.user;
  const key = ['ids', 'toPayIds', 'availableIds', 'refundIds'][currentTab];
  return orders[key].map(id => getOrderById(state, id));
}

export const getDeletingOrderId = state => {
  const { currentOrder } = state.user;
  return currentOrder && currentOrder.isDeleting
    ? currentOrder.id
    : null;
}

// 获取正在评价的订单ID
export const getCommentingOrderId = state => {
  const { currentOrder } = state.user;
  return currentOrder && currentOrder.isCommenting
    ? currentOrder.id
    : null;
}

export const getCurrentOrderComment = state => {
  const { currentOrder } = state.user;
  return currentOrder
    ? currentOrder.comment
    : null;
}

export const getCurrentOrderStars = state => {
  const { currentOrder } = state.user;
  return currentOrder
    ? currentOrder.stars
    : 0;
}
