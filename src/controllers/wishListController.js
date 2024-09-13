const { Request, Response } = require("express");
const wishlistModel = require("../models/wishlistModel");
const fieldModel = require("../models/fieldModel");
const commercialModel = require("../models/commercialModel");
const residentialModel = require("../models/residentialModel");
const layoutModel = require("../models/layoutModel");
// Add a property to the wishlist
const addToWishlist = async (req, res) => {
  const userId = req.user.user.userId;
  const status=1;
  try {
    //req.body contains propertyType and propertyId
    const wishlist = {
      userId,
      status,
      ...req.body,
    };
    const propertyId= req.body.propertyId;
    const propertycheck= await wishlistModel.find({propertyId:propertyId,userId:userId});
    if(propertycheck.length!==0){
        return res.status(409).json({message:"Property is already added to wishlist"})
    }
    // Create a new wishlist item
    const wishlistItem = new wishlistModel(wishlist);
    // Save the wishlist item
    await wishlistItem.save();
    res
      .status(201)
      .json({
        message: "Property added to wishlist successfully",
        success: true,
      });
  } catch (error) {
    console.error("Error adding property to wishlist:", error);
    res
      .status(500)
      .json({ message: "Error adding property to wishlist", error });
  }
};


//get wishlist items
const getWishlist = async (req, res) => {
  try {
    const userId = req.user.user.userId;
    const wishlistItems = await wishlistModel.find({ userId: userId });
//console.log(wishlistItems);
    if (!wishlistItems || wishlistItems.length === 0) {
      return res.status(404).json({ message: "Your wishlist is empty" });
    }

    const filteredWishlistItems = wishlistItems.map((item) => ({
      propertyId: item.propertyId,
      propertyType: item.propertyType,
    }));

    let propertyIds = [];
    let propertyTypes = [];

    for (let element of filteredWishlistItems) {
      propertyIds.push(element.propertyId);
      propertyTypes.push(element.propertyType);
    }

    let fields = [];
    let residentials = [];
    let commercials = [];
    let layouts=[];

    for (let i = 0; i < propertyIds.length; i++) {
      if (propertyTypes[i] === "Agricultural") {
        const result = await fieldModel.findOne(
          { _id: propertyIds[i] },
          {
            "landDetails.images": 1,
            "landDetails.totalPrice": 1,
            "landDetails.title": 1,
            "landDetails.size": 1,
            "address.district": 1,
          }
        );
        if (result) {
          fields.push({
            propertyId:propertyIds[i],
            propertyType:propertyTypes[i],
            images: result.landDetails.images,
            price: result.landDetails.totalPrice,
            size: result.landDetails.size,
            title: result.landDetails.title,
            district: result.address.district,
          });
        }
      } else if (propertyTypes[i] === "Commercial") {
        const result = await commercialModel.findOne(
          { _id: propertyIds[i] },
          {
            "propertyDetails.uploadPics": 1,
            "propertyDetails.landDetails": 1,
            propertyTitle: 1,
          }
        );
        if (result) {
          let price;
          let size;
          if (result.propertyDetails.landDetails.sell.landUsage.length !== 0) {
            price = result.propertyDetails.landDetails.sell.totalAmount;
            size = result.propertyDetails.landDetails.sell.plotSize;
          } else if (
            result.propertyDetails.landDetails.rent.landUsage.length !== 0
          ) {
            price = result.propertyDetails.landDetails.rent.totalAmount;
            size = result.propertyDetails.landDetails.rent.plotSize;
          } else {
            price = result.propertyDetails.landDetails.lease.totalAmount;
            size = result.propertyDetails.landDetails.lease.plotSize;
          }
          commercials.push({
            propertyId:propertyIds[i],
            propertyType:propertyTypes[i],
            images: result.propertyDetails.uploadPics,
            price: price, //result.propertyDetails.landDetails.totalPrice, //price
            size: size, //result.propertyDetails.landDetails.plotSize, //size
            title: result.propertyTitle,
            district: result.propertyDetails.landDetails.address.district,
          });
        }
      } else if(propertyTypes[i] === "Residential") {
        const result = await residentialModel.findOne(
          { _id: propertyIds[i] },
          {
            propPhotos: 1,
            "propertyDetails.flatCost": 1,
            "propertyDetails.flatSize": 1,
            "propertyDetails.apartmentName": 1,
            "address.district": 1,
          }
        );
        if (result) {
          residentials.push({
            propertyId:propertyIds[i],
            propertyType:propertyTypes[i],
            images: result.propPhotos,
            price: result.propertyDetails.flatCost,
            size: result.propertyDetails.flatSize,
            title: result.propertyDetails.apartmentName,
            district: result.address.district,
          });
        }
      }
      else{
        const result = await layoutModel.findOne(
            { _id: propertyIds[i] },
            {
              uploadPics: 1,
              "layoutDetails.layoutTitle": 1,
              "layoutDetails.plotSize": 1,
              "layoutDetails.totalAmount": 1,
              "layoutDetails.address.district": 1,
            }
          );
          if (result) {
            layouts.push({
              propertyId:propertyIds[i],
              propertyType:propertyTypes[i],
              images: result.uploadPics,
              price: result.layoutDetails.totalAmount,
              size: result.layoutDetails.plotSize,
              title: result.layoutDetails.layoutTitle,
              district: result.layoutDetails.address.district,
            });
          }
      }
    }

    //response for empty wishlist
    if (!fields && !commercials && !residentials && !layouts) {
      res.status(404).json({ message: "Your wishlist is empty" });
    }
    res
      .status(200)
      .json({
        title1: "Agricultural property details",
        fields: fields,
        title2: "Commercial property details",
        commercials: commercials,
        title3: "Residential property details",
        residentials: residentials,
        title4: "Layout property details",
        layouts: layouts
      });
  } catch (error) {
    res.status(500).json({ message: "Error fetching wishlist items", error });
  }
};

//delete from wishlist by propertyid
const deleteFromWishlist = async (req, res) => {
  try {
    const userId = req.user.user.userId;
    console.log(userId);
    const { propertyId } = req.params;
    const deletedItem = await wishlistModel.findOneAndDelete({
      userId,
      propertyId,
    });

    if (!deletedItem) {
      return res
        .status(404)
        .json({ message: "Wishlist item not found", success: false });
    }

    res
      .status(200)
      .json({
        message: "Property removed from wishlist successfully",
        success: true,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing property from wishlist", error });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  deleteFromWishlist,
};
