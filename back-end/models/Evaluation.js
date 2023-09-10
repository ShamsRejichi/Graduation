const mongoose = require('mongoose');
const User = require('./user');
const evaluationSchema = new mongoose.Schema({
  users: {
    type: [User.schema],
    default: null,
  },
  answers: [String], // Array of answers to the evaluation questions
  completed: {
    type: Boolean,
    default: false,
  },
  score: {
    type: Number,
    
  },
  

});

const Evaluation = mongoose.model('Evaluation', evaluationSchema);

module.exports = Evaluation;
