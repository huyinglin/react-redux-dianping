import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import LoginHeader from "./components/LoginHeader";
import LoginForm from "./components/LoginForm";
import { actins as loginAction, getUsername, getPassword, isLogin } from '../../redux/modules/login';

class Login extends Component {
  handleChange = (e) => {
    const { loginAction } = this.props;
    if (e.target.name === 'username') {
      loginAction.setUsername(e.target.value);
    } else if (e.target.name === 'password') {
      loginAction.setPassword(e.target.value);
    }
  }

  handleLogin = () => {
    this.props.loginAction.login();
  }

  render() {
    const { username, password, login } = this.props;
    if (login) {
      return <Redirect to='/user' />;
    }
    return (
      <div>
        <LoginHeader/>
        <LoginForm
          username={username}
          password={password}
          onChange={this.handleChange}
          onLogin={this.handleLogin}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    username: getUsername(state),
    password: getPassword(state),
    login: isLogin(state),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loginAction: bindActionCreators(loginAction, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);