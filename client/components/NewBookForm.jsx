import React from 'react';
import { Form, Message } from 'semantic-ui-react';
import axios from 'axios';


class NewBookForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      author: "",
      error: true
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const name = $("#name").val();
    const author = $("#author").val();

    this.setState({
      name: name,
      author: author,
      error: name === "" || author === "",
    });
  }

  handleSubmit() {
    const body = {
      name: this.state.name,
      author: this.state.author,
    };

    axios.post('/addBook', body, { headers: { Authorization: "Bearer " + localStorage.getItem("idToken") }})
      .then((response) => {
        window.location.replace(location.origin+"/mybooks");
      })
      .catch((error) => {
        console.log(error)
      });
  }

  render() {
    return (
      <Form>
        <Message info content='To add a new book, fill the fields below' />
        <Form.Group>
          <Form.Input defaultValue={this.props.name} placeholder='Name of the book' id='name' onChange={this.handleChange} />
          <Form.Input defaultValue={this.props.author} placeholder='Author of the book' id='author' onChange={this.handleChange} />
          <Form.Button disabled={this.state.error} onClick={this.handleSubmit}>Submit</Form.Button>
        </Form.Group>
      </Form>
    );
  }
}


export default NewBookForm;