import React from 'react'; 
import { Button } from 'antd';


class Settings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            
        };
    };

    render() { 
        return ( 
            <Button style={{top:"100px", "margin":"10px", "color": "black"}} onClick={this.props.handleLogout}>Logout</Button>
        )
    }

}

export default Settings; 