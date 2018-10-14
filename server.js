const express = require('express');
const bodyparser = require('body-parser');
require('dotenv').config();
const nodemailer = require('nodemailer');

const PORT = process.env.PORT || 5000;

const app = express();

app.use(bodyparser.json());

app.post('/', (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: `${req.body.email}`,
    to: process.env.TESTUSER,
    subject: `${req.body.name}`,
    text: `${req.body.message}`,
  };
  transporter.sendMail(mailOptions, (err, res) => {
    if (err) {
      console.log('Failed to send email', err);
    } else {
      console.log('Email succesfully sent!', res);
    }
  });
});

app.get('/api/notifications', (req, res) => {
  console.log('USer is real!', process.env.EMAIL);
  res.json({
    confirmation: 'success',
    message: 'it worked!',
  });
});

app.get('/', (req, res) => {
  res.send('Alert Tracker is Live! Keeping you informed about every alert...');
});

app.listen(PORT, () => {
  console.log(`Hercules is here for you on port ${PORT}`);
});
