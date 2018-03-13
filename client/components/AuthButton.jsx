import React from 'react';
import { Button, Icon } from 'semantic-ui-react';


class AuthButton extends React.Component {

  login() {
    this.props.auth.login();
  }
  logout() {
    this.props.auth.logout();
  }

  render() {
    const { isAuthenticated } = this.props.auth;
    // Equivalent to isAuthenticated = this.props.auth.isAuthenticated

    return (
      <div>
        { !isAuthenticated() && ( <Button onClick={this.login.bind(this)} color="blue"><Icon name="sign in"/>Sign Up/In</Button> ) }
        { isAuthenticated() && ( <Button onClick={this.logout.bind(this)} color="blue"><Icon name="sign out"/>Sign Out</Button> ) }
      </div>
    );
  }
}

export default AuthButton;