const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    full_name: { type: String, default: "Anonymous" },
    city: {type: String, default: "Null Island"},
    state: {type: String, default: "Atlantic Ocean"},
    expire_at: {type: Date, default: Date.now, expires: 7*24*60*60}
  }
);

const User = mongoose.model('User', schema, 'users');

module.exports = User;