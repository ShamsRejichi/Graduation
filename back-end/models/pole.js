
const mongoose = require('mongoose');


const poleEnums = new mongoose.Schema({value: { type: String, enum:["","","",""]}});

const poleSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    default: "developeur"
  },
  level: {
    type: String,
    refs : poleEnums,
    required: true,
    default: "débutant"
    
  },
});

const pole = mongoose.model('pole', poleSchema);

module.exports = pole;