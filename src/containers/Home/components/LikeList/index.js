import React, { Component } from "react";
import LikeItem from "../LikeItem";
import Loading from "../../../../components/Loading";
import "./style.css";

class LikeList extends Component {
  myRef = React.createRef(null);

  timer;

  removeListener = false;

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    this.props.fetchData();
  }

  componentDidUpdate() {
    if (this.props.pageCount >= 3 && !this.removeListener) {
      this.removeListener = true;
      window.removeEventListener("scroll", this.handleScroll);
    }
  }

  componentWillUnmount() {
    if (!this.removeListener) {
      window.removeEventListener("scroll", this.handleScroll);
    }
  }

  handleScroll = () => {
    const clientHeight =
      document.documentElement.clientHeight || document.body.clientHeight;
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    const offsetTop = this.myRef.current.offsetTop;
    const offsetHeight = this.myRef.current.offsetHeight;

    if (scrollTop >= offsetTop + offsetHeight - clientHeight) {
      this.props.fetchData();
    }
  };

  render() {
    const { data, pageCount } = this.props;
    console.log(234, data);
    
    return (
      <div ref={this.myRef} className="likeList">
        <div className="likeList__header">猜你喜欢</div>
        <div className="likeList__list">
          {data.map(item => (
            <LikeItem key={item.id} data={item} />
          ))}
        </div>
        {pageCount < 3
          ?  <Loading />
          :  (
            <a className="likeList__viewAll">
              查看更多
            </a>
          )
        }
      </div>
    );
  }
}

export default LikeList;
