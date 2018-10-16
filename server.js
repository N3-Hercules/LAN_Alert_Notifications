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

    let name = alarm.user.name;
    let email = alarm.user.email;
    let photo = alarm.data.photo;
    let category = alarm.data.category;

    const userImpactedEmail = {
      from: `${process.env.EMAIL}`,
      to: `${email}`,
      subject: `${name}! A ${category} alert has been posted near you!`,
      html: `Hello ${name},<br>
      This is your Local Alert Network.<br>
      A ${category} has been reported near you...<br>

      The location of the alert was recorded at the following coordinates:<br>
      Latitude: ${alarm.data.latitude}<br>
      Longitude: ${alarm.data.longitude}<br>

      Please stay safe!<br>

      Team Hercules<br>
      <img src=${photo} alt=${category} width='200' height='145'/><br>
     `,
    };

    if (alarm.impactedFriends) {
      const friendImpactedEmail = {
        from: `${process.env.EMAIL}`,
        to: `${email}`,
        subject: `${name}! A ${category} alert has been posted near your friend ${alarm.impactedFriends.users[0]}!`,
        html: `Hello ${name},<br>
        This is your Local Alert Network.<br>
        A ${category} has been reported near ${alarm.impactedFriends.users[0]}'s house!...<br>
        ${(alarm.impactedFriends.users > 1) ? `The following friends have also been impacted: ${alarm.impactedFriends.users}` : 'no other friends have been impacted at this time.'}<br>
  
        The location of the alert was recorded at the following coordinates:<br>
        Latitude: ${alarm.data.latitude}<br>
        Longitude: ${alarm.data.longitude}<br>
  
        Please check on your friend soon...<br>
        The Local Alert Network is here to keep you informed of any alerts impacting those you care about.<br>
  
        Team Hercules<br>
        <img src=${photo} alt=${category} width='200' height='145'/><br>
       `,
      };
      return friendImpactedEmail;
    }

    const mailOptions = (alarm.user.impacted === true) ? userImpactedEmail : friendImpactedEmail || null;

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
