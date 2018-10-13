const express = require('express');
const bodyparser = require('body-parser');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(bodyparser.json());

app.get('/api/notifications', (req, res) => {
  res.json({
    confirmation: 'success',
    message: 'it worked!',
  });
})

app.listen(PORT, () => {
  console.log(`Hercules is here for you on port ${PORT}`);
});
