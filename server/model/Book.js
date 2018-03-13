const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    owner_id: { type: String, required: true },
    name: { type: String, required: true },
    author: {type: String, default: "Unknown"},
    visible: {type: Boolean, default: false},
    expire_at: {type: Date, default: Date.now, expires: 7*24*60*60}
  }
);

const Book = mongoose.model('Book', schema, 'books');

module.exports = Book;