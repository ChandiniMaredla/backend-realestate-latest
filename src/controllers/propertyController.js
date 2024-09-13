// controllers/fieldController.js

const propertyRatingModel = require("../models/propertyRatingModel");
const residentialModel = require("../models/residentialModel");
const commercialModel = require("../models/commercialModel");
const fieldModel = require("../models/fieldModel");
const layoutModel = require("../models/layoutModel");

const getPropertiesByLocation = async (req, res) => {
  try {
    const { location } = req.params;

    if (!location) {
      return res
        .status(400)
        .json({ message: "Location parameter is required" });
    }

    // Create a query object
    let query = {};

    // Check if the location input is a number (for pinCode)
    if (!isNaN(location)) {
      // Convert to a number if it is numeric
      const pinCode = Number(location);
      query["address.pinCode"] = pinCode;
    } else {
      // Otherwise, search in other fields
      query["$or"] = [
        { "address.village": location },
        { "address.mandal": location },
        { "address.district": location },
        { "address.state": location },
      ];
    }

    // Execute the query
    const properties = await fieldModel.find(query);

    if (properties.length === 0) {
      return res.status(404).json({ message: "No properties found" });
    }

    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//getPropertyByUserId
const getPropertiesByUserId = async (req, res) => {
  try {
    const userId = req.user.user.userId;
    console.log(userId);
    const properties = await fieldModel.find({ userId: userId });
    if (properties.length === 0) {
      return res.status(404).json({ message: "No properties found" });
    }

    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get all properties by district----- for landing page
const getAllProperties = async (req, res) => {
  try {
    // Define arrays to store the different property types
    let fields = [];
    let residentials = [];
    let commercials = [];
    let layouts = [];

    // Fetch data from Field properties collection
    const fieldProperties = await fieldModel
      .find(
        {},
        {
          "landDetails.images": 1,
          "address.district": 1,
          "landDetails.title": 1,
          "landDetails.size": 1,
          "landDetails.totalPrice": 1,
        }
      )
      .exec();

    // Iterate over field properties and push to the fields array
    fieldProperties.forEach((property) => {
      fields.push({
        images: property.landDetails.images,
        price: property.landDetails.totalPrice,
        size: property.landDetails.size,
        title: property.landDetails.title,
        district: property.address.district,
      });
    });

    // Fetch data from Residential properties collection
    const residentialProperties = await residentialModel
      .find(
        {},
        {
          propPhotos: 1,
          "propertyDetails.apartmentName": 1,
          "propertyDetails.flatCost": 1,
          "propertyDetails.flatSize": 1,
          "address.district": 1,
        }
      )
      .exec();

    // Iterate over residential properties and push to the residentials array
    residentialProperties.forEach((property) => {
      residentials.push({
        images: property.propPhotos,
        price: property.propertyDetails.flatCost,
        size: property.propertyDetails.flatSize,
        title: property.propertyDetails.apartmentName,
        district: property.address.district,
      });
    });

    // Fetch data from Commercial properties collection
    const commercialProperties = await commercialModel
      .find(
        {},
        {
          "propertyDetails.landDetails": 1,
          "propertyDetails.uploadPics": 1,
          propertyTitle: 1,
        }
      )
      .exec();

    // Iterate over commercial properties and extract necessary fields
    commercialProperties.forEach((property) => {
      let price, size;
      const { landDetails } = property.propertyDetails;

      // Check if land is for sale, rent, or lease
      if (landDetails.sell?.landUsage?.length > 0) {
        price = landDetails.sell.totalAmount;
        size = landDetails.sell.plotSize;
      } else if (landDetails.rent?.landUsage?.length > 0) {
        price = landDetails.rent.totalAmount;
        size = landDetails.rent.plotSize;
      } else if (landDetails.lease?.landUsage?.length > 0) {
        price = landDetails.lease.totalAmount;
        size = landDetails.lease.plotSize;
      }

      commercials.push({
        images: property.propertyDetails.uploadPics,
        price: price,
        size: size,
        title: property.propertyTitle,
        district: landDetails?.address?.district,
      });
    });

    // Fetch data from Layout properties collection
    const layoutProperties = await layoutModel
      .find(
        {},
        {
          uploadPics: 1,
          "layoutDetails.layoutTitle": 1,
          "layoutDetails.plotSize": 1,
          "layoutDetails.totalAmount": 1,
          "address.district": 1,
        }
      )
      .exec();

    // Iterate over layout properties and push to the layouts array
    layoutProperties.forEach((property) => {
      layouts.push({
        images: property.uploadPics,
        price: property.layoutDetails.totalAmount,
        size: property.layoutDetails.plotSize,
        title: property.layoutDetails.layoutTitle,
        district: property.address?.district,
      });
    });

    // Combine all properties into one array
    const allProperties = [
      ...fields,
      ...residentials,
      ...commercials,
      ...layouts,
    ];

    // Check if any properties were found
    if (allProperties.length === 0) {
      return res.status(404).json({ message: "No properties found" });
    }

    // Send the combined result back to the client
    res.status(200).json(allProperties);
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: "Error fetching properties", error });
  }
};


const getPropertiesByType = async (req, res) => {
  const { type } = req.params; // Get property type from path parameters

  try {
    let properties;

    // Fetch data based on property type
    switch (type.toLowerCase()) {
      case "agricultural":
        properties = await fieldModel.find().exec();
        break;
      case "residential":
        properties = await residentialModel.find().exec();
        break;
      case "commercial":
        properties = await commercialModel.find().exec();
        break;
        case "layout":
        properties = await layoutModel.find().exec();
        break;
      default:
        return res.status(400).json({ message: "Invalid property type" });
    }

    // Check if any properties were found
    if (properties.length === 0) {
      return res.status(404).json({ message: "No properties found" });
    }

    // Send the result back to the client
    res.status(200).json(properties);
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: "Error fetching properties", error });
  }
};

