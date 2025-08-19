const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const router = require('./routes/admin');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

dotenv.config();

app.use(cors({
    origin: process.env.BACKEND_URL,
    credentials: true
}))

// -------------------------------- session for live

app.set('trust proxy', 1)

app.use(session({
    secret: process.env.SECRET_SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: 'none',
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}))

// --------------------------- session

// app.use(session({
//     secret: process.env.SECRET_SESSION_KEY,
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         secure: false,
//         maxAge: 24 * 60 * 60 * 1000,
//         httpOnly: true
//     },
// }))

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDb Connected'))
    .catch(() => console.log('Error Occured'))

app.use('/admin', router);

app.get('/', (req, res) => {
    res.render('adminLogin');
})

app.listen(process.env.PORT, () => {
    console.log('Server is started');
})

