import React from 'react';
import { Table, Dimmer, Loader } from 'semantic-ui-react'
import axios from 'axios';

import MyBook from './MyBook.jsx';
import NewBookForm from './NewBookForm.jsx';


class MyBooks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      books: [],
      loading: true,
    }
  }

  componentDidMount() {
    // Get the books of the user from the database
    axios.get('/searchOwnBooks', { headers: { Authorization: "Bearer "+ localStorage.getItem("idToken") }})
      .then((response) => {
        this.setState({
          books: response.data,
          loading: false,
        });
      })
      .catch((error) => { console.log('error fetching books')})
  }

  
  render() {
    const bookList = this.state.books.map((book, index) => {
      return (
        <MyBook key={book._id} id={book._id} name={book.name} author={book.author} visible={book.visible} />
      );
    });

    return (
      <div className="componentPadding">

        <Dimmer inverted active={this.state.loading}>
          <Loader size="big">Loading</Loader>
        </Dimmer>

        <div>
          <h2>All my books</h2>
        </div>

        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width="4">Name</Table.HeaderCell>
              <Table.HeaderCell width="4">Author</Table.HeaderCell>
              <Table.HeaderCell width="1">Visible</Table.HeaderCell>
              <Table.HeaderCell width="1">Remove</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {bookList}
          </Table.Body>
        </Table>

        <NewBookForm/>

      </div>
    );    
  }
}

export default MyBooks;