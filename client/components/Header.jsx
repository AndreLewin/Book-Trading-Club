import React from 'react'
import { Link } from 'react-router-dom'
import { Menu, Icon } from 'semantic-ui-react'

import AuthButton from './AuthButton.jsx';


class Header extends React.Component {
  render() {
    return (
      <Menu stackable inverted style={{"borderRadius": "0px", "margin": "0rem" }}>
        <Menu.Item header onClick={() => {window.location.replace(location.origin)}}>Book Trading Club</Menu.Item>
        { this.props.auth.isAuthenticated() &&
          <React.Fragment>
            {this.props.hasAProfile &&
              <React.Fragment>
                <Menu.Item><Link to="/allbooks"><Icon name="book"/>All books</Link></Menu.Item>
                <Menu.Item><Link to="/mybooks"><Icon name="address book"/>My books</Link></Menu.Item>
                <Menu.Item><Link to="/requests"><Icon name="exchange"/>Requests</Link></Menu.Item>
                <Menu.Item><Link to="/profile"><Icon name="user"/>Profile</Link></Menu.Item>
              </React.Fragment>
            }
          </React.Fragment>
        }
        <Menu.Item style={{padding: "0px"}} position="right"><AuthButton auth={this.props.auth}/></Menu.Item>
      </Menu>
    );
  }
}

export default Header;