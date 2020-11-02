require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const app = express();

const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())

app.use(require('./routes/user.js'));

//Here we need to specify the port of MongoDB running on our computer
// 'cafe' is the name of our DB. If it doesn't exist, Mongo will create it
mongoose.connect('mongodb://localhost:27017/cafe', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, (err, res) => {
    if (err) throw err;
    console.log('DataBase ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log('Listening to port ', process.env.PORT);
})