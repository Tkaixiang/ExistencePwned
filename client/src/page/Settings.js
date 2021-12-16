import React from 'react'; 
import { Button } from 'antd';

import './Settings.css'

import backarrow from '../asset/back-arrow.png';

class Settings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            
        };
    };

    render() { 
        return ( 
            <div className="settings-page">
                <div className="navigation-bar">
                    <img className="backarrow-img" src={backarrow} onClick={this.props.handleBack} />
                    <span className="settings-title">Settings</span>
                    <div className="header-right"></div>
                </div>
                <div className="all-settings">
                    <div className="settings-container"><span className="settings-text">this</span></div>
                    <div className="settings-container"><span className="settings-text">does not</span></div>
                    <div className="settings-container"><span className="settings-text">work</span></div>
                    <div className="settings-container"><span className="settings-text">yet</span></div>
                    <div className="settings-container"><span className="settings-text">donkeys</span></div>
                    <div className="settings-container"><span className="settings-text">horses</span></div>
                    <div className="settings-container" onClick={this.props.handleLogout}><span className="settings-text" style={{color: "#b98966"}}>Logout works though!</span></div>
                </div>
            </div>
        )
    }

}

export default Settings; 