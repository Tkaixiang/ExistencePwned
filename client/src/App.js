import React from 'react';
import './App.css';
import { message, Button } from 'antd';

import Login from './login.js';
import ContactPage from './contactPage.js';

import Chat from './page/Chat.js';
import * as gramjs from './gramjs.js';

const { Api, TelegramClient } = gramjs
const { StringSession } = gramjs.sessions
const { NewMessage } = TelegramClient.events

//const { Option } = Select;

const production = false;
window.ipAddress = production ? "" : "http://localhost:8000";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sessionKey: null, // temporary 
      logined: true, // temporary setting 
      //contactpage: true, 
      chatting: false,
      id: null,
      loading: true,
      client: null,
      dialog: []
    }
  }

  componentDidMount = async () => {
    message.config({ maxCount: 2 })
    // Handles "remember me" logins
    if (!this.state.sessionKey) {
      const stringSession = localStorage.getItem("sessionKey");

      if (stringSession !== null) {
        const client = new TelegramClient(new StringSession(stringSession), apiId, apiHash, {
          connectionRetries: 1
        });
        await client.connect()
        const dialogs = await client.getDialogs({})
        const filteredDialogs = dialogs.map((item) => {
          return { name: item.name, id: item.id, unread: item.unreadCount, group: item.isGroup, lastID: item.dialog.topMessage }
        })
        console.log(dialogs)
        this.setState({ dialog: filteredDialogs, sessionKey: stringSession, client: client, loading: false }) 
        this.setupListeners(client)
      }
      else {
        this.setState({ loading: false })
      }
    }
  }

  setupListeners(client) {
    client.addEventHandler((event) => { 
      let dialogs = this.state.dialog
      const message = event.message
      const newDialogs = dialogs.map((item) => {
        if (message.senderId === item.id) return { name: item.name, id: item.id, unread: item.unread+1, group: item.group, lastID: item.lastID }
        else return { name: item.name, id: item.id, unread: item.unread, group: item.group, lastID: item.lastID }
      })
      this.setState({dialog: newDialogs})

      console.log(dialogs)
    }, new NewMessage({}))
  }

  handleLogin = async (dialog, sessionKey, client) => {
    this.setState({ dialog: dialog, sessionKey: sessionKey, client: client })
    this.setupListeners(client)
  }

  handleLogout = async (close) => {
    localStorage.removeItem("sessionKey")
    this.setState({ sessionKey: false })

    this.state.client.disconnect()
    message.info({ content: "Logged out successfully" })
  }

  readMsgs(id) {
    let dialogs = this.state.dialog
    const newDialogs = dialogs.map((item) => {
      if (id === item.id) return { name: item.name, id: item.id, unread: 0, group: item.group, lastID: item.lastID }
      else return { name: item.name, id: item.id, unread: item.unread, group: item.group, lastID: item.lastID }
    })
    this.setState({dialog: newDialogs})
  }

  render() {
    return (
      <div>
        {/*Contact Page*/}
        {this.state.sessionKey && (
          <div>
            <ContactPage dialog={this.state.dialog} client={this.state.client} readMsgs={this.readMsgs.bind(this)} handleLogout={this.handleLogout.bind(this)}/>
          </div>
        )}

        {/*Login Page*/}
        {!this.state.loading && !this.state.sessionKey && (
          <Login handleLogin={this.handleLogin.bind(this)} />
        )}


      </div>
    )
  }

}

export default App;
