const propertyRatingModel = require('../models/propertyRatingModel');
const residentialModel = require('../models/residentialModel');
const wishlistModel = require('../models/wishlistModel');
const createResidential = async (req, res) => {
try {
// Extract userId from req.user
const userId = req.user.user.userId;

// Log request body and userId for debugging
console.log('Request Body:', req.body);
console.log('User ID:', userId);

// Check if email is null or undefined
if (req.body.owner && req.body.owner.ownerEmail === null) {
console.log("email",req.body.owner.ownerEmail);
return res.status(400).send({ message: 'Email cannot be null' });
}

// Create a new instance of the residential model with data from the request body
const residential = new residentialModel({ userId, ...req.body });

// Save the residential document to the database
await residential.save();

// Send a success response
res.send({ message: "Residential Property Added Successfully", success: true });
} catch (error) {
// Log detailed error information
console.error('Error Details:', error);

// Handle any errors and send response
res.status(400).send({ message: "Error Adding Residential Property", error: error.message || error });
}
};



const getPropertiesByUserId = async (req, res) => {
try {
// Extract userId from req.user which should be set by authentication middleware
const userId = req.user.user.userId;

// Log userId for debugging
console.log('User ID:', userId);

// Query the residentialModel collection to find properties with the specified userId
const properties = await residentialModel.find({ userId }).exec();

if (properties.length === 0) {
return res.status(200).json([]);
}

// Send the found properties as the response
res.status(200).json(properties);
} catch (error) {
// Log detailed error information
console.error('Error Details:', error);

// Handle any errors and send response
res.status(500).json({ message: 'Error retrieving properties', error: error.message || error });
}
};

//get all residential props
// const getAllResidentials = async (req, res) => {
//     try {
// const userId=req.user.user.userId;
//     // Query the residentialModel collection to find properties with the specified userId
//     const properties = await residentialModel.find();
//     if (properties.length === 0) {
//     return res.status(200).json([]);
//     }
//     const propertyIds = properties.map(property => property._id.toString());

//     // You can now use this array for further queries or processing
//     console.log('Property IDs:', propertyIds);
//     // Send the found properties as the response
//     res.status(200).json(properties);
//     } catch (error) {
//     // Log detailed error information
//     console.error('Error Details:', error);
//     // Handle any errors and send response
//     res.status(500).json({ message: 'Error retrieving properties', error: error.message || error });
//     }
//     };

const getAllResidentials = async (req, res) => {
    try {
        const userId = req.user.user.userId;

        // Query the residentialModel collection to find all residential properties
        const properties = await residentialModel.find();
        
        if (properties.length === 0) {
            return res.status(200).json([]);
        }

        // Extract all property IDs from the properties and store them in an array
        const propertyIds = properties.map(property => property._id.toString());

        // Prepare to store the wishlist status
        const wishStatus = await Promise.all(
            propertyIds.map(async propertyId => {
                const statusEntry = await wishlistModel.findOne({ userId, propertyId }, { status: 1 });
                return { propertyId, status: statusEntry ? statusEntry.status : 0 };
            })
        );

         // Prepare to store the rating status
         const ratingStatus = await Promise.all(
            propertyIds.map(async propertyId => {
                const rating = await propertyRatingModel.findOne({ userId, propertyId }, { status: 1 });
                return { propertyId, status: rating ? rating.status : 0 };
            })
        );

        // Combine property data with wishlist status
        const response = properties.map(property => {
            const statusEntry = wishStatus.find(entry => entry.propertyId === property._id.toString());
            const rating=ratingStatus.find(entry => entry.propertyId === property._id.toString());
            return {
                ...property.toObject(),
                wishlistStatus: statusEntry ? statusEntry.status : 0,
                ratingStatus: rating?rating.status : 0
            };
        });

        // Send the combined data as the response
        res.status(200).json(response);

    } catch (error) {
        // Log detailed error information
        console.error('Error Details:', error);
        // Handle any errors and send response
        res.status(500).json({ message: 'Error retrieving properties', error: error.message || error });
    }
};

    


module.exports = { createResidential,getPropertiesByUserId ,getAllResidentials};