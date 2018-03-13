import React from 'react';
import { Table, Dimmer, Loader } from 'semantic-ui-react'
import axios from 'axios';

import Request from './Request.jsx';


class Trades extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      myRequests: [],
      incomingRequests: [],
      loading: true,
    }
  }

  componentDidMount() {
    // Get the books of all users from the database
    axios.get('/searchMyRequests', { headers: { Authorization: "Bearer " + localStorage.getItem("idToken") }})
      .then((response1) => {
        axios.get('/searchIncomingRequests', { headers: { Authorization: "Bearer " + localStorage.getItem("idToken") }})
          .then((response2) => {
            this.setState({
              myRequests: response1.data,
              incomingRequests: response2.data,
              loading: false,
            });
          })
          .catch((error2) => { console.log('error fetching incoming requests')})
      })
      .catch((error1) => { console.log('error fetching my requests')})
  }


  render() {

    const myRequestList = this.state.myRequests.map((request, index) => {
      return (
        <Request key={request._id} id={request._id} name={request.name} author={request.author}
               owner_name={request.owner_name} city={request.city} state={request.state}
        />
      )
    });

    const incomingRequestList = this.state.incomingRequests.map((request, index) => {
      return (
        <Request key={request._id} id={request._id} name={request.name} author={request.author}
                 requester_name={request.requester_name} city={request.city} state={request.state}
        />
      )
    });

    return (
      <div className="componentPadding">

        <Dimmer inverted active={this.state.loading}>
          <Loader size="big">Loading</Loader>
        </Dimmer>

        <div>
          <h2>My requests</h2>
        </div>

        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width="3">Name</Table.HeaderCell>
              <Table.HeaderCell width="3">Author</Table.HeaderCell>
              <Table.HeaderCell width="3">Owner</Table.HeaderCell>
              <Table.HeaderCell width="2">City</Table.HeaderCell>
              <Table.HeaderCell width="2">State</Table.HeaderCell>
              <Table.HeaderCell width="2">Cancel</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {myRequestList}
          </Table.Body>
        </Table>

        <div>
          <h2>Incoming requests</h2>
        </div>
        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width="3">Name</Table.HeaderCell>
              <Table.HeaderCell width="3">Author</Table.HeaderCell>
              <Table.HeaderCell width="3">Requester</Table.HeaderCell>
              <Table.HeaderCell width="2">City</Table.HeaderCell>
              <Table.HeaderCell width="2">State</Table.HeaderCell>
              <Table.HeaderCell width="1">Refuse</Table.HeaderCell>
              <Table.HeaderCell width="1">Accept</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {incomingRequestList}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

export default Trades;