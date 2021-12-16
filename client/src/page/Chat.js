import React from 'react';
import { Row } from 'antd';
import Message from '../component/Message.js';
import Audio from '../component/Audio.js';
// import dotenv from 'dotenv';
// dotenv.config();
// .env doesn't work??
// import { Layout } from 'antd';
import microphone from '../asset/microphone.png';
// import { Avatar, Image, Button } from 'antd';
// const { Header, Footer, Sider, Content } = Layout;
import { Badge, Button, Card, Icon, Flex, WingBlank, NavBar, WhiteSpace } from 'antd-mobile';
import './Chat.css';
import playbutton from '../asset/playbutton.png';
import volume from '../asset/volume.png';
import mic1 from '../asset/mic1.png';
import mic2 from '../asset/mic2.png';
import mic3 from '../asset/mic3.png';
import emojiimg from '../asset/emoji-img.png';
import backarrow from '../asset/back-arrow.png';
import * as gramjs from '../gramjs.js';

const messages = [{ text: "Morning" }, { text: "What did you eat for breakfast?" }]

var synth = window.speechSynthesis;
var recordedChunks = []
var mediaRecorder = null
var userid = 0

const { TelegramClient } = gramjs
const { NewMessage } = TelegramClient.events

class Chat extends React.Component {
  constructor(props) {
    // props: <VirtualChat>
    super(props);

    this.state = {
      messages: [],
      recording: false,
      display: "#e7c88c"
    }
  }

  componentDidMount = async () => {
    let msgs = await this.props.client.getMessages(this.props.selected, { limit: 999 })
    console.log(this.props.selected)
    this.setState({ messages: msgs })

    await this.props.client.addEventHandler((event) => {
      let messages = this.state.messages
      const message = event.message
      console.log(message._senderId === this.props.selected)
      if (message._senderId === this.props.selected) {
        messages.unshift(message)
        this.setState({ messages: messages })
      }



    }, new NewMessage({}))

  }

  handleTTS(e, inputTxt) {
    // if (synth.speaking) {
    //   console.error('speechSynthesis.speaking');
    //   return;
    // }
    if (inputTxt !== '') {
      var utterThis = new SpeechSynthesisUtterance(inputTxt);
      utterThis.onend = function (event) {
        console.log('SpeechSynthesisUtterance.onend');
      }
      utterThis.onerror = function (event) {
        console.error('SpeechSynthesisUtterance.onerror');
      }
    }
    utterThis.rate = 0.75;
    synth.speak(utterThis);
  }

  handleSuccess = (stream) => {

    const options = { mimeType: 'audio/webm' };
    recordedChunks = [];
    mediaRecorder = new MediaRecorder(stream, options);

    mediaRecorder.addEventListener('dataavailable', function (e) {
      if (e.data.size > 0) {
        console.log(e.data)
        recordedChunks.push(e.data);
      }

    });

    mediaRecorder.onstop = async () => {
      this.setState({ recording: false })
      const file = new File([new Blob(recordedChunks)], "recording.ogg", { 'type': 'audio/ogg; codecs=opus' });
      const test = await this.props.client.uploadFile({ file: file, workers: 1 })
      const test2 = await this.props.client.sendFile(this.props.selected, { file: test, voiceNote: true })
      console.log(test2)
      console.log('file sent')
    }

    mediaRecorder.start();
    this.setState({ recording: true })
  };

  recordAudio() {

    if (!this.state.recording) {
      this.setState({ display: "#6e9e7a" });
      navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(this.handleSuccess.bind(this));
    }
    else {
      this.setState({ display: "#e7c88c" });
      mediaRecorder.stop()
    }

  }

  downloadAudio = async (id) => {
    const result = await this.props.client.getMessages(this.props.selected, {
      ids: id // the id of the message you want to download
    });
    const media = result[0].media;
    if (media) {
      const buffer = await this.props.client.downloadMedia(media, {
        workers: 1,
      });
      var arrayBuffer = new ArrayBuffer(buffer.length);
      var bufferView = new Uint8Array(arrayBuffer)
      for (let i = 0; i < buffer.length; i++) {
        bufferView[i] = buffer[i];
      }
      const context = new AudioContext();
      context.decodeAudioData(arrayBuffer, function (buffer) {
        let buf = buffer;
        // Create a source node from the buffer
        var source = context.createBufferSource();
        source.buffer = buf;
        // Connect to the final output node (the speakers)
        source.connect(context.destination);
        // Play immediately
        source.start(0);
      });
    }
  }

