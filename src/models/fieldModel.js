const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
userId: {
    type: String
},
role: {
    type: Number
},
propertyType: {
type: String,
default: "Agricultural land"
},
rating:{
  type:Number,
  default:0
},
ratingCount:{
  type:Number,
  default:0
},
status:{
  type:Number,
  default:0
},
  ownerDetails: {
    ownerName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    }
  },
  landDetails: {
    title: {
      type: String,
      required: false
    },
    surveyNumber: {
      type: String,
      required: true
    },
    size: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true
    },
    landType: {
      type: String,
      required: true
    },
    crops: {
      type: [String],
      required: true
    },
    litigation: {
      type: Boolean,
      required: true
    },
    litigationDesc: {
type: String
    },
    images: {
      type: [String],
      required: true
    },
    propertyDesc: {
      type: String
    }
  },
  address: {
    pinCode: {
      type: Number,
      required: false
    },
    country: {
      type: String,
      default: 'India'
    },
    state: {
      type: String,
      default: 'Andhra Pradesh'
    },
    district: {
      type: String,
      required: true
    },
    mandal: {
      type: String,
      required: true
    },
    village: {
      type: String,
      required: true
    }
  },
  amenities: {
    boreWell: {
      type: Boolean,
    },
    electricity: {
      type: Boolean,
    },
    distanceFromRoad: {
      type: String,
    },
    storageFacility: {
      type: Boolean,
    }
  }
});

const fieldModel = mongoose.model('fieldDetails', fieldSchema);

module.exports = fieldModel;
