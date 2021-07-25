import React from 'react';
// import './App.css';
import { Select, message, Button } from 'antd';
// import Login from './login.js';

const { Option } = Select;


class Message extends React.Component {
  constructor(props) {
    // props: <Message>
    // props.message, props.media
    super(props);

    this.state = {
    }
    console.log(this.props)
  }

  componentDidMount = async () => {}
  render() {
    return (
      <div>
        <div>{this.props.message}</div>
        {/* <div>{this.props.media}</div> */}
      </div>
    )
  }
}

export default Message;
