const layoutModel = require('../models/layoutModel');
const propertyRatingModel = require('../models/propertyRatingModel');
const wishlistModel = require('../models/wishlistModel');
// Create a new field
const insertLayoutDetails = async (req, res) => {
    try {
   
        const {userId, role} = req.user.user;
console.log(req.user.user);
        const layoutDetailsData = {
           userId,
            role,
            ...req.body // Spread the rest of the fields from the request body
        };
        console.log(layoutDetailsData);
        const layoutDetails = new layoutModel(layoutDetailsData);
        await layoutDetails.save();
        res.status(201).json({ message: "layout details added successfully", success: true });
    } catch (error) {
        res.status(404).json({ message: "Error inserting layout details", error });
    }
};



// Function to get all layout properties added by that user
const getLayouts = async (req, res) => {
    try {
      const userId= req.user.user.userId;
      const layouts = await layoutModel.find({userId: userId});
      if(layouts.length===0)
        {
         return res.status(200).json([]);
        }
      res.status(200).json(layouts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


//get all layouts

  const getAllLayouts = async (req, res) => {
    try {
      const userId = req.user.user.userId;
      
      // Fetch all layouts
      const layouts = await layoutModel.find();
      
      if (layouts.length === 0) {
        return res.status(200).json([]);
      }
  
      // Extract property IDs
      const propertyIds = layouts.map(property => property._id.toString());
  
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
      // Add wishStatus to each layout item
      const updatedLayouts = layouts.map(layout => {
        const layoutObj = layout.toObject(); // Convert Mongoose document to plain object
        layoutObj.wishStatus = statusMap[layout._id.toString()] || 0;
        layoutObj.ratingStatus = ratingstatusMap[layout._id.toString()] || 0; // Default to 0 if not found
        return layoutObj;
      });
  
      res.status(200).json(updatedLayouts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };
  



// Export functions
module.exports = {
    insertLayoutDetails,getLayouts, getAllLayouts

};
