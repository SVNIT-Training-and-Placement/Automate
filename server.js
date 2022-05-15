const express = require('express');
const connectDB = require('./config/db');

const app = express();

//Connect Database
connectDB();

//Define routes
app.get('/', (req, res) => res.send('This is an API'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server Running on port ${PORT}`));
