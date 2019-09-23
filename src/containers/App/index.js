import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import ErrorToast from '../../components/ErrorToast';
import { actions as appActions, getError } from "../../redux/modules/app";
import PrivateRoute from '../PrivateRoute';
import AsyncComponent from "../../utils/AsyncComponent";

const Home = AsyncComponent(() => import("../Home"));
const ProductDetail = AsyncComponent(() => import("../ProductDetail"));
const Search = AsyncComponent(() => import("../Search"));
const SearchResult = AsyncComponent(() => import("../SearchResult"));
const Login = AsyncComponent(() => import("../Login"));
const User = AsyncComponent(() => import("../User"));
const Purchase = AsyncComponent(() => import("../Purchase"));

function App({
  error,
  appActions: { clearError }
}) {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={Login} />
          <PrivateRoute path="/user" component={User} />
          <Route path="/detail/:id" component={ProductDetail} />
          <Route path="/search" component={Search} />
          <Route path="/search_result" component={SearchResult} />
          <PrivateRoute path="/purchase/:id" component={Purchase} />
          <Route path="/" component={Home}/>
        </Switch>
      </BrowserRouter>
      {error && <ErrorToast msg={error} clearError={clearError} />}
    </div>
  );
}

const mapStateToProps = (state, props) => {
  return {
    error: getError(state),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
