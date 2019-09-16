import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import ErrorToast from '../../components/ErrorToast';
import { actions as appActions, getError } from "../../redux/modules/app";
import Home from '../Home';
import ProductDetail from '../ProductDetail'
import Search from "../Search";

function App({
  error,
  appActions: { clearError }
}) {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/detail/:id" component={ProductDetail} />
          <Route path="/search" component={Search} />
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
