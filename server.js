const express = require('express');
const bodyparser = require('body-parser');
require('dotenv').config();
const nodemailer = require('nodemailer');
const alertTracker = require('./alertTracker');
var cors = require('cors');

const PORT = process.env.PORT || 5000;

const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.post('/', (req, res) => {
  console.log('Data received', req.body);
  let alarm = alertTracker.dataParser(req.body);

  if (alarm !== null) {
    console.log('Event is near user!');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });
    // temp reference
    let name = alarm[0]
    let email = alarm[1];
    let photo = alarm[2];
    let category = alarm[3];
    let alertPhoto = alarm[4];
    
    const mailOptions = {
      from: `${process.env.EMAIL}`,
      to: process.env.TESTUSER,
      subject: `${name}! A ${category} alert has been posted near you!`,
      html: `Hello ${name},<br>
      This is your Local Alert Network.<br>
      A wildfire has been reported near you...<br>

      Please stay safe!<br>

      Team Hercules<br>
      <img src=${alertPhoto} alt=${category} width='200' height='145'/><br>
     `,
    };

    transporter.sendMail(mailOptions, (err, res) => {
      if (err) {
        console.log('Failed to send email', err);
      } else {
        console.log('Email succesfully sent!', res);
        res.send('Thank you for using alert notification services!');
      }
    });
  } else {
    console.log('No alerts near users');
  }
  res.sendStatus(200);

});

app.get('/', (req, res) => {
  res.send('Alert Tracker is Live! Keeping you informed about every alert...');
});

app.listen(PORT, () => {
  console.log(`Hercules is here for you on port ${PORT}`);
});
