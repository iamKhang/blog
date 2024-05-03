// Path: back-end/app.js

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const route = require('./src/routers/index');
const connectDB = require('./src/app/config/db/');

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

connectDB();

route(app);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});