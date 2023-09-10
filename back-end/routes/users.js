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
const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const config = require('../config/keys');
const User = require('../models/user');
const ActiveSession = require('../models/activeSession');
const Skill = require('../models/skill');
const Pole = require('../models/pole');
const Org = require('../models/org');
const Projet = require('../models/Projet');
const reqAuth = require('../config/safeRoutes').reqAuth;
const {smtpConf,webURL} = require('../config/config');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const profilePicturesDir = 'uploads/profilePictures';
const Evaluation = require('../models/Evaluation');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const timestamp = Date.now();
    const filename = `profilePicture-${timestamp}${ext}`;
    cb(null, filename);
  },
});


const upload = multer({ storage });


async function buildNodes(poleId, orgId) {
  // Fetch all the users who belong to the pole and organization
  const users = await User.find({ pole: poleId, org: orgId }).populate('manager');

  // Filter out users who have a manager
  const rootNodes = users.filter(user => !user.manager);

  // Build the tree structure for the org chart
  const buildTree = (node) => ({
    id: node._id,
    name: node.name,
    title: node.title,
    children: users.filter(user => user.manager && user.manager.equals(node._id)).map(buildTree)
  });

  // Return the tree structure for the org chart
  return rootNodes.map(buildTree);
}


// route /admin/users/
/*router.get('/api/org-chart/:userId/:orgId',reqAuth, async (req, res) => {
  try {
    const userId = req.params.userId;
    const orgId = req.params.orgId;

    // Fetch the user's information from the database
    const user = await User.findById(userId).populate('pole').populate('org');

    // Check if the user has an organization record
    if (!user.org) {
      // If the user doesn't have an organization record, create a new one
      const newOrg = new Org({
        name: 'My Organization',
        users: [user._id]
      });
      await newOrg.save();

      // Update the user's organization field
      user.org = newOrg._id;
      await user.save();
    }

    // Build the org chart for the user's pole and organization
    const nodes = await buildNodes(user.pole, orgId);

    // Return the org chart as a JSON response
    res.json(nodes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
*/

// POST /api/orgs
// Create a new organization


router.get('/get', reqAuth, function(req, res) {
  User.find({}, function(err, users) {
    if (err) {
      res.json({success: false});
    }
    users = users.map(function(item) {
      const x = item;
      x.password = undefined;
      x.__v = undefined;  
      return x;
    });
    res.json({success: true, users: users});
  });
});

router.get('/getManagers', reqAuth, function(req, res) {
  User.find({}, function(err, users) {
    if (err) {
      res.json({success: false});
    }
    users = users.filter((user)=> user.role === "manager")
    res.json({success: true, users: users});
  });
});
router.get('/getProjectDirectors', reqAuth, function(req, res) {
  User.find({}, function(err, users) {
    if (err) {
      res.json({success: false});
    }
    users = users.filter((user)=> user.role === "ProjectDirector")
    res.json({success: true, users: users});
  });
});


router.post('/:userId/profile-picture',  upload.single('profilePicture'), async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (req.file) {
      const filename = path.basename(req.file.path);
      user.profilePicture = filename;
      await user.save();
    }
    res.status(200).json({ success: true,   message: 'Profile picture updated successfully',user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});





router.put('/:userId', reqAuth, function(req, res) {
  const userId = req.params.userId;
  const { role, pole } = req.body;
  const newPole = new Pole()
  newPole.label = pole
  const query = { _id: userId };
  const newValues = {$set: {pole: newPole, role: role}};
  
  User.updateOne(query, newValues, function(err, cb) {
    if (err) {
      res.json({ success: false, msg: 'There was an error. Please contact the administrator' });
    } else {
      User.findById(userId).populate('pole').exec(function(err, user) {
        if (err) {
          res.json({ success: false, msg: 'There was an error. Please contact the administrator' });
        } else {
          res.json({ success: true, user: user });
        }
      });
    }
  });
});




router.post('/all', function(req, res) {
  User.find({}, function(err, users) {
    if (err) {
      res.json({success: false});
    }
    users = users.map(function(item) {
      const x = item;
      x.password = undefined;
      x.__v = undefined;  
      return x;
    });
    res.json({success: true, users: users});
  });

});

router.post('/edit', reqAuth, function(req, res) {
  const {userID, name, email, address, city, country, postalcode, selectedSkills} = req.body;

  User.find({_id: userID}).then(async (user) => {
    if (user.length == 1) {
      const query = {_id: user[0]._id};
      const skills = [...selectedSkills];
      const newvalues = {$set: {name: name, email: email, address: address, city: city, country: country, postalcode: postalcode, skills: skills}};
      User.updateOne(query, newvalues, function(err, cb) {
        if (err) {
          res.json({success: false, msg: 'There was an error. Please contact the administrator'});
        }
        res.json({success: true});
      });
    } else {
      res.json({success: false});
    }
  });
});

router.post('/check/resetpass/:id', (req, res) => {
  const userID = req.params.id;
  User.find({_id: userID}).then((user) => {
    if (user.length == 1 && user[0].resetPass == true) {
      res.json({success: true}); // reset password was made for this user
    } else {
      res.json({success: false});
    }
  });
});

router.post('/resetpass/:id', (req, res) => {
  const errors = [];
  const userID = req.params.id;

  let {password} = req.body;

  if (password.length < 6) {
    errors.push({msg: 'Password must be at least 6 characters'});
  }
  if (errors.length > 0) {
    res.json({success: false, msg: errors});
  } else {
    const query = {_id: userID};
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, null, (err, hash) => {
        if (err) throw err;
        password = hash;
        const newvalues = {$set: {resetPass: false, password: password}};
        User.updateOne(query, newvalues, function(err, usr) {
          if (err) {
            res.json({success: false, msg: err});
          }
          res.json({success: true});
        });
      });
    });
  }
});

