const express = require('express');
const { createResidential,getPropertiesByUserId,getAllResidentials } = require('../controllers/residentialController');

const residentialRoutes = express.Router();

residentialRoutes.post('/add', createResidential);
residentialRoutes.get('/getting',getPropertiesByUserId);
residentialRoutes.get('/getallresidentials',getAllResidentials);
module.exports = residentialRoutes;