const express = require('express');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel'); 
const saltRounds = 10;

// Controller to get all users
const getUsers = async (req, res) => {
    try {
        const data = await userModel.find();
        res.send(data);
    } catch (error) {
        res.status(500).send(error);
    }
};

//get users based on role
//get agents
const getUsersByRole = async (req, res) => {

    try {
    const {role} = req.params;
    console.log(role);
    if (isNaN(role)) {
    return res.status(400).json({ message: 'Invalid role parameter' });
    }
    
    //if (role === 1) {
    // Query users with role 1 (agents)
    const users = await userModel.find({ role: role });
    
    if (users.length === 0) {
    return res.status(404).json({ message: 'No users found with this role' });
    }
    
    res.status(200).json(users);
    // } else {
    // res.status(400).json({ message: 'Invalid role. Only role 3 is allowed for agents.' });
    // }
    } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
    };
    

// Controller to create a new user
const createUser = async (req, res) => {
    try {
        const user = new userModel({ ...req.body });
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
        if(user.profilePicture==="")
        {
          user.profilePicture="https://res.cloudinary.com/ddv2y93jq/image/upload/v1726132403/zsafjroceoneetkmz5jq.webp";
        }
        if (isNaN(user.role)) {
          return res.status(400).json({ message: 'Invalid role parameter' });
          }
        console.log(user);
user.firstName=user.firstName.charAt(0).toUpperCase()+user.firstName.slice(1).toLowerCase();
user.lastName=user.lastName.charAt(0).toUpperCase()+user.lastName.slice(1).toLowerCase();
        user.save()
            .then(() => {
                res.status(201).json({ message: "User Added Successfully", success: true,user:user });
            })
            .catch((error) => {
              console.log(error);
                res.status(400).send({message:"User with this email already exists", error: error.errmsg});
            });
    } catch (error) {
      console.log(error);
        res.status(500).send(error);
    }
};

// Controller to update a user
const updateUser = async (req, res) => {
     const updateData = req.body;
const userId= req.user.user.userId;
if (updateData.hasOwnProperty('password')) {
  // Password key is present, encrypt it
  bcrypt.hash(updateData.password, saltRounds, async (err, hashedPassword) => {
    if (err) {
      // Handle the error
      return res.status(500).send({ message: 'Error hashing password', error: err.message });
    }

    // Update the password with the hashed version
    updateData.password = hashedPassword;
  
    // Now proceed to update the user data in the database
    try {
      const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
      res.send({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
      res.status(500).send({ message: 'Error updating user', error: error.message });
    }
  });
} else {
  // If there's no password, just update the other fields
  try {
    const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
    res.send({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).send({ message: 'Error updating user', error: error.message });
  }
}

};

// Controller to delete a user
const deleteUser = async (req, res) => {
    try {
        const userId = req.user.user.userId;

        const user = await userModel.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found", success: false });
        }

        res.send({ message: "User Deleted Successfully", success: true });
    } catch (error) {
        res.status(500).send(error);
    }
};

//getProfile
const getProfile = async (req, res) => {
    try {
      // Assuming userId is provided in the request (e.g., from req.user)
      const userId = req.user.user.userId; // Adjust this based on your setup
  
      // Define the fields you want to retrieve
      const fields = 'profilePicture firstName lastName pinCode city email phoneNumber';
  
      // Find the user and project the specified fields
      const user = await userModel.findById(userId, fields).exec();
  
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Error retrieving user profile', error });
    }
  };
  
//get user names based on role
const namesBasedOnRole= async (req,res)=>{
  try{
const {role}= req.params;
const fields='firstName lastName';
const details= await userModel.find({role:role}, fields);
let names=[];
for(let element of details){
  let fullName= element.firstName+" "+element.lastName;
  names.push(fullName);
}
 if (names) {
 res.status(200).json(names.sort());
} else {
  res.status(404).json({ message: 'Users not found' });
}
  }
  catch(error){
 console.error('Error fetching user names:', error);
res.status(500).json({ message: 'Error retrieving names', error });
  }
}


module.exports = {
    createUser,
    deleteUser,
    getUsers,
    updateUser,
    getProfile,
    getUsersByRole,
    namesBasedOnRole
};
