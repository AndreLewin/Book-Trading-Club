import React from 'react';

import books from '../../public/books.png';
import coread from '../../public/coread.png';


class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <div className="ui inverted vertical masthead center aligned segment"
             style={{"backgroundImage": "linear-gradient(rgba(28, 29, 29, 1), rgba(28, 29, 29, 0.2)), linear-gradient(rgba(28, 29, 29, 0.2), rgba(28, 29, 29, 1)), url("+books+")"}}>
          <div className="ui text container">
            <h1 className="ui inverted header">
              Book Trading Club
            </h1>
            <hr/>
            <h2>Share books freely in the USA</h2>
            { !this.props.auth.isAuthenticated() &&
              <div className="ui huge primary button" onClick={()=>{this.props.auth.login()}}>
                Start trading books <i className="right book icon"/>
              </div>
            }
          </div>
        </div>

        <div className="ui vertical stripe segment">
          <div className="ui middle aligned stackable grid container">
            <div className="row">
              <div className="seven wide column">
                <h3 className="ui header">Share your love</h3>
                <p>Indicate your city, and which books you are giving away for free.</p>
                <h3 className="ui header">Find a hidden treasure</h3>
                <p>See the books available, make a trade request, and meet a book lover like you.</p>
              </div>
              <div className="seven wide right floated column">
                <img src={coread} className="ui rounded big image"/>
              </div>
            </div>
          </div>
        </div>

        <div className="ui inverted vertical footer segment">
          <div className="ui container">
            <h4 className="ui inverted header">Made by <a href="https://github.com/AndreLewin">André Lewin</a></h4>
            <p>Project made for the full stack curriculum of <a href="https://www.freecodecamp.org/challenges/manage-a-book-trading-club">Free Code Camp</a></p>
          </div>
        </div>
      </React.Fragment>
    );    
  }
}

export default Home;