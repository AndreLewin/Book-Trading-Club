import React from 'react'
import { Switch, Route } from 'react-router-dom'
import axios from 'axios';

import Header from './Header.jsx'
import Home from './Home.jsx'
import AllBooks from './AllBooks.jsx';
import MyBooks from './MyBooks.jsx';
import Requests from './Requests.jsx';
import Profile from './Profile.jsx'
import history from '../history';


class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      hasAProfile: false,
      full_name: null,
      city: null,
      state: null,
    };

    this.props.auth.handleAuthentication();

    // console.log("Authenticated? " + this.props.auth.isAuthenticated());
    // console.log("accessToken? " + localStorage.getItem("accessToken"));
  }

  async componentDidMount() {
    if (this.props.auth.isAuthenticated()) {

      // Search for the profile at the loading of the app, if no profile, redirect (CSR) to the page to set profile
      await axios.get('/searchProfile', { headers: { Authorization: "Bearer "+ localStorage.getItem("idToken") }})
        .then((response) => {

          if (response.data) {
            this.setState({
              hasAProfile: true,
              full_name: response.data.full_name,
              city: response.data.city,
              state: response.data.state,
            });
          } else {
            history.push('/profile')
          }
        })
        .catch((error) => {
          console.log(error)
        });
    }
  }

  // If the user is not authenticated, some routes are disabled and the home component is shown instead
  // If the user is authenticated but has no profile, the profile component is shown instead
  render() {
    return (
      <div>
        <Header auth={this.props.auth} hasAProfile={this.state.hasAProfile} />
          <Switch>
            <Route exact path="/" render={ () => <Home auth={this.props.auth} />} />
            { this.props.auth.isAuthenticated() ?
              <React.Fragment>
                { this.state.hasAProfile ?
                  <React.Fragment>
                    <Route path="/profile" render={ () => <Profile full_name={this.state.full_name} city={this.state.city} state={this.state.state} />}  />
                    <Route path="/allbooks" render={ () => <AllBooks />} />
                    <Route path="/mybooks" render={ () => <MyBooks />} />
                    <Route path="/requests" render={ () => <Requests />} />
                  </React.Fragment> :
                  <Profile full_name={this.state.full_name} city={this.state.city} state={this.state.state} />
                }
              </React.Fragment> :
              <Home auth={this.props.auth} />
            }
          </Switch>
      </div>
    );
  }
}


export default App;