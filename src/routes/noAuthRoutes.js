const express = require('express');
const { userLoginController } = require('../controllers/noAuthController');
const { display } = require('../controllers/defaultController');
const { createUser } = require('../controllers/userController');
const {getAllProperties,resetRatings}= require('../controllers/propertyController');
const {getByDistrict}= require('../controllers/fieldController');

const noAuthRouter = express.Router();

noAuthRouter.put('/reset',resetRatings);
noAuthRouter.get('/getallprops',getAllProperties);
noAuthRouter.get('/getbydist',getByDistrict);
noAuthRouter.post('/login', userLoginController);
noAuthRouter.post('/create', createUser);

noAuthRouter.get('/hi', display);

module.exports = noAuthRouter;
