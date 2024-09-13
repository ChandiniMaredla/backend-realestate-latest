// Import necessary modules
const fieldModel = require('../models/fieldModel');
const propertyRatingModel = require('../models/propertyRatingModel');
const wishlistModel = require('../models/wishlistModel');
// Get all fields which are added by that user
const getFields = async (req, res) => {
    try {
        const userId=req.user.user.userId;
        const fields = await fieldModel.find({userId: userId});
        if(fields.length===0){
            return res.status(200).json({data:[]})
        }
        res.status(200).send({ data: fields });
    } catch (error) {
        res.status(500).json({ message: "Error fetching fields", error });
    }
};

// Create a new field
const insertFieldDetails = async (req, res) => {
    try {
   
        const {userId, role} = req.user.user;
console.log(req.user.user);
        const fieldDetailsData = {
           userId,
            role,
            ...req.body // Spread the rest of the fields from the request body
        };
        console.log(fieldDetailsData);
        const fieldDetails = new fieldModel(fieldDetailsData);
        await fieldDetails.save();
        res.status(201).json({ message: "field details added successfully", success: true });
    } catch (error) {
        res.status(400).json({ message: "Error inserting field details", error });
    }
};

//get all the fields
// const getAllFields = async (req, res) => {
//     try {
//         const userId=req.user.user.userId;
//         const fields = await fieldModel.find();
//         if(fields.length===0){
//            return res.status(200).json({data:[]})
//         }
//         const propertyIds = fields.map(property => property._id.toString());

//         // You can now use this array for further queries or processing
//     const wishStatus=[];
//     for(let i=0;i<propertyIds.length;i++){
// const status= await wishlistModel.find({userId:userId,propertyId:propertyIds[i]},{status:1});
// if (status.length > 0) {
//     wishStatus.push(status[0].status);
// } else {
//     wishStatus.push(0); // Push a default value (e.g., 0) if no status is found
// }
// }
// console.log(wishStatus.length);
//         res.status(200).send({ data: fields, wishStatus: wishStatus });
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching fields", error });
//     }
// };


const getAllFields = async (req, res) => {
    try {
      const userId = req.user.user.userId;
      
      // Fetch all fields
      const fields = await fieldModel.find();
  
      if (fields.length === 0) {
        return res.status(200).json({ data: [] });
      }
  
      // Extract property IDs
      const propertyIds = fields.map(field => field._id.toString());
  
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
      // Add wishStatus to each field item
      const updatedFields = fields.map(field => {
        const fieldObj = field.toObject(); // Convert Mongoose document to plain object
        fieldObj.wishStatus = statusMap[field._id.toString()] || 0; // Default to 0 if not found
        fieldObj.ratingStatus = ratingstatusMap[field._id.toString()] || 0; // Default to 0 if not found
        return fieldObj;
      });
  
      res.status(200).json({ data: updatedFields });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching fields", error });
    }
  };
  


 

//get fields by district
const getByDistrict = async(req,res)=>{
    try{
const properties= await fieldModel.find({},{'landDetails.images':1,'address.district':1,'landDetails.title':1,'landDetails.size':1,'landDetails.totalPrice':1}).exec();
if(properties.length===0){
    return res.status(200).json([])
 }
 res.status(200).send(properties);
} catch (error) {
 res.status(500).json({ message: "Error fetching fields", error });
}
}

// Export functions
module.exports = {
    getFields,
    insertFieldDetails,
    getAllFields,
    getByDistrict
};
