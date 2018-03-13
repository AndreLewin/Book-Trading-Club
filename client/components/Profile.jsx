import React from 'react';
import { Form, Message, Header } from 'semantic-ui-react';
import axios from 'axios';


class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      full_name: "",
      city: "",
      state: "",
      error: true
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      full_name: $("#full_name").val(),
      city: $("#city").val(),
      state: $("#state").val(),
      error: $("#full_name").val() === "" || $("#city").val() === "" || $("#state").val() === "",
    });
  }

  handleSubmit() {
    const body = {
      full_name: this.state.full_name,
      city: this.state.city,
      state: this.state.state,
    };

    axios.post('/createProfile', body, { headers: { Authorization: "Bearer " + localStorage.getItem("idToken") }})
      .then((response) => {
        window.location.replace(location.origin);
      })
      .catch((error) => {
        console.log(error)
      });
  }

  render() {
    return (
      <div className="componentPadding">
        <div>
          <h2>My profile</h2>
          <br/>
        </div>
        <Form>
          <Message info content='Enter your informations. You can lie, no worries. Everything is deleted after one week.' />
          {
            this.state.error ?
              <Message content='Please fill up all fields.'/> :
              <Message positive content='Are you ready? Press the button "Submit"!'/>
          }
          <Form.Group>
            <Form.Input defaultValue={this.props.full_name} placeholder='Full name' id='full_name' onChange={this.handleChange} />
            <Form.Input defaultValue={this.props.city} placeholder='City' id='city' onChange={this.handleChange} />
            <Form.Input defaultValue={this.props.state} placeholder='State' id='state' onChange={this.handleChange} />
            <Form.Button disabled={this.state.error} onClick={this.handleSubmit}>Submit</Form.Button>
          </Form.Group>
        </Form>
      </div>
    );
  }
}


export default Profile;