const express = require('express');
const connectDB = require('./config/db');

const app = express();

//Connect Database
connectDB();

//Init Middleware
app.use(express.json({ extended: false }));

//Define routes
app.get('/', (req, res) => res.send('This is an API'));

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/jobs', require('./routes/api/jobs'));
app.use('/api/admin', require('./routes/api/admin'));
app.use('/api/activejob', require('./routes/api/activejob'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server Running on port ${PORT}`));
