// To be displayed in the page Requests

import React from 'react';
import { Table, Icon } from 'semantic-ui-react'

import axios from 'axios';


class Request extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      owned: this.props.owned,
      requested: this.props.requested,
      visible: true,
    };

    this.handleCancel = this.handleCancel.bind(this);
    this.handleRefuse = this.handleRefuse.bind(this);
    this.handleAccept = this.handleAccept.bind(this);
  }

  handleCancel() {
    const body = {
      request_id: this.props.id,
    };

    axios.post('/cancelRequest', body, { headers: { Authorization: "Bearer " + localStorage.getItem("idToken") }})
      .then((response) => {
        this.setState({
          visible: false,
        });
      })
      .catch((error) => {
        console.log(error)
      });
  }

  handleRefuse() {
    const body = {
      request_id: this.props.id,
    };

    axios.post('/refuseRequest', body, { headers: { Authorization: "Bearer " + localStorage.getItem("idToken") }})
      .then((response) => {
        this.setState({
          visible: false,
        });
      })
      .catch((error) => {
        console.log(error)
      });
  }


  handleAccept() {
    const body = {
      request_id: this.props.id,
    };

    axios.post('/acceptRequest', body, { headers: { Authorization: "Bearer " + localStorage.getItem("idToken") }})
      .then((response) => {
        this.setState({
          visible: false,
        });
      })
      .catch((error) => {
        console.log(error)
      });
  }

  render() {
    return (
      <Table.Row>
      { this.state.visible &&
        <React.Fragment>
          <Table.Cell>{this.props.name}</Table.Cell>
          <Table.Cell>{this.props.author}</Table.Cell>
          { this.props.owner_name &&
            <Table.Cell>{this.props.owner_name}</Table.Cell>
          }
          { this.props.requester_name &&
            <Table.Cell>{this.props.requester_name}</Table.Cell>
          }
          <Table.Cell>{this.props.city}</Table.Cell>
          <Table.Cell>{this.props.state}</Table.Cell>
          { this.props.owner_name &&
            <Table.Cell onClick={this.handleCancel} style={{cursor:'pointer'}} selectable textAlign='center'>
              <Icon color="red" name='close' size='large' />
            </Table.Cell>
          }
          { this.props.requester_name &&
            <React.Fragment>
              <Table.Cell onClick={this.handleRefuse} style={{cursor:'pointer'}} selectable textAlign='center'>
                <Icon color="red" name='close' size='large' />
              </Table.Cell>
              <Table.Cell onClick={this.handleAccept} style={{cursor:'pointer'}} selectable textAlign='center'>
                <Icon color="green" name='check' size='large' />
              </Table.Cell>
            </React.Fragment>
          }
        </React.Fragment>
      }
      </Table.Row>
    );
  }
}

export default Request;