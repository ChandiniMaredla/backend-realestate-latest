const express = require('express');
const { getBuyers, createBuyer } = require('../controllers/buyersController copy');

const buyersRoutes = express.Router();

buyersRoutes.get('/getbuyerdetails', getBuyers);
buyersRoutes.post('/create', createBuyer);
// buyersRoutes.put('/update/:_id', updateBuyer);
// buyersRoutes.delete('/delete/:_id', deleteBuyer);

module.exports = buyersRoutes;
