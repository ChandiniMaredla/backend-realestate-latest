const express = require('express');
const { getPropertiesByLocation, getPropertiesByUserId, updatePropertyStatus,getAllProperties,insertPropertyRatings,getPropertiesByType, getPropertyRatings, getPropertiesById } = require('../controllers/propertyController');

const propertyRoutes = express.Router();

propertyRoutes.put('/markassold/',updatePropertyStatus)
propertyRoutes.get('/getpropbyid',getPropertiesByUserId);
propertyRoutes.get('/:location', getPropertiesByLocation);
propertyRoutes.get('/getproprating/:propertyId',getPropertyRatings);
propertyRoutes.post('/insertproprating',insertPropertyRatings);
propertyRoutes.get('/getpropbyid/:propertyType/:propertyId',getPropertiesById);
propertyRoutes.get('/getpropbytype/:type',getPropertiesByType);
module.exports = propertyRoutes;
