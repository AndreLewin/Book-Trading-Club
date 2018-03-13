const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    requester_id: { type: String, required: true },
    owner_id: { type: String, required: true },
    book_id: {type: String, required: true},
    expire_at: {type: Date, default: Date.now, expires: 7*24*60*60}
  }
);

const Request = mongoose.model('Request', schema, 'requests');

module.exports = Request;