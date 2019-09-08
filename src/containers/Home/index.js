import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Category from "./components/Category";
import Headline from "./components/Headline";
import Discount from "./components/Discount";
import LikeList from "./components/LikeList";
import HomeHeader from "./components/HomeHeader";
import Footer from "../../components/Footer";
import Banner from "./components/Banner";
import Activity from "./components/Activity";
import {
  actions as homeActions,
  getLikes,
  getDiscounts,
  getPageCountOfLikes
} from "../../redux/modules/home";

class Home extends Component {
  componentDidMount() {
    this.props.homeActions.loadDiscounts();
  }

  render() {
    const { likes, discounts, pageCount, homeActions } = this.props;
    console.log(555, this.props.state);
    
    return (
      <div>
        <HomeHeader />
        <Banner />
        <Category />
        <Headline />
        <Activity />
        <Discount data={discounts}/>
        <LikeList
            data={likes}
            pageCount={pageCount}
            fetchData={homeActions.loadLikes}
        />
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  state,
  likes: getLikes(state),
  discounts: getDiscounts(state),
  pageCount: getPageCountOfLikes(state),
});

const mapDispatchToProps = dispatch => ({
  homeActions: bindActionCreators(homeActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
