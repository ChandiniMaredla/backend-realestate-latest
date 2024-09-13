const mongoose = require('mongoose');

const agentRatingSchema = new mongoose.Schema({
    userId: {
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
agentId: {
    type: String,
    required: true
},
rating: {
    type: Number,
    required: true
},
review: {
    type: String,
}
});

const agentRatingModel = mongoose.model('agentRatings', agentRatingSchema);

module.exports = agentRatingModel;
