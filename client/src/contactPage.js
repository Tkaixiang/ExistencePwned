import React from 'react';
import { message, Image, Row, Col } from 'antd';
import { NavBar, Icon, WingBlank, Button, WhiteSpace } from 'antd-mobile';
import {
    SettingFilled
} from '@ant-design/icons';
import 'antd-mobile/dist/antd-mobile.css';
import './contactPage.css';
import './general.css';

import Chat from './page/Chat.js';
import Settings from './page/Settings.js'; 

import newChat from './asset/new-chat.png'; 
import displayPicture from './asset/logo.png'; 
import settingsCog from './asset/cog.png'

import * as gramjs from './gramjs.js';
const { Api } = gramjs


const Badge = ({ count }) => { 
    if (count === 0){ 
        return null; 
    }
    return ( 
        <div className="notification-badge"><span className="notification-badge-number">{count}</span></div>
    )
}

const Contact = (props) => {
    return (
        <Row gutter={[24, 48]} className="indiv-contact" style={{ "textAlign": "center"}}>
            <Col span={6}><Image
                className='dp'
                src={displayPicture}
            />
            </Col>
            <Col span={14}><h2 className="contact-username">{props.username}</h2></Col>
            <Col span={4}><Badge count={props.notifications} /></Col>
        </Row>
    )
}

const ContactHeader = (props) => {
    return (
        <Row className="app-header">
            <img className="settings-img" src={settingsCog} onClick={props.handleSettings}/><h2 className="app-header-title">Telegrammarly</h2>
        </Row>
    )
}

class ContactPage extends React.Component {

    constructor(props) {
        super(props);
        //this.handleContact = this.handleContact.bind(this);

        this.state = {
            contacts: [],
            chat: false,
            selected: "", 
            settings: false
        };
    };

    componentDidMount = async () => {
        console.log(this.props.dialog)
    }

    handleContact = async (id, lastID, name) => {
        console.log(id)
        let userid = await this.props.client.getMe().id
        this.setState({ chat: true, selected: id, selectedName: name, userid: userid })
        this.props.readMsgs(id)

        
        const result = await this.props.client.invoke(new Api.messages.ReadHistory({
            peer: id,
            maxId: lastID,
          }))
        console.log(result)
    }

    handleBack() {
        console.log("hi")
        this.setState({chat: false})
    }

    handleSettings = () => { 
        this.setState({ settings: true }); 
    }

    render() {

        return (
            <div style={{ "backgroundColor": "#ccd1dc", width: "100%"}}>

                {!this.state.chat && !this.state.settings && (
                    <div>
                        <ContactHeader handleSettings={this.handleSettings} />

                        {this.props.dialog
                            .map((contact) => (
                                <div  onClick={() => this.handleContact(contact.id, contact.lastID, contact.name)} style={{marginTop: "15vh", marginBottom: "22vh"}}>
                                    <Contact  className="all-contacts" key={contact.id} username={contact.name} notifications={contact.unread} />
                                </div>
                            ))}


                        <Row className="new-chat-container">
                            <img className="new-chat-img" src={newChat} /><h2 className="new-chat" >New Chat</h2>
                        </Row>
                    </div>
                )}

                {this.state.chat && (
                    <Chat selected={this.state.selected} name={this.state.selectedName} client={this.props.client} userid={this.state.userid} handleBack={this.handleBack.bind(this)} />
                )}

                {!this.state.chat && this.state.settings && ( 
                    <Settings handleLogout={this.props.handleLogout} /> 
                )}

            </div>



        )
    }
}

export default ContactPage;