router.post('/forgotpassword', (req, res) => {
  const {email} = req.body;
  const errors = [];

  if (!email) {
    errors.push({msg: 'Please enter all fields'});
  }
  User.find({email: email}).then((user) => {
    if (user.length != 1) {
      errors.push({msg: 'Email Address does not exist'});
    }
    if (errors.length > 0) {
      res.json({success: false, errors: errors});
    } else {
      // create reusable transporter object using the default SMTP transport
      const transporter = nodemailer.createTransport(smtpConf);

      const query = {_id: user[0]._id};
      const newvalues = {$set: {resetPass: true}};
      User.updateOne(query, newvalues, function(err, usr) {});

      // don't send emails if it is in demo mode
      if (process.env.DEMO != 'yes') {
        // send mail with defined transport object
        transporter.sendMail({
          from: '"Creative Tim" <' + smtpConf.auth.user + '>', // sender address
          to: email, // list of receivers
          subject: 'Creative Tim Reset Password', // Subject line
          // eslint-disable-next-line max-len
          html: '<h1>Hey,</h1><br><p>If you want to reset your password, please click on the following link:</p><p><a href="' + 'http://localhost:3000/auth/confirm-password/' + user._id + '">"' + 'http://localhost:3000/auth/confirm-email/' + user._id + + '"</a><br><br>If you did not ask for it, please let us know immediately at <a href="mailto:' + smtpConf.auth.user + '">' + smtpConf.auth.user + '</a></p>', // html body
        });
        res.json({success: true});
      }
      res.json({success: true, userID: user[0]._id});
    }
  });
});

router.post('/confirm/:id', (req, res) => {
  const userID = req.params.id;

  const query = {_id: userID};

  const newvalues = {$set: {accountConfirmation: true}};

  User.updateOne(query, newvalues, function(err, usr) {
    if (err) {
      res.json({success: false});
    } else if (usr.nModified === 0) {
      // No matching user found, or the update did not modify any documents
      res.json({success: false});
    } else {
      // Update successful
      res.json({success: true});
    }
  });
});


router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email: email}, (err, user) => {
    if (err) throw err;

    if (!user) {
      return res.json({success: false, msg: 'Wrong credentials'});
    }

    if (!user.accountConfirmation) {
      return res.json({success: false, msg: 'Account is not confirmed'});
    }

    bcrypt.compare(password, user.password, function(err, isMatch) {
      if (isMatch) {
        const token = jwt.sign(user, config.secret, {
          
        });
        // Don't include the password in the returned user object
        const query = {userId: user._id, token: 'JWT ' + token};
        ActiveSession.create(query, function(err, cd) {
          user.password = null;
          user.__v = null;
          return res.json({
            success: true,
            token: 'JWT ' + token,
            user,
          });
        });
      } else {
        return res.json({success: false, msg: 'Wrong credentials'});
      }
    });
  });
});

router.post('/checkSession', reqAuth, function(req, res) {
  res.json({success: true});
});


