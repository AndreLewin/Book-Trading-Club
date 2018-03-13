const express = require('express');
const helmet = require('helmet');
const app = express();
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');

const User = require('./model/User');
const Book = require('./model/Book');
const Request = require('./model/Request');

// If a route is private to authenticated users with Auth0
// Authorization: Bearer tokenId (JWT) ; Algorithm: RS256
const checkJwt = require('./checkJwt');


// Get process.env.VARIABLES from .env
require('dotenv').load();

// CORS is needed for authentication with Auth0
app.use(cors());

// Helmet for security
app.use(helmet());

// Make the content of ./public accessible from URL
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// Use and configure body-parser for reading the body of HTTP requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// For debugging
app.use(function(err, req, res, next){
  console.error(err.stack);
  return res.status(err.status).json({ message: err.message });
});

// Use the webpack dev server as a middleware, so we can launch it from this file
const config = require('../webpack.dev.config');
const compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: {colors: true}
}));

// Configure Mongoose
mongoose.connect(process.env.DB_URI, { useMongoClient: true });
mongoose.Promise = global.Promise;



app.get('/searchProfile', async (req, res) => {

  // Authenticate the user by acquiring its user_id from its accessToken
  const user_id = getUserId(req.headers.authorization);
  if (!user_id) { res.status(400).send("Bad Request: is your accessToken in localStorage correct?"); return;  }

  // Get the user entry from the database, if the authenticated user has no entry, redirect (see App.jsx)
  const user = await User.findOne({ user_id: user_id });
  if (user) {
    res.status(200).send(user);
  } else {
    res.status(204).send("No content: your id is valid. You have no profile so let's create one.")
  }
});


// Create or Edit a profile
app.post('/createProfile', checkJwt, async (req, res) => {

  const user_id = getUserId(req.headers.authorization);

  // Check required fields
  if (req.body.full_name === undefined || req.body.city === undefined || req.body.state === undefined) {
    res.status(400).send("Bad Request: profile field missing");
    return;
  }

  // Recreate a user with the user_id. Delete the past one if it exists
  const oldUser = await User.findOne({ user_id: user_id });
  if (oldUser) {
    oldUser.remove();
  }

  const newUser = new User({
    user_id: user_id,
    full_name: req.body.full_name,
    city:req.body.city,
    state:req.body.state
  });
  newUser.save();

  res.status(204).send("User successfully created or updated");
});


// Add book
app.post('/addBook', checkJwt, async (req, res) => {

  const user_id = getUserId(req.headers.authorization);

  // Check the name and author fields
  if (req.body.name === undefined || req.body.author === undefined) { res.status(400).send("Bad Request: name or author field missing"); return; }

  // Create a new book
  const book = new Book({
    owner_id: user_id,
    name: req.body.name,
    author: req.body.author,
  });
  book.save();

  res.status(204).send("Book successfully added");
});


// Search books of a user itself
app.get('/searchOwnBooks', checkJwt, async (req, res) => {

  const user_id = getUserId(req.headers.authorization);

  // Get the books from the database
  const books = await Book.find({ owner_id: user_id }).lean();

  if (books) {
    res.status(200).send(books);
  } else {
    res.status(500).send("Could not check if there were books in the database");
  }
});


// Toggle book visibility
app.post('/toggleVisibility', checkJwt, async (req, res) => {

  const user_id = getUserId(req.headers.authorization);

  // Check the book_id field
  if (req.body.book_id === undefined ) { res.status(400).send("Bad Request: book_id missing"); return; }

  // Get the book, and switch its visibility
  const book = await Book.findOne({_id:req.body.book_id});
  book.visible = !book.visible;
  book.save();

  res.status(204).send("Visibility of the book successfully updated");
});


// Remove book
app.post('/removeBook', checkJwt, async (req, res) => {

  // Check the book_id field
  if (req.body.book_id === undefined ) { res.status(400).send("Bad Request: book_id missing"); return; }

  // Remove requests linked to the book
  const requests = await Request.find({book_id: req.body.book_id});
  for (let i = 0; i<requests.length; i++) {
    requests[i].remove();
  }

  // Get the book, and remove it
  const book = await Book.findOne({_id: req.body.book_id});
  book.remove();

  res.status(204).send("Visibility of the book successfully updated");
});


// Search the books from all users, to display in "All books"
app.get('/searchAllBooks', checkJwt, async (req, res) => {

  const user_id = getUserId(req.headers.authorization);

  // Get the user from the database
  const books = await Book.find().lean();

  // For each book, add additional information about the owner user
  // Note: this can probably be optimized so an other owner is being fetched without waiting to find or not a request
  for (let i = 0; i < books.length; i++) {
    const owner = await User.findOne({user_id: books[i].owner_id });

    // Remove the book from the list if it has no owner or is not visible
    if (!owner || !books[i].visible) {
      books.splice(i, 1);
      i--;
      continue;
    }

    books[i].owner_name = owner.full_name;
    books[i].owner_city = owner.city;
    books[i].owner_state = owner.state;
    books[i].owned = owner.user_id === user_id;

    // Check if the book is already requested
    const request = await Request.findOne({ requester_id: user_id, book_id: books[i]._id });
    books[i].requested = !!request;
  }

  if (books) {
    res.status(200).send(books);
  } else {
    res.status(500).send("Could not check if there were books in the database");
  }
});


