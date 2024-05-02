// Path: back-end/app.js

const express = require('express');
const app = express();
const port = 3000;
const route = require('./routers/index.js');

const connectDB = require('./app/config/db/index.js');

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