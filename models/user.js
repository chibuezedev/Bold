const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  
  resetPasswordToken: String,
  resetToken: String,
  resetTokenExpiration: Date,
});


module.exports = mongoose.model('User', userSchema);
