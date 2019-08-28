const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
app.use(cors());
require('dotenv').config();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

app.use(express.json({ extended: false }));
const { testdb, clouddb, NODE_ENV } = process.env;

mongoose.connect(NODE_ENV === 'test' ? testdb : clouddb, {
  useNewUrlParser: true
});

const swaggerDefinition = {
  info: {
    title: 'REST API for DEV CONNECTOR APP',
    version: '1.0.0',
    description: 'Rest API'
  },
  host: 'localhost:3000',
  basePath: '/'
};

const options = {
  swaggerDefinition,
  apis: ['../docs/*.yaml']
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.route('/register');
app.route('/login');
app.route('/user');
app.route('/posts');
app.route('/posts/:id');
app.route('/posts/:id/like');
app.route('/posts/:id/unlike');
app.route('/posts/:id/comment');
app.route('/posts/:post_id/comment/:comment_id');
app.route('/profile/me');

app.get('/', (req, res) => {
  res.status(200).send('Welcome to Dev Connect');
});
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
