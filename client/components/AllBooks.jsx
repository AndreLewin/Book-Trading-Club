import React from 'react';
import { Table, Dimmer, Loader } from 'semantic-ui-react'
import axios from 'axios';

import ABook from './ABook.jsx';


class AllBooks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      books: [],
      loading: true,
    }
  }

  componentDidMount() {
    // Get the books of all users from the database
    axios.get('/searchAllBooks', { headers: { Authorization: "Bearer " + localStorage.getItem("idToken") }})
      .then((response) => {
        this.setState({
          books: response.data,
          loading: false
        });
      })
      .catch((error) => { console.log(error)})
  }


  render() {
    const bookList = this.state.books.map((book, index) => {
      return (
        <ABook key={book._id} id={book._id} name={book.name} author={book.author}
               owner_name={book.owner_name} owner_city={book.owner_city} owner_state={book.owner_state}
               owned={book.owned} requested={book.requested}
        />
      );
    });

    return (
      <div className="componentPadding">

        <Dimmer inverted active={this.state.loading}>
          <Loader size="big">Loading</Loader>
        </Dimmer>

        <div>
          <h2>All books available for request</h2>
        </div>

        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width="4">Name</Table.HeaderCell>
              <Table.HeaderCell width="4">Author</Table.HeaderCell>
              <Table.HeaderCell width="2">Owner</Table.HeaderCell>
              <Table.HeaderCell width="2">City</Table.HeaderCell>
              <Table.HeaderCell width="2">State</Table.HeaderCell>
              <Table.HeaderCell width="1">Request</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {bookList}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

export default AllBooks;