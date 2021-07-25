import React from 'react';
import { Input, Button, Layout, message, Icon } from 'antd';
import {
    UserOutlined,
} from '@ant-design/icons';
import * as gramjs from './gramjs.js';

const { TelegramClient } = gramjs
const { StringSession } = gramjs.sessions

class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            phoneNo: false,
            password: false,
            phoneCode: false,
        };
    }

    phoneNoCallback() {
        this.setState({ phoneNo: true, password: false, phoneCode: false, loading: false })
        const phoneNoInput = document.getElementById("phoneNoInput");
        const phoneNoButton = document.getElementById("phoneNoButton");
        console.log('phoneNo Callback')
        return new Promise((resolve) => {

            phoneNoButton.addEventListener("click", () => {
                resolve("65" + phoneNoInput.value);
            });
        });


    }

    passwordCallback() {
        this.setState({ phoneNo: false, password: true, phoneCode: false, loading: false })
        const phoneNoInput = document.getElementById("passwordInput");
        const phoneNoButton = document.getElementById("passwordButton");
        console.log('password Callback')
        return new Promise((resolve) => {

            phoneNoButton.addEventListener("click", () => {
                resolve(phoneNoInput.value);
            });
        });
    }

    phoneCodeCallback() {
        this.setState({ phoneNo: false, password: false, phoneCode: true, loading: false })
        const phoneNoInput = document.getElementById("phoneCodeInput");
        const phoneNoButton = document.getElementById("phoneCodeButton");
        console.log('phoneCode Callback')
        return new Promise((resolve) => {

            phoneNoButton.addEventListener("click", () => {
                resolve(phoneNoInput.value);
            });
        });
    }



    componentDidMount = async () => {
        console.log('hi')

        const stringSession = new StringSession("")

        const client = new TelegramClient(stringSession, apiId, apiHash, {
            connectionRetries: 1
        });
        try {
            await client.start({
                phoneNumber: async () => await this.phoneNoCallback(),
                password: async () => await this.passwordCallback(),
                phoneCode: async () => await this.phoneCodeCallback(),
                onError: (err) => console.log(err),
            })
        }
        catch (e) {
            console.error(e)
            message.error("An unexpected error occurred while connecting you to Telegram")
        }

        const dialogs = await client.getDialogs({})
        const filteredDialogs = dialogs.map((item) => {
            return { name: item.name, unread: item.unreadCount, group: item.isGroup }
          })
        const sessionKey = client.session.save()
        localStorage.setItem('sessionKey', sessionKey)
        this.props.handleLogin(filteredDialogs, sessionKey, client)

    }

    render() {

        return (

            <Layout style={{ maxWidth: "100vw", maxHeight: "100vh", overflow: "hidden", backgroundColor: "rgba(0, 0, 0, 0)" }}>
                <div style={{ display: "flex", flexDirection: "column", backgroundColor: "rgba(0, 0, 0, 0.8)", alignItems: "center", justifyContent: "center", height: "100vh", width: "100vw" }}>
                    <h1 style={{ color: "white", fontSize: "3ch" }}>Sign In <Icon type="unlock" theme="twoTone" /> </h1>
                    {!this.state.phoneNo && !this.state.password && !this.state.phoneCode && (
                        <div>
                            <h1>Loading...</h1>
                        </div>
                    )}
                    {this.state.phoneNo && (
                        <div>

                            <Input id="phoneNoInput" allowClear prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Phone No. (E.g 91234568)" />
                            <Button type="primary" id="phoneNoButton" loading={this.state.loading} onClick={() => { this.setState({ loading: true }) }}>Continue</Button>
                        </div>
                    )}
                    {this.state.password && (
                        <div>
                            <Input id="passwordInput" allowClear prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Telegram Password" />
                            <Button type="primary" id="passwordButton" loading={this.state.loading} onClick={() => { this.setState({ loading: true }) }}>Continue</Button>
                        </div>
                    )}
                    {this.state.phoneCode && (
                        <div>
                            <Input id="phoneCodeInput" allowClear prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Enter login code" />
                            <Button type="primary" id="phoneCodeButton" loading={this.state.loading} onClick={() => { this.setState({ loading: true }) }}>Continue</Button>
                        </div>
                    )}

                </div>
            </Layout>
        );
    }
}

export default Login;
