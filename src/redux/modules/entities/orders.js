import createReducer from "../../../utils/createReducer";

export const schema = {
  name: 'orders',
  id: 'id',
}

export const USED_TYPE = 1; // 已消费
export const TO_PAY_TYPE = 2; //待付款
export const AVAILABLE_TYPE = 3; //可使用
export const REFUND_TYPE = 4; //退款

export const types = {
  // 删除订单
  DELETE_ORDER: "ORDERS/DELETE_ORDER",
  // 新增评价
  ADD_COMMENT: "ORDERS/ADD_COMMENT",
  //增加订单
  ADD_ORDER: "ORDERS/ADD_ORDER",
}

let orderIdCounter = 10;

export const actions = {
  deleteOrder: (orderId) => ({
    type: types.DELETE_ORDER,
    orderId,
  }),
  addComment: (orderId, commentId) => ({
    type: types.ADD_COMMENT,
    orderId,
    commentId,
  }),
  //增加订单
  addOrder: order => {
  const orderId = `o-${orderIdCounter++}`;
  return {
    type: types.ADD_ORDER,
    orderId,
    order: {...order, id: orderId}
  }
}
}

const reducer = (state = {}, action) => {
  switch (action.type) {
    case types.DELETE_ORDER:
      const { [action.orderId]: deleteOrder, ...restOrder } = state;
      return restOrder;
    case types.ADD_COMMENT:
      return {
        ...state,
        [action.orderId]: {
          ...state[action.orderId],
          commentId: action.commentId,
        }
      }
    case types.ADD_ORDER:
      return {
        ...state,
        [action.orderId]: action.order
      }
    default:
      return createReducer(schema.name)(state, action);
  }
}

export default reducer;

export const getOrderById = (state, id) => {
  return state.entities.orders[id];
}
