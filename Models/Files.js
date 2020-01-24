const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const receiptSchema = new mongoose.Schema({
    userId: {
    	type:String,
    	required:true
    },
    filePath: {
    	type:String,
    	required:true
    },
    fileName: {
    	type:String,
    	required:true,
    	unique:true
    }
}, {timestamps: true});

receiptSchema.plugin(uniqueValidator, {message: 'File Exists.'});

module.exports = mongoose.model('receiptfile', receiptSchema);