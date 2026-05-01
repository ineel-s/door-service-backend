JWT_SECRET = require('dotenv').config();

const path = require('path')
const express = require('express');
const app = express();


const cors = require('cors')
app.use(express.static(path.join(process.cwd(), './public/dist')))
const { connect } = require('./db/init');
app.set('app-title', 'Door Service');

const PORT = process.env.SERVER_PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (origin === 'http://localhost:3000' || process.env.NODE_ENV === 'development') {
            return callback(null, true);
        }
        // For production, if you have a specific domain for your frontend
        // if (origin === 'https://your-production-frontend.com') {
        //     return callback(null, true);
        // }
        callback(new Error('Not allowed by CORS'));
    }
};

app.use(cors(corsOptions));

app.use('/auth', require('./routes/auth.routes'));

app.use('/category', require('./routes/serviceCategory.routes'));

app.use('/service', require('./routes/service.routes'));

app.use('/user', require('./routes/user.routes'));

app.use('/bookingservice', require('./routes/manageservice.routes'));

app.use(function (req, res, next) {
    res.sendFile(path.join(process.cwd(), './public/dist', 'index.html'));
});

connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`server started`);
        });
    })
    .catch(error => {
        process.exit(1);
    });