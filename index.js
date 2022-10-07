const express = require("express");
const cors = require("cors");
const conn = require("./connection");
const userRoutes = require("./routes/user");
const goalsRoutes = require("./routes/goals");
const app = express();

app.use(cors({
  origin: '*',
  allowedHeaders: ['authorization', 'Content-type']
}));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// USER ROUTES
app.use('/user', userRoutes);
// GOALS ROUTES
app.use('/goal', goalsRoutes);

module.exports = app;