  render() {

    return (
      <div>
        <NavBar
          className="navigationBar"
          icon={<Icon type="left" />}
          onLeftClick={() => { this.props.handleBack() }}
        >
          {this.props.name}
        </NavBar>
          {this.state.messages.map((obj, i) => {
            if (obj.senderId !== this.props.userid) {
              if (obj.text === "" && obj.flags !== 770 && obj.flags !== 544) {

                return (<div>
                  <WingBlank>
                    <WhiteSpace size="sm" />
                    <Flex>
                      <Flex.Item style={{ marginLeft: '0px', marginRight: '0px' }} >
                        <Card className="messageContent">
                          <Card.Body
                            inline
                          >
                            <p>This message type is currently unsupported</p>
                          </Card.Body>
                        </Card>
                      </Flex.Item>

                      <Flex.Item style={{ marginLeft: '0px', marginRight: '0px' }}>
                        <Card className="messageAudio">
                          <Card.Body
                            inline
                          >
                            {<img src={volume} alt="Audio" width="50" height="41" class="center" />}
                          </Card.Body>
                        </Card>
                      </Flex.Item>
                    </Flex>
                    <WhiteSpace size="sm" />
                  </WingBlank>

                </div>)
              }

              else if (obj.flags === 770 || obj.flags === 544) {
                return (<div>

                  <WingBlank>
                    <WhiteSpace size="sm" />
                    <Flex>
                      <Flex.Item style={{ marginLeft: '0px', marginRight: '0px' }} >
                        <Card className="messageContent">
                          <Card.Body
                            inline
                          >
                            <b>Audio Message</b>
                          </Card.Body>
                        </Card>
                      </Flex.Item>

                      <Flex.Item style={{ marginLeft: '0px', marginRight: '0px' }}>
                        <Card className="messageAudio">
                          <Card.Body
                            inline
                            onClick={(e) => this.downloadAudio(obj.id)}
                          >
                            {<img src={volume} alt="Audio" width="50" height="41" class="center" />}
                          </Card.Body>
                        </Card>
                      </Flex.Item>
                    </Flex>
                    <WhiteSpace size="sm" />
                  </WingBlank>

                </div>)
              }

              else {
                return (
                  <div>

                    <WingBlank>
                      <WhiteSpace size="sm" />
                      <Flex>
                        <Flex.Item style={{ marginLeft: '0px', marginRight: '0px' }} >
                          <Card className="messageContent">
                            <Card.Body
                              inline
                            >
                              {obj.text}
                            </Card.Body>
                          </Card>
                        </Flex.Item>

                        <Flex.Item style={{ marginLeft: '0px', marginRight: '0px' }}>
                          <Card className="messageAudio">
                            <Card.Body
                              inline
                              onClick={(e) => this.handleTTS(e, obj.text)}
                            >
                              {<img src={volume} alt="Audio" width="50" height="41" class="center" />}
                            </Card.Body>
                          </Card>
                        </Flex.Item>
                      </Flex>
                      <WhiteSpace size="sm" />
                    </WingBlank>

                  </div>
                )
              }
            }
            else {
              if (obj.text === "" && obj.flags !== 770 && obj.flags !== 544) {

                return (<div>
                  <WingBlank>
                    <WhiteSpace size="sm" />
                    <Flex>
                      <Flex.Item style={{ marginLeft: '0px', marginRight: '0px' }} >
                        <Card className="messageContent">
                          <Card.Body
                            inline
                            style={{ backgroundColor: "#52c41a" }}
                          >
                            <p>This message type is currently unsupported</p>
                          </Card.Body>
                        </Card>
                      </Flex.Item>

                      <Flex.Item style={{ marginLeft: '0px', marginRight: '0px' }}>
                        <Card className="messageAudio">
                          <Card.Body
                            inline
                          >
                            {<img src={volume} alt="Audio" width="50" height="41" class="center" />}
                          </Card.Body>
                        </Card>
                      </Flex.Item>
                    </Flex>
                    <WhiteSpace size="sm" />
                  </WingBlank>

                </div>)
              }

              else if (obj.flags === 770 || obj.flags === 544) {
                return (<div>

                  <WingBlank>
                    <WhiteSpace size="sm" />
                    <Flex>
                      <Flex.Item style={{ marginLeft: '0px', marginRight: '0px' }} >
                        <Card className="messageContent">
                          <Card.Body
                            inline
                            style={{ backgroundColor: "#52c41a" }}
                          >
                            <b>Audio Message</b>
                          </Card.Body>
                        </Card>
                      </Flex.Item>

                      <Flex.Item style={{ marginLeft: '0px', marginRight: '0px' }}>
                        <Card className="messageAudio">
                          <Card.Body
                            inline
                            onClick={(e) => this.downloadAudio(obj.id)}
                          >
                            {<img src={volume} alt="Audio" width="50" height="41" class="center" />}
                          </Card.Body>
                        </Card>
                      </Flex.Item>
                    </Flex>
                    <WhiteSpace size="sm" />
                  </WingBlank>

                </div>)
              }

              else {
                return (
                  <div>

                    <WingBlank>
                      <WhiteSpace size="sm" />
                      <Flex>
                        <Flex.Item style={{ marginLeft: '0px', marginRight: '0px' }} >
                          <Card className="messageContent">
                            <Card.Body
                              inline
                              style={{ backgroundColor: "#52c41a" }}
                            >
                              {obj.text}
                            </Card.Body>
                          </Card>
                        </Flex.Item>

                        <Flex.Item style={{ marginLeft: '0px', marginRight: '0px' }}>
                          <Card className="messageAudio">
                            <Card.Body
                              inline
                              onClick={(e) => this.handleTTS(e, obj.text)}
                            >
                              {<img src={volume} alt="Audio" width="50" height="41" class="center" />}
                            </Card.Body>
                          </Card>
                        </Flex.Item>
                      </Flex>
                      <WhiteSpace size="sm" />
                    </WingBlank>

                  </div>
                )
              }
            }



          }
          )}
        <div className="input-panel">
          <div className="inputButton">
            <img src={emojiimg} alt="Emoji_Image" className="buttonContent" style={{width: "74px"}}/>
          </div>
          <div className="inputButton">
            <img src={microphone} alt="Microphone" className="buttonContent" style={{width: "41px"}}/>
          </div>
        </div>
      </div>
    )
  }
}

export default Chat;