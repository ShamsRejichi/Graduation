/* eslint-disable max-len */
/* !

=========================================================
* Argon React NodeJS - v1.0.0
=========================================================

* Product Page: https://argon-dashboard-react-nodejs.creative-tim.com/
* Copyright 2020 Creative Tim (https://https://www.creative-tim.com//)
* Copyright 2020 ProjectData (https://projectdata.dev/)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react-nodejs/blob/main/README.md)

* Coded by Creative Tim & ProjectData

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
const mongoose = require('mongoose');
const Experience = require('./experience');
const Training = require('./training');
const Skill = require('./skill');
const Pole =require('./pole');
const Evaluation = require('./Evaluation');
const userEnums = new mongoose.Schema({value: { type: String, enum:["admin","manager","ProjectDirector","ProductOwner","Salarié"]}});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  },
  postalcode: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    refs : userEnums,
    required: true,
    default: "Salarié",
  },
  experience: {
    type: [Experience.schema],
    default: null,
  },
  training: {
    type: [Training.schema],
    default: null,
  },
  
  skills: {
    type: [Skill.schema],
    default: null,
  },
  pole: {
    type: [Pole.schema],
   default : null,
},

  
profilePicture: {
  type: String, // or whatever data type you want to use to store the image file path or URL
},
  accountConfirmation: {
    type: Boolean,
    default: false,
  },
  resetPass: {
    type: Boolean,
    default: false,
    
  },
  percentage: {
    type: Number,
    default: 0,
  },

  date: {
    type: Date,
    default: Date.now,
  },
  evaluations: [
    {
      id: {
        type: [Evaluation.schema],
        default: null,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      score: {
        type: Number,
        
      },
    },
  ],
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