router.post('/logout', reqAuth, function(req, res) {
  const token = req.body.token;
  ActiveSession.deleteMany({token: token}, function(err, item) {
    if (err) {
      res.json({success: false});
    }
    res.json({success: true});
  });
})



router.post('/send-evaluation-email/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Retrieve the user's email address using the ID from the database
    const user = await User.findById(id);
    const { email } = user;
  
    // Generate the token
    const token = jwt.sign({ userId: id }, 'your-secret-key', { expiresIn: '30d' });

    const evaluationLink = `http://localhost:3000/admin/Evaluation/${id}?token=${token}`; // Append the token to the evaluation form URL

    const transporter = nodemailer.createTransport(smtpConf);

    transporter.sendMail({
      from: '"ADMIN" <' + smtpConf.auth.user + '>',
      to: email,
      subject: 'Evaluation Form',
      html: `<h1>Hey,</h1><br><p>Please complete the evaluation form:</p><p><a href="${evaluationLink}">Evaluation form link</a></p>`,
    }, (error, info) => {
      if (error) {
        console.log(error);
        const response = { success: false, msg: 'Failed to send email' };
        res.json(response);
      } else {
        console.log('Email sent: ' + info.response);
        const response = { success: true, msg: 'Email sent successfully' };
        res.json(response);
      }
    });
  } catch (error) {
    console.error('Failed to send evaluation email', error);
    const response = { success: false, msg: 'Failed to send email' };
    res.json(response);
  }
});


router.post('/add-score-and-send-email/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { score, evaluationId } = req.body;
    // Update the user's evaluation with the score
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    // Find the evaluation within the user's evaluations array
    const evaluation = user.evaluations.find((eval) => eval._id.toString() === evaluationId);

    if (!evaluation) {
      return res.status(404).json({ success: false, msg: 'Evaluation not found' });
    }

    // Update the score of the evaluation
    evaluation.score = score;

    // Save the updated user document
    await user.save();
    console.log('User evaluation updated:', user);
    
    // Rest of the code...
    
    const message = `
    <p>
      Thank you for being part of our company! 
      You've obtained a score of 
      <span style="color: red; font-size: 20px;">${score}</span>
      in this year's evaluation. We wish you the best of luck for the future.
    </p>
  `;
  
    const { email } = user; // Extract the email field from the user object

    // Create a Nodemailer transporter using the provided SMTP configuration
    const transporter = nodemailer.createTransport(smtpConf);

    // Define the mail options
    const mailOptions = {
      from: `"ADMIN" <${smtpConf.auth.user}>`,
      to: email,
      subject: 'Evaluation Result',
      html: message,
    };

    // Send the email using the transporter
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: 'Failed to send email' });
      } else {
        console.log('Email sent: ' + info.response);
        res.json({ success: true, user });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'Failed to update user evaluation and send email' });
  }
});






router.post('/submit-evaluation/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const formDataWithId = req.body;

    // Create a new evaluation in the database
    const evaluation = await Evaluation.create({
      user: id,
      answers: formDataWithId.answers,
      completed: true,
    });

    // Update the user with the submitted evaluation
    const user = await User.findByIdAndUpdate(
      id,
      { $push: { evaluations: { _id: evaluation._id, date: new Date() } } },
      { new: true }
    );

    // Return a success response with the updated user and evaluation
    res.json({ success: true, user, evaluation });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Failed to submit evaluation" });
  }
});




router.put('/evaluations/:evaluationId', async (req, res) => {
  try {
    const { evaluationId } = req.params;
    const { answerIndex, answer } = req.body;

    // Find the evaluation by ID and update the corresponding answer
    const evaluation = await Evaluation.findByIdAndUpdate(
      evaluationId,
      { $set: { [`answers.${answerIndex}`]: answer } },
      { new: true }
    );

    // Return the updated evaluation
    res.json({ success: true, evaluation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Failed to update evaluation" });
  }
});




router.get('/api/evaluations/', async (req, res) => {
  try {
    // Retrieve all evaluations from the database
    const allEvaluations = await Evaluation.find();

    res.json(allEvaluations);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Failed to fetch evaluations" });
  }
});




router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email: email }).then((user) => {
    if (user) {
      res.json({ success: false, msg: 'Email already exists' });
    } else if (password.length < 6) {
      res.json({ success: false, msg: 'Password must be at least 6 characters long' });
    } else {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, null, (err, hash) => {
          if (err) throw err;

          const query = { name: name, email: email, password: hash };
          User.create(query, function (err, user) {
            if (err) throw err;

            const transporter = nodemailer.createTransport(smtpConf);

            transporter.sendMail({
              from: '"ADMIN" <' + smtpConf.auth.user + '>',
              to: email,
              subject: 'Confirm your account',
              html: '<h1>Hey,</h1><br><p>Confirm your new account </p><p><a href="' + webURL + 'auth/confirm-email/' + user._id + '">Confirm email address</a></p>',
            }, (error, info) => {
              if (error) {
                console.log(error);
                const response = { success: false, msg: 'Failed to send email' };
                res.json(response);
              } else {
                console.log('Email sent: ' + info.response);
                const response = { success: true, msg: 'The user was successfully registered' };
                res.json(response);
              }
            });
          });
        });
      });
    }
  });
});

