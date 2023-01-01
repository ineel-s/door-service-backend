const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    name :{
        type : String,
        required: true,
        trim: true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim:true
    },
    password:{
        type : String,
        required : true,
        trim:true
    },
    gender:{
        type:String,
        enum:['Male', 'Female', 'Others']
    },
    phoneNumber: {
        type : String,
        required: true,
        unique : true
    },
   
    address : {
        type: String,
        required: true,
    },
    role : {
        type : String,
        enum:[
            'customer',
            'provider',
            'admin'
        ],
        default : 'customer',
        trim:true
    },
    services:[
        {
            serviceID:{
                type: mongoose.Types.ObjectId,
                trim: true
            }
        }
    ]
});

const emailPat = /^[A-Za-z0-9_\.]+@(fynd|example)\.com$/;
const passwordPat = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;

userSchema.path('email').validate(function (value) {
    return emailPat.test(value);
});

userSchema.path('password').validate(function (value) {
    return passwordPat.test(value);
});

const SALT_FACTOR = 10;

console.log( this ); 

userSchema.pre( 'save', function( done ) { 
    const user = this; 

    if( !user.isModified( 'password' ) ) {
        done();
        return;
    }
    bcrypt.genSalt( SALT_FACTOR, function( err, salt ) {
        if( err ) {
            return done( err ); 
        }
        bcrypt.hash( user.password, salt, function( err, hashedPassword ) {
            if( err ) {
                return done( err );
            }
            user.password = hashedPassword;
            done();
        });
    })

    console.log( 'executes immediately' );
});


mongoose.model( 'User', userSchema );