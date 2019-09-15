import { combineReducers } from 'redux';
import url from '../../utils/url';
import { FETCH_DATA } from "../middleware/api";
import { schema as shopSchema, getShopById } from './entities/shops';
import { schema as productSchema, getProductDetail, getProductById } from './entities/products';

export const types = {
  // 定义获取产品详情的action type
  FETCH_PRODUCT_DETAIL_REQUEST: 'DETAIL/FETCH_PRODUCT_DETAIL_REQUEST',
  FETCH_PRODUCT_DETAIL_SUCCESS: 'DETAIL/FETCH_PRODUCT_DETAIL_SUCCESS',
  FETCH_PRODUCT_DETAIL_FAILURE: 'DETAIL/FETCH_PRODUCT_DETAIL_FAILURE',
  // 获取关联店铺信息
  FETCH_SHOP_REQUEST: 'DETAIL/FETCH_SHOP_REQUEST',
  FETCH_SHOP_SUCCESS: 'DETAIL/FETCH_SHOP_SUCCESS',
  FETCH_SHOP_FAILURE: 'DETAIL/FETCH_SHOP_FAILURE',
}

const initialState = {
  product: {
    isFetching: false,
    id: null,
  },
  relatedShop: {
    isFetching: false,
    id: null,
  }
}

// action creater
export const actions = {
  loadProductDetail: id => {
    // 获取产品详情
    return (dispatch, getState) => {
      const product = getProductDetail(getState(), id);
      if (product) {
        return dispatch(fetchProductDetailSuccess(id));
      }
      const endpoint = url.getProductDetail(id);
      return dispatch(fetchProductDetail(endpoint, id));
    }
  },
  loadShopById: id => {
    // 获取店铺信息
    return (dispatch, getState) => {
      const shop = getShopById(getState(), id);
      if (shop) {
        return dispatch(fetchShopSuccess(id));
      }
      const endpoint = url.getShopById(id);
      return dispatch(fetchShop(endpoint, id));
    }
  }
}

const fetchProductDetail = (endpoint, id) => ({
  [FETCH_DATA]: {
    types: [
      types.FETCH_PRODUCT_DETAIL_REQUEST,
      types.FETCH_PRODUCT_DETAIL_SUCCESS,
      types.FETCH_PRODUCT_DETAIL_FAILURE
    ],
    endpoint,
    schema: productSchema,
  },
  id,
})

const fetchProductDetailSuccess = id => ({
  type: types.FETCH_PRODUCT_DETAIL_SUCCESS,
  id,
})

const fetchShop = (endpoint, id) => ({
  [FETCH_DATA]: {
    types: [
      types.FETCH_SHOP_REQUEST,
      types.FETCH_SHOP_SUCCESS,
      types.FETCH_SHOP_FAILURE
    ],
    endpoint,
    schema: shopSchema,
  },
  id,
})

const fetchShopSuccess = id => ({
  type: types.FETCH_SHOP_SUCCESS,
  id,
})

const product = (state = initialState.product, action) => {
  console.log('54674', action);

  switch (action.type) {
    case types.FETCH_PRODUCT_DETAIL_REQUEST:
        return {
          ...state,
          isFetching: true,
        }
    case types.FETCH_PRODUCT_DETAIL_SUCCESS:
      return {
        ...state,
        isFetching: false,
        id: action.id,
      }
    case types.FETCH_PRODUCT_DETAIL_FAILURE:
      return {
        ...state,
        isFetching: false,
      }
    default:
      return state;
  }
}

const relatedShop = (state = initialState.relatedShop, action) => {
  switch (action.type) {
    case types.FETCH_SHOP_REQUEST:
        return {
          ...state,
          isFetching: true,
        }
    case types.FETCH_SHOP_SUCCESS:
      return {
        ...state,
        isFetching: false,
        id: action.id,
      }
    case types.FETCH_SHOP_FAILURE:
      return {
        ...state,
        isFetching: false,
      }
    default:
      return state;
  }
}

const reducer = combineReducers({
  product,
  relatedShop,
})

export default reducer;

// selector
// 获取商品详情信息
export const getProduct = (state, id) => {
  return getProductDetail(state, id);
}

// 关联的店铺信息
export const getRelatedShop = (state, productId) => {
  // const product = state.entities.product[productId]; // 应避免直接通过state获取领域实体内容，最好通过product领域实体中的selector获取
  const product = getProductById(state, productId);
  let shopId = product ? product.nearestShop : null;
  if (shopId) {
    return getShopById(state, shopId);
  }
  return null;
}