// To be displayed in the page AllBooks

import React from 'react';
import { Table, Icon } from 'semantic-ui-react'
import axios from 'axios';


class ABook extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      owned: this.props.owned,
      requested: this.props.requested,
    };

    this.handleRequest = this.handleRequest.bind(this);
  }


  handleRequest() {
    const body = {
      book_id: this.props.id,
    };

    axios.post('/requestBook', body, { headers: { Authorization: "Bearer " + localStorage.getItem("idToken") }})
      .then((response) => {
        this.setState({
          requested: true,
        });
      })
      .catch((error) => {
        console.log(error)
      });
  }


  render() {
    return (
      <Table.Row>
        <Table.Cell>{this.props.name}</Table.Cell>
        <Table.Cell>{this.props.author}</Table.Cell>
        <Table.Cell>{this.props.owner_name}</Table.Cell>
        <Table.Cell>{this.props.owner_city}</Table.Cell>
        <Table.Cell>{this.props.owner_state}</Table.Cell>
        { !this.state.owned && !this.state.requested ?
          <Table.Cell onClick={this.handleRequest} style={{cursor:'pointer'}} selectable textAlign='center'>
            <Icon name='shopping basket' size='large' />
          </Table.Cell> :
          <Table.Cell/>
        }
      </Table.Row>
    );
  }
}

export default ABook;