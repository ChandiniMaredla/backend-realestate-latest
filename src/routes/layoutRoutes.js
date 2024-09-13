const express = require('express');
const { insertLayoutDetails,getLayouts, getAllLayouts } = require('../controllers/layoutController');

const layoutRoutes = express.Router();

layoutRoutes.get('/getlayouts', getLayouts);
layoutRoutes.post('/insert', insertLayoutDetails);
layoutRoutes.get('/getalllayouts',getAllLayouts);

module.exports = layoutRoutes;
