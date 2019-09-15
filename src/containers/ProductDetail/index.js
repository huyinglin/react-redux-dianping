import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ProductOverview from "./components/ProductOverview";
import ShopInfo from "./components/ShopInfo";
import Detail from "./components/Detail";
import Remark from "./components/Remark";
import BuyButton from "./components/BuyButton";
import Header from "../../components/Header";
import { actions as detailActions, getProduct, getRelatedShop } from '../../redux/modules/detail';

class ProductDetail extends Component {
  componentDidMount() {
    const { product, relatedShop, match, detailActions } = this.props;
    if (!product) {
      detailActions.loadProductDetail(match.params.id);
    } else if (!relatedShop) {
      detailActions.loadShopById(product.nearestShop);
    }
  }

  componentDidUpdate(prevProps) {
    // 第一次获取到产品详情时，需要继续获取关联的店铺信息
    const { product, detailActions } = this.props;
    if (!prevProps.product && product) {
      detailActions.loadShopById(product.nearestShop);
    }
  }

  handleBack = () => {
    this.props.history.goBack();
  };

  render() {
    const { product, relatedShop } = this.props;
    return (
      <div>
        <Header title="团购详情" onBack={this.handleBack} grey />
        {product && <ProductOverview data={product} />}
        {relatedShop && <ShopInfo data={relatedShop} total={product.shopIds.length} />}
        {product && (
          <Fragment>
            <Detail data={product} />
            <Remark data={product} />
            <BuyButton productId={product.id} />
          </Fragment>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const productId = props.match.params.id;
  return {
    product: getProduct(state, productId),
    relatedShop: getRelatedShop(state, productId),
  }
}

const mapDispatchToProps = dispatch => ({
  detailActions: bindActionCreators(detailActions, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductDetail);
