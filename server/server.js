const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
app.use(cors());
require('dotenv').config();

app.use(express.json({ extended: false }));
const { testdb, clouddb, NODE_ENV } = process.env;

mongoose.connect(NODE_ENV === 'test' ? testdb : clouddb, {
  useNewUrlParser: true
});

app.route('/register');
app.route('/login');
app.route('/user');
app.route('/posts')
app.route('/posts/:id')
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/profile'));

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);

const PORT = process.env.PORT || 3500;

if (!module.parent) {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

module.exports = app;
