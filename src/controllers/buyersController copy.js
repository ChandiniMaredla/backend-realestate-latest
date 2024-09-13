// Import necessary modules
const buyersModel = require('../models/buyersModel');

// Get all buyers
const getBuyers = async (req, res) => {
    try {
        const buyers = await buyersModel.find();
        res.status(200).send({ data: buyers });
    } catch (error) {
        res.status(500).json({ message: "Error fetching buyers", error });
    }
};

// Create a new buyer
const createBuyer = async (req, res) => {
    try {
        const buyer = new buyersModel(req.body);
        await buyer.save();
        res.status(201).json({ message: "Buyer added successfully", success: true });
    } catch (error) {
        res.status(400).json({ message: "Error creating buyer", error });
    }
};

// Update a buyer
const updateBuyer = async (req, res) => {
    try {
        const buyerId = req.params._id;
        const updateData = req.body;
        const buyer = await buyersModel.findByIdAndUpdate(buyerId, updateData, { new: true, runValidators: true });
        if (!buyer) {
            return res.status(404).json({ message: "Buyer not found", success: false });
        }
        res.status(200).json({ message: "Buyer updated successfully", success: true, buyer });
    } catch (error) {
        res.status(500).json({ message: "Error updating buyer", error });
    }
};

// Delete a buyer
const deleteBuyer = async (req, res) => {
    try {
        const buyerId = req.params._id;
        const buyer = await buyersModel.findByIdAndDelete(buyerId);
        if (!buyer) {
            return res.status(404).json({ message: "Buyer not found", success: false });
        }
        res.status(200).json({ message: "Buyer deleted successfully", success: true });
    } catch (error) {
        res.status(500).json({ message: "Error deleting buyer", error });
    }
};

// Export functions
module.exports = {
    getBuyers,
    createBuyer,
    updateBuyer,
    deleteBuyer
};
