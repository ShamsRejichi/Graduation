const mongoose = require('mongoose');
const User = require('./user');

const OrgSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },  
 
  manager: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  users: {
    type: [User.schema],
    default: null,
  }
});


const Org = mongoose.model('Org', OrgSchema);

module.exports = Org;

