require('dotenv').config();

const express = require('express');
const cors = require('cors')
const { connect } = require('./db/init');
const app = express();
app.set('app-title', 'Door Service');

const PORT = process.env.SERVER_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use( cors({
    origin: 'http://localhost:3001',
}));
app.use('/auth',require('./routes/auth.routes'));

app.use('/category', require('./routes/serviceCategory.routes'));

app.use('/service',require('./routes/service.routes'));

app.use('/user',require('./routes/user.routes'))

connect()
    .then(()=>{
        app.listen(PORT, ()=>{
            console.log(`server started on - http://localhost:${PORT}`);
        });
    })
    .catch(error =>{
        process.exit( 1 );
});