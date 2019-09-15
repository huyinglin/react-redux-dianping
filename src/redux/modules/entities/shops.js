import createReducer from '../../../utils/createReducer';

export const schema = {
  name: 'shops', // 当前领域实体是挂载到redux的state中的哪个属性下，一般将命名和领域实体名称保持一至
  id: 'id', // 指定已数据中哪个属性作为id
}

const reducer = createReducer(schema.name);

export default reducer;

// selectors
export const getShopById = (state, id) => {
  return state.entities.shops[id];
}