//insertPropertyRatings
const insertPropertyRatings = async (req, res) => {
  // try{

  //     const userId = req.user.user.userId;
  //     const firstName= req.user.user.firstName;
  //     const lastName = req.user.user.lastName;
  //       const role= req.user.user.role;
  //     console.log(userId);
  //     if (!userId) {
  //         return res.status(400).json({ message: "User ID is missing in request", success: false });
  //     }

  //     const ratingsData = {
  //        userId,
  //        firstName,
  //        lastName,
  //            role,
  //         ...req.body // Spread the rest of the fields from the request body
  //     };
  //     //console.log(fieldDetailsData);
  //     const ratings = new propertyRatingModel(ratingsData);
  //     await ratings.save();
  //     res.status(201).json({ message: "rating details added successfully", success: true });
  // } catch (error) {
  //     res.status(400).json({ message: "Error inserting rating details", error });
  // }

  try {
    const userId = req.user.user.userId;
    const firstName = req.user.user.firstName;
    const lastName = req.user.user.lastName;
    const role = req.user.user.role;
    const status = 1;
    if (!userId) {
      return res
        .status(400)
        .json({ message: "User ID is missing in request", success: false });
    }

    const { propertyId, propertyType, rating, review } = req.body;

    // Insert the new rating into the propertyRating collection
    const ratingsData = {
      userId,
      firstName,
      lastName,
      role,
      status,
      propertyId,
      propertyType,
      rating,
      review,
    };
    const newRating = new propertyRatingModel(ratingsData);
    await newRating.save();

    // Fetch all ratings for this propertyId to calculate the average rating
    const ratings = await propertyRatingModel.find({ propertyId });
    const totalRatings = ratings.length;
    const sumRatings = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    const avgRating = (sumRatings / totalRatings).toFixed(2); // Calculate the average rating

    // Determine which property type schema to update based on the propertyType field
    let propertyModel;
    if (propertyType === "Agricultural land") {
      propertyModel = fieldModel;
    } else if (propertyType === "Commercial") {
      propertyModel = commercialModel;
    } else if (propertyType === "Residential") {
      propertyModel = residentialModel;
    } else if (propertyType === "Layout") {
      propertyModel = layoutModel;
    } else {
      return res
        .status(400)
        .json({ message: "Invalid property type", success: false });
    }

    // Update the property rating in the corresponding schema
    if (propertyModel) {
      const updatedProperty = await propertyModel.findOneAndUpdate(
        { _id: propertyId }, // Ensure propertyId is the _id
        { rating: avgRating, ratingCount: totalRatings }, // Update the rating with the new average
        { new: true } // Return the updated document
      );

      if (!updatedProperty) {
        return res
          .status(404)
          .json({
            message: `Property not found in ${propertyType} schema`,
            success: false,
          });
      }
    }

    res
      .status(201)
      .json({
        message:
          "Rating details added successfully, and average rating updated",
        success: true,
        avgRating,
      });
  } catch (error) {
    console.error(
      "Error inserting rating details or updating the property rating:",
      error
    ); // Log the error
    res
      .status(500)
      .json({
        message:
          "Error inserting rating details or updating the property rating",
        error,
      });
  }
};

//get property ratings
//api for displaying ratings of an agent, agentId is sent through path params
const getPropertyRatings = async (req, res) => {
  try {
    const { propertyId } = req.params; // Extract agentId from the token
    console.log(propertyId);
    const ratings = await propertyRatingModel.find({ propertyId: propertyId });
    if (ratings.length === 0) {
      return res.status(404).json({ message: "No ratings found" });
    }

    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get properties by id and type
const getPropertiesById = async (req, res) => {
  try {
    const { propertyType, propertyId } = req.params;
    let properties;

    if (propertyType === "Agricultural") {
      properties = await fieldModel.findOne({ _id: propertyId });
    } else if (propertyType === "Residential") {
      properties = await residentialModel.findOne({ _id: propertyId });
    } else if (propertyType === "Layout") {
      properties = await layoutModel.findOne({ _id: propertyId });
    }else {
      properties = await commercialModel.findOne({ _id: propertyId });
    }

    if (!properties) {
      return res.status(404).json({ message: "No properties found" });
    }
    console.log(properties);
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//mark a property as sold(1)
// Controller method to update status to 1 based on propertyId and type
const updatePropertyStatus = async (req, res) => {
  const { propertyType, propertyId } = req.body;
  let model;

  // Determine the model based on type
  switch (propertyType.toLowerCase()) {
    case "residential":
      model = residentialModel;
      break;
    case "commercial":
      model = commercialModel;
      break;
    case "agricultural land":
      model = fieldModel;
      break;
    case "layout":
      model = layoutModel;
      break;
    default:
      return res.status(400).json({ error: "Invalid property type specified" });
  }

  try {
    // Update the document with the specified propertyId
    const result = await model.findByIdAndUpdate(
      propertyId,
      { $set: { status: 1 } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json({ message: "Status updated successfully", result });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Failed to update status" });
  }
};

//reset the ratings
const resetRatings = async (req, res) => {
  try {
    await fieldModel.updateMany(
      {}, // No filter, so all documents are selected
      {
        $set: {
          // rating: 0,
          //ratingCount: 0
          status: 0,
        },
      }
    );
    await commercialModel.updateMany(
      {}, // No filter, so all documents are selected
      {
        $set: {
          // rating: 0,
          //ratingCount: 0
          status: 0,
        },
      }
    );
    await residentialModel.updateMany(
      {}, // No filter, so all documents are selected
      {
        $set: {
          // rating: 0,
          //ratingCount: 0
          status: 0,
        },
      }
    );
    await layoutModel.updateMany(
      {}, // No filter, so all documents are selected
      {
        $set: {
          // rating: 0,
          //ratingCount: 0
          status: 0,
        },
      }
    );
    res.send("updated");
  } catch (error) {
    res.status(500).json({ error: "Failed to update status" });
  }
};

module.exports = {
  getPropertiesByLocation,
  getPropertiesByUserId,
  insertPropertyRatings,
  getPropertiesByType,
  getPropertyRatings,
  getPropertiesById,
  getAllProperties,// for landing page
  updatePropertyStatus,
  resetRatings,
};
