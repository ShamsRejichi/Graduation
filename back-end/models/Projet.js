const mongoose = require('mongoose');
const User = require('./user');

const ProjetSchema = new mongoose.Schema({
  label: {
    type: String,
   
  },
  description: {
    type: String,
  
  },
  clientName: {
    type: String,
   
  },
  Date: { type: Date,
  },
  projectDirector: {
    type: String,
    ref: "User",
    
  },
  
  progress: {
    type: Number,
      
    default: 0, // set default value to 0
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  manager: {
    type: String,
    ref: "User",
   
  },
  selectedstatus: {
    type: String,
 
  },
  progress: {
    type: Number,
   
  },
  users: {
    type: [User.schema],
    default: null,
  }
});

const Projet = mongoose.model('Projet', ProjetSchema);

module.exports = Projet;
