import React, { Component } from 'react';
import "./style.css";

class ErrorToast extends Component {
  componentDidMount() {
    this.timer = setTimeout(() => {
      this.props.clearError();
    }, 3 * 1000);
  }

  componentWillUnmount() {
    if(this.timer) {
      clearTimeout(this.timer)
    }
  }

  render() {
    return (
      <div className="errorToast">
        <div className="errorToast__text">
          {this.props.msg}
        </div>
      </div>
    );
  }
}

export default ErrorToast;
