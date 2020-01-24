const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const clientSchema = new mongoose.Schema({  
    names:{
        type:String
    },
    email: {
        type:String,
        max:255,
        min:6
    },
    mobile:{
        type:Number,
        unique:true
    },
    pin:{
        type:String,
        max:4,
        min:4
    }
}, {timestamps: true});

clientSchema.plugin(uniqueValidator, {message: 'User Exists.'});


module.exports = mongoose.model('Client', clientSchema);