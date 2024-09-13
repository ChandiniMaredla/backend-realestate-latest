const mongoose = require("mongoose");

const residentialSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  propertyType: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  ratingCount: {
    type: Number,
    default: 0,
  },
  status: {
    type: "Number",
    default: 0,
  },
  owner: {
    ownerName: {
      type: String,
      required: true,
    },
    ownerEmail: {
      type: String,
      trim: true,
      required: true,
      sparse: true,
    },
    contact: {
      type: String,
      required: true,
    },
  },
  propertyDetails: {
    apartmentName: {
      type: String,
    },
    flatNumber: {
      type: Number,
    },
    apartmentLayout: {
      type: String,
    },
    flatSize: {
      type: String,
    },
    flatCost: {
      type: Number,
    },
    totalCost: {
      type: Number,
    },
    flatFacing: {
      type: String,
    },

    furnitured: {
      type: String,
    },
    propDesc: {
      type: String,
    },
  },
  address: {
    pinCode: {
      type: Number,
      required: false,
    },
    country: {
      type: String,
      default: "India",
    },
    state: {
      type: String,
      default: "Andhra Pradesh",
    },
    district: {
      type: String,
      required: true,
    },
    mandal: {
      type: String,
      required: true,
    },
    village: {
      type: String,
      required: true,
    },
  },
  amenities: {
    powerSupply: {
      type: Boolean,
    },
    waterFacility: {
      type: Boolean,
    },
    electricityFacility: {
      type: Boolean,
    },
    elevator: {
      type: Boolean,
    },

    watchman: {
      type: Boolean,
    },
    cctv: {
      type: Boolean,
    },
    medical: {
      type: Number,
    },
    // religious: {
    // type: Number,

    // },
    educational: {
      type: Number,
    },
    grocery: {
      type: Number,
    },
    gymFacility: {
      type: Boolean,
    },
  },
  propPhotos: {
    type: [String],
  },
});

const residentialModel = mongoose.model("residential", residentialSchema);

module.exports = residentialModel;