// Request book
app.post('/requestBook', checkJwt, async (req, res) => {

  const user_id = getUserId(req.headers.authorization);

  // Check if a book_id is provided
  if (req.body.book_id === undefined ) { res.status(400).send("Bad Request: book_id missing"); return; }

  // Check if the request already exists
  const oldRequest = await Request.findOne({requester_id: user_id, book_id: req.body.book_id });
  if (oldRequest) { res.status(400).send("Bad Request: request already requested"); return; }

  // Get the owner_id of the book
  const book = await Book.findOne({_id:req.body.book_id});

  // Check the visibility of the book
  if (book.visible === false) { res.status(400).send("Bad Request: this book can't be requested"); return; }

  // Create a new request
  const request = new Request({
    requester_id: user_id,
    owner_id: book.owner_id,
    book_id: req.body.book_id,
  });
  request.save();

  res.status(204).send("Request request added");
});


// Search my requests, to display in "My requests"
app.get('/searchMyRequests', checkJwt, async (req, res) => {

  const user_id = getUserId(req.headers.authorization);

  // Get my requests from the database
  const requests = await Request.find({requester_id: user_id}).lean();

  // For each my request, add info about the book (name, author) and the owner (city, state)
  // If the book or the owner does not exist, remove the request from the array to display
  for (let i = 0; i < requests.length; i++) {
    const book = await Book.findOne({_id: requests[i].book_id });
    const owner = await User.findOne({user_id: requests[i].owner_id });

    if (!book || !owner) {
      requests.splice(i, 1);
      i--;
      continue;
    }

    requests[i].name = book.name;
    requests[i].author = book.author;
    requests[i].owner_name = owner.full_name;
    requests[i].city = owner.city;
    requests[i].state = owner.state;
  }

  if (requests) {
    res.status(200).send(requests);
  } else {
    res.status(500).send("Could not check if there were requests in the database");
  }
});


// Search incoming requests, to display in "My requests"
app.get('/searchIncomingRequests', checkJwt, async (req, res) => {

  const user_id = getUserId(req.headers.authorization);

  // Get my requests from the database
  const requests = await Request.find({owner_id: user_id}).lean();

  // For each my request, add info about the book (name, author) and the requester (city, state)
  for (let i = 0; i < requests.length; i++) {
    const book = await Book.findOne({_id: requests[i].book_id });
    const requester = await User.findOne({user_id: requests[i].requester_id });

    if (!book || !requester) {
      requests.splice(i, 1);
      i--;
      continue;
    }

    requests[i].name = book.name;
    requests[i].author = book.author;
    requests[i].requester_name = requester.full_name;
    requests[i].city = requester.city;
    requests[i].state = requester.state;
  }

  if (requests) {
    res.status(200).send(requests);
  } else {
    res.status(500).send("Could not check if there were requests in the database");
  }
});


// Cancel request
app.post('/cancelRequest', checkJwt, async (req, res) => {

  const user_id = getUserId(req.headers.authorization);

  // Check the request_id field
  if (req.body.request_id === undefined ) { res.status(400).send("Bad Request: request_id missing"); return; }

  // Get the request
  const request = await Request.findOne({_id: req.body.request_id});

  // Check if the user is the requester
  if (request.requester_id !== user_id ) { res.status(403).send("Forbidden: you can't cancel a request that is not yours")}

  request.remove();
  res.status(204).send("Request cancelled");
});


// Refuse request
app.post('/refuseRequest', checkJwt, async (req, res) => {

  const user_id = getUserId(req.headers.authorization);

  // Check the request_id field
  if (req.body.request_id === undefined ) { res.status(400).send("Bad Request: request_id missing"); return; }

  // Get the request
  const request = await Request.findOne({_id: req.body.request_id});

  // Check if the user is the owner
  if (request.owner_id !== user_id ) { res.status(403).send("Forbidden: you can't refuse a request that is not for you")}

  request.remove();
  res.status(204).send("Request refused");
});


// Accept request
app.post('/acceptRequest', checkJwt, async (req, res) => {

  const user_id = getUserId(req.headers.authorization);

  // Check the request_id field
  if (req.body.request_id === undefined ) { res.status(400).send("Bad Request: request_id missing"); return; }

  // Get the request
  const request = await Request.findOne({_id: req.body.request_id});

  // Check if the user is the owner
  if (request.owner_id !== user_id ) { res.status(403).send("Forbidden: you can't refuse a request that is not for you")}

  // 1) Put the visibility of the book on off, change the owner
  const book = await Book.findOne({_id: request.book_id });
  book.owner_id = request.requester_id;
  book.visible = false;
  book.expire_at = Date.now();
  book.save();

  // 2) Remove all requests concerning this book (this one and eventually from competing requesters)
  const requests = await Request.find({book_id: request.book_id});
  for (let i = 0; i < requests.length; i++ ) {
    requests[i].remove();
  }

  res.status(204).send("Request accepted");
});


// Extract the userId from the idToken (JWT) given by Auth0
const getUserId = (authHeader) => {
  const decoded = jwt.decode(authHeader.replace('Bearer ',''));
  const sub = decoded.sub;
  const subParts = sub.split('|');
  return subParts[subParts.length - 1];
};


// Listen for requests
const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

// Default route: send index.html, so the BrowserRouter can analyse
// and display the element depending on the URL (CSR)
app.get('*',function (req, res) {
  res.sendFile(path.join(__dirname + '/../public/index.html'));
});
