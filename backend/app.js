const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');

const users = require('./routes/user');
const organizations = require('./routes/organization');

const ecanDB = process.env.DATABASE_HOST || 'localhost:27017/soar';
const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const hasAuth = username != null;
const authStr = hasAuth ? `${username}:${password}@` : '';

mongoose.connect(`mongodb://${authStr}${ecanDB}`, { useNewUrlParser: true }).then(
    () => { console.log('Database is connected') },
    err => { console.log('Can not connect to the database:', err) }
);

const app = express();
app.use(passport.initialize());
require('./passport')(passport);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/users', users);
app.use('/api/organizations', organizations);

const publicDirectory = path.join(__dirname, '..', 'public');
app.use(express.static(publicDirectory));
app.get('*', (_, res) =>
    res.type('html')
        .sendFile(path.join(publicDirectory, 'index.html'))
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
