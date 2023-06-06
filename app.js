const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const app = express();
const Campground = require('./models/campground')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

app.listen(3000, () => {
    console.log('server running at port 3000');
})

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


app.get('/', (req, res) => {
    res.send('hi');
})