router.post('/api/skills', async (req, res) => {
  const { label, level } = req.body;
  try {
    const skill = new Skill({ label, level });
    await skill.save();
    res.json(skill);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.get('/api/skills', async (req, res) => {
  try {
    const skills = await Skill.find({});
    res.json(skills);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.delete('/api/skills/:id', async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    res.json(skill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});




router.post('/api/projets', async (req, res) => {
  const { label, description, clientName,Date, projectDirector, manager, selectedstatus,progress } = req.body;
  try {
    const projet = new Projet({ label, description, clientName,Date, projectDirector,  manager, selectedstatus,progress});
    await projet.save();
    res.json(projet);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.put('/api/projets/:id', async (req, res) => {
  const { id } = req.params;
  const { selectedstatus, progress } = req.body;

  try {
    const updatedProjets = await Projet.findByIdAndUpdate(
      id,
      { $set: { selectedstatus, progress } },
      { new: true }
    );
    res.json(updatedProjets);
    console.log(updatedProjets)
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.put('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { users, percentage } = req.body;

    // Update project
    const updatedProject = await updateProject(id, users);

    res.status(200).json(updatedProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

async function updateProject(projectId, userIds) {
  let users = [];

  try {
    const foundUsers = await User.find({});

    users = foundUsers.map(user => {
      const matchingUser = userIds.find(u => u.userId === user._id.toString());
      if (matchingUser) {
        user.percentage =  matchingUser.percentage;
        return  user
      }
      
    }).filter(Boolean)
    
  } catch (err) {
    console.error(err);
  }

  const updatedProject = await Projet.findByIdAndUpdate(
    projectId,
    { $set: { users: users || [] } },
    { new: true }
  );

  return updatedProject;
}




router.get('/api/projets', async (req, res) => {
  try {
    const projet = await Projet.find({});
    res.json(projet);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.delete('/api/projets/:id', async (req, res) => {
  try {
    const projet = await Projet.findByIdAndDelete(req.params.id);
    if (!projet) {
      return res.status(404).json({ error: 'Projet not found' });
    }
    res.json(projet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/teams', async (req, res) => {
  try {
    // Extract data from the request body
    const { name, manager, date, description, selectedOptions } = req.body;

    // Create an array of user IDs from the selectedOptions
    const userIds = selectedOptions.map(option => option.value);

    // Fetch the complete user information based on the IDs
    const users = await User.find({ _id: { $in: userIds } });

    // Create a new instance of the Org model with the fetched users
    const org = new Org({ name, manager, date, description, users });

    // Save the org to the database
    await org.save();

    // Send the org as the response
    res.json(org);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.delete('/orgs/:id', async (req, res) => {
  try {
    const orgId = req.params.id;

    // Find the org by ID and delete it
    const deletedOrg = await Org.findByIdAndDelete(orgId);

    if (!deletedOrg) {
      return res.status(404).json({ error: 'Org not found' });
    }

    res.json({ message: 'Org deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/orgs/:id', async (req, res) => {
  try {
    const orgId = req.params.id;
    const orgData = req.body; // Get the orgData from the request body

    // Fetch the organization from the database
    const org = await Org.findById(orgId);

    if (!org) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    // Update the organization details
    org.name = orgData.name;
    org.manager = orgData.manager;
    org.description = orgData.description;

    // Create an array of user IDs from the selectedOptions
    const userIds = orgData.users.map(user => user.toString());

    // Fetch the complete user information based on the IDs
    const users = await User.find({ _id: { $in: userIds } });

    // Update the organization's users
    org.users = users;

    // Save the updated organization to the database
    await org.save();

    res.json(org);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});






router.get('/api/teams', async (req, res) => {
  try {
    const teams = await Org.find({});
    res.json(teams);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
