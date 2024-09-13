const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
userId: {
type: String,
ref: 'users',
required: true
},
role: {
    type: Number,
    required: true
},
agentId: {
type: String,
required: true
},
firstName: {
type: String,
required: true
},
lastName: {
type: String,
required: true
},
email: {
type: String,
required: true
},
phoneNumber: {
type: Number,
required: true
},
profilePicture:{
type:String
},
date: {
type: Date,
required: true
},
timing: {
type: String, // Use Date for both date and time
required: true
},
location: {
    type: String,
    required: true
},
status:{
    type: Number,
    default:0,
    required: true
}
});

const bookingModel = mongoose.model('booking', bookingSchema);

module.exports = bookingModel;