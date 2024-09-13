const express = require('express');
const { getLocationByPincode,getMandalsByDistrict,getVillagesByMandal,getAllMandals,getAllVillages } = require('../controllers/locationController');

const locationRoutes = express.Router();

locationRoutes.get('/getallmandals',getAllMandals);
locationRoutes.get('/getallvillages',getAllVillages)
locationRoutes.get('/getlocationbypincode/:pincode', getLocationByPincode);
locationRoutes.get('/getmandals/:district',getMandalsByDistrict);
locationRoutes.get('/getvillagesbymandal/:mandal',getVillagesByMandal);
module.exports = locationRoutes;
