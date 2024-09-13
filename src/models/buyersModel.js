const mongoose = require('mongoose');
const buyerSchema = new mongoose.Schema({
    propertyName: {
      type: String,
      required: true,
    },
    Location: {
      type: String,
      required: true,
    },
    OwnerName: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    size: {
      units: {
        type: Number,
      },
      acres: {
        type: Number,
      },
      cents: {
        type: Number,
      },
    },
    distance: {
      type: Number,
    },
    litigation: {
      type: Boolean,
    },
    price: {
      type: Number, // Corrected to be of type Number
    },
    amenities: {
      boreWells: {
        type: Boolean,
      },
      electriCity: {
        type: Boolean,
      },
    },
    features: {
      type: String,
    },
    yearofCon: {
      type: Number,
    },
    reSale: {
      type: Boolean,
    },
    propertyImages: {
      type: String,
    },
  });
  
  const buyersModel = mongoose.model('buyers', buyerSchema);
  
  module.exports = buyersModel;