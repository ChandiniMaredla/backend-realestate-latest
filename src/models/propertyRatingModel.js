const mongoose = require('mongoose');

const propertyRatingSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    status:{
type:"Number",
default:0
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    role:{
        type:Number,
        required: true
    },
propertyId: {
    type: String,
    required: true
},
propertyType:{
    type: String
},
rating: {
    type: Number,
    required: true
},
review: {
    type: String,
}
});

const propertyRatingModel = mongoose.model('propertyRatings', propertyRatingSchema);

module.exports = propertyRatingModel;
