const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
app.use(cors());
require('dotenv').config();

app.use(express.json({ extended: false }));

const { localdb,clouddb } = process.env;
mongoose.connect(localdb, { useNewUrlParser: true });

app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/profile'));

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
  console.log('Server Connected');
});
