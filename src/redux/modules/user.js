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
  }
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
}

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
    case types.DELETE_ORDERS_FAILURE:
    case types.DELETE_ORDERS_SUCCESS:
      return initialState.currentOrder;
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

export const getDeletingOrderId = (state) => {
  const { currentOrder } = state.user;
  return currentOrder && currentOrder.isDeleting
    ? currentOrder.id
    : null;
}
