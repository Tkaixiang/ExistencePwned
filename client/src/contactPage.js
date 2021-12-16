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
        return (
            <div className="empty-notification-badge"></div>
        ); 
    }
    return ( 
        <div className="notification-badge"><span className="notification-badge-number">{count}</span></div>
    )
}

const Contact = (props) => {
    return (
        <div className="indiv-contact">
            <img className='dp' src={displayPicture} /> 
            <div className="contact-username">{props.username}</div>
            <Badge count={props.notifications}></Badge>
        </div>
    )
}

const ContactHeader = (props) => {
    return (
        <Row className="app-header">
            <img className="settings-img" src={settingsCog} onClick={props.handleSettings}/>
            <span className="app-header-title">Telegrammarly</span>
            <div className="app-header-right"></div>
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
        this.setState({chat: false, settings: false}); 
    }

    handleSettings = () => { 
        this.setState({ settings: true }); 
    }

    render() {

        return (
            <div style={{ "backgroundColor": "#ccd1dc", width: "100%"}}>

                {!this.state.chat && !this.state.settings && (
                    <div className="contact-page">
                        <ContactHeader handleSettings={this.handleSettings} />
                        
                        <div className="contact-list">
                        {this.props.dialog
                            .map((contact) => (
                                <div  onClick={() => this.handleContact(contact.id, contact.lastID, contact.name)}>
                                    <Contact key={contact.id} username={contact.name} notifications={contact.unread} />
                                </div>
                            ))}
                        </div> 


                        <div className="new-chat-container" style={{right: "0px", left: "0px"}}>
                            <img className="new-chat-img" src={newChat} />
                            <span className="new-chat" >New Chat</span>
                        </div>
                    </div>
                )}

                {this.state.chat && (
                    <Chat selected={this.state.selected} name={this.state.selectedName} client={this.props.client} userid={this.state.userid} handleBack={this.handleBack.bind(this)} />
                )}

                {!this.state.chat && this.state.settings && ( 
                    <Settings handleLogout={this.props.handleLogout} handleBack={this.handleBack.bind(this)}/> 
                )}

            </div>



        )
    }
}

export default ContactPage;