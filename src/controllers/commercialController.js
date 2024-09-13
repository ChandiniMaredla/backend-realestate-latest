// controllers/commercialController.js
const Commercial = require('../models/commercialModel');
const wishlistModel = require('../models/wishlistModel');
const propertyRatingModel= require('../models/propertyRatingModel');
// Function to create a new commercial property
const createCommercial = async (req, res) => {
  try {
    const {userId, role} = req.user.user;
    console.log(req.user.user);
            const createcomm = {
               userId,
                role,
                ...req.body // Spread the rest of the fields from the request body
    };
      // console.log(createcomm);
      const commercialDetails = new Commercial(createcomm);
      await commercialDetails.save();


    res.status(201).json("property added successfully");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Function to get all commercial properties added by that user
const getCommercials = async (req, res) => {
  try {
    const userId= req.user.user.userId;
    const commercials = await Commercial.find({userId: userId});
    if(commercials.length===0)
      {
       return res.status(200).json([]);
      }
    res.status(200).json(commercials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to get all commercial properties
// const getAllCommercials = async (req, res) => {
//   try {
//     const userId=req.user.user.userId;
//     const commercials = await Commercial.find();
//     if(commercials.length===0)
//       {
//        return res.status(200).json([]);
//       }
//     res.status(200).json(commercials);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



const getAllCommercials = async (req, res) => {
  try {
    const userId = req.user.user.userId;
    
    // Fetch all commercials
    const commercials = await Commercial.find();
    
    if (commercials.length === 0) {
      return res.status(200).json([]);
    }

    // Extract property IDs
    const propertyIds = commercials.map(property => property._id.toString());

    // Fetch wishlist statuses for all property IDs
    const statuses = await wishlistModel.find({ userId: userId, propertyId: { $in: propertyIds } }).select('propertyId status');
    const ratingstatuses = await propertyRatingModel.find({ userId: userId, propertyId: { $in: propertyIds } }).select('propertyId status');
    // Create a map for quick status lookup
    const statusMap = statuses.reduce((map, item) => {
      map[item.propertyId.toString()] = item.status;
      return map;
    }, {});

    const ratingstatusMap = ratingstatuses.reduce((map, item) => {
      map[item.propertyId.toString()] = item.status;
      return map;
    }, {});
    // Add wishStatus to each commercial item
    const updatedCommercials = commercials.map(commercial => {
      const commercialObj = commercial.toObject(); // Convert Mongoose document to plain object
      commercialObj.wishStatus = statusMap[commercial._id.toString()] || 0;
      commercialObj.ratingStatus = ratingstatusMap[commercial._id.toString()] || 0; // Default to 0 if not found
      return commercialObj;
    });

    res.status(200).json(updatedCommercials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// Exporting the display function
module.exports = {
   createCommercial, getCommercials,getAllCommercials
};
