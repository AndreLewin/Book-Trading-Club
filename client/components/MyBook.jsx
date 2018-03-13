// To be displayed in the page MyBooks

import React from 'react';
import { Table, Icon } from 'semantic-ui-react'

import axios from 'axios';


class MyBook extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: this.props.visible,
      removed: false,
    };

    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }


  handleVisibilityChange() {
    const body = {
      book_id: this.props.id,
    };

    axios.post('/toggleVisibility', body, { headers: { Authorization: "Bearer " + localStorage.getItem("idToken") }})
      .then((response) => {
        this.setState((prevState, props) => ({
          visible: !prevState.visible,
        }));
      })
      .catch((error) => {
        console.log(error)
      });
  }

  handleRemove() {
    const body = {
      book_id: this.props.id,
    };

    axios.post('/removeBook', body, { headers: { Authorization: "Bearer " + localStorage.getItem("idToken") }})
      .then((response) => {
        this.setState({
          removed: true,
        });
      })
      .catch((error) => {
        console.log(error)
      });
  }


  render() {
    return (
      <Table.Row>
        { !this.state.removed &&
          <React.Fragment>
            <Table.Cell>{this.props.name}</Table.Cell>
            <Table.Cell>{this.props.author}</Table.Cell>
            <Table.Cell onClick={this.handleVisibilityChange} style={{cursor:'pointer'}} selectable textAlign='center'>
              {this.state.visible ?
                <Icon color='green' name='checkmark' size='large' /> :
                <Icon color='red' name='close' size='large' />
              }
            </Table.Cell>
            <Table.Cell onClick={this.handleRemove} style={{cursor:'pointer'}} selectable textAlign='center'>
              <Icon name='trash' size='large' />
            </Table.Cell>
          </React.Fragment>
        }
      </Table.Row>
    );
  }
}

export default MyBook;