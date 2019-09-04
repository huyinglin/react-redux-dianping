import url from '../../utils/url';
import { FETCH_DATA } from "../middleware/api";
import { combineReducers } from 'redux';
import { schema } from "./entities/products";

export const params = {
  PATH_LIKES: 'likes',
  PATH_DISCOUNTS: 'discounts',
  PAGESIZE_LIKES: 5,
  PAGESIZE_DISCOUNTS: 3,
}

export const types = {
  // 获取猜你喜欢请求
  FETCH_LIKES_REQUEST: 'HOME/FETCH_LIKES_REQUEST',
  // 获取猜你喜欢请求成功
  FETCH_LIKES_SUCCESS: 'HOME/FETCH_LIKES_SUCCESS',
  // 获取猜你喜欢请求失败
  FETCH_LIKES_FAILURE: 'HOME/FETCH_LIKES_FAILURE',
  // 获取超值特惠请求
  FETCH_DISCOUNTS_REQUEST: 'HOME/FETCH_DISCOUNTS_REQUEST',
  FETCH_DISCOUNTS_SUCCESS: 'HOME/FETCH_DISCOUNTS_SUCCESS',
  FETCH_DISCOUNTS_FAILURE: 'HOME/FETCH_DISCOUNTS_FAILURE',
}

const initialState = {
  likes: {
    isFetching: false,
    pageCount: 0,
    ids: [],
  },
  discounts: {
    isFetching: false,
    ids: [],
  }
}

export const actions = {
  loadLikes: () => {
    return (dispatch, getState) => {
      const { pageCount } = getState().home.likes;
      const rowIndex = pageCount * params.PAGESIZE_LIKES;
      const endpoint = url.getProductList(params.PATH_LIKES, rowIndex, params.PAGESIZE_LIKES);
      return dispatch(fetchLikes(endpoint))
    }
  },
  loadDiscounts: () => {
    return (dispatch, getState) => {
      const endpoint = url.getProductList(params.PATH_DISCOUNTS, 0, params.PAGESIZE_DISCOUNTS);
      return dispatch(fetchDiscounts(endpoint));
    }
  }
}

const fetchLikes = (endpoint) => ({
  [FETCH_DATA]: {
    types: [
      types.FETCH_LIKES_REQUEST,
      types.FETCH_LIKES_SUCCESS,
      types.FETCH_LIKES_FAILURE
    ],
    endpoint,
    schema
  }
})

const fetchDiscounts = (endpoint) => ({
  [FETCH_DATA]: {
    types: [
      types.FETCH_DISCOUNTS_REQUEST,
      types.FETCH_DISCOUNTS_SUCCESS,
      types.FETCH_DISCOUNTS_FAILURE
    ],
    endpoint,
    schema
  }
})

const likes = (state = initialState.likes, action) => {
  switch (action.type) {
    case types.FETCH_LIKES_REQUEST:
      return {...state, isFetching: true};
    case types.FETCH_LIKES_SUCCESS:
      return {
        ...state, isFetching: false,
        pageCount: state.pageCount + 1,
        ids: state.ids.concat(action.response.ids),
      };
    case types.FETCH_LIKES_FAILURE:
      return {...state, isFetching: false};
    default:
      return state;
  }
}

const discounts = (state = initialState.discounts, action) => {
  switch (action.type) {
    case types.FETCH_DISCOUNTS_REQUEST:
      return {...state, isFetching: true};
    case types.FETCH_DISCOUNTS_SUCCESS:
      return {...state, isFetching: false, ids: state.ids.concat(action.response.ids)};
    case types.FETCH_DISCOUNTS_FAILURE:
      return {...state, isFetching: false};
    default:
      return state;
  }
}

const reducer = combineReducers({
  likes,
  discounts,
});

export default reducer;
