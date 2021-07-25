import React from 'react';
// import './App.css';
import { Select, message, Button } from 'antd';
// import Login from './login.js';

const { Option } = Select;


class Audio extends React.Component {
  constructor(props) {
    // props: <Audio>
    // props.Audio, props.media
    super(props);

    this.state = {
    };
    
  }

  componentDidMount = async () => {console.log(this.props);}
  render() {
    return (
      <div>
        <div>{this.props.content}</div>
        {/* <div>{this.props.media}</div> */}
      </div>
    )
  }
}

export default Audio;
