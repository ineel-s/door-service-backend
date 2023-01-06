JWT_SECRET = require('dotenv').config();

const path = require('path')
const express = require('express');
const multer = require('multer');
const app = express();


const cors = require('cors')
app.use(express.static(path.join(process.cwd(), './public/dist')))
const { connect } = require('./db/init');
app.set('app-title', 'Door Service');

const PORT = process.env.SERVER_PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
if (process.env.NODE_ENV === 'development') {
    app.use(cors());
}


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
            console.log(`server started on - http://localhost:${PORT}`);
        });
    })
    .catch(error => {
        process.exit(1);
    });