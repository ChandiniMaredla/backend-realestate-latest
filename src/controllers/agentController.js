const agentRatingModel = require('../models/agentRatingModel');
const userModel = require('../models/userModel');
const bookingModel= require('../models/bookingModel');
//insertAgentRatings
const insertAgentRatings = async (req,res) => {
    try{
      
        const userId = req.user.user.userId;
        const firstName= req.user.user.firstName;
        const lastName = req.user.user.lastName;
        console.log(userId);
        if (!userId) {
            return res.status(400).json({ message: "User ID is missing in request", success: false });
        }

        const ratingsData = {
           userId,
           firstName,
           lastName,
            ...req.body // Spread the rest of the fields from the request body
        };
        //console.log(fieldDetailsData);
        const ratings = new agentRatingModel(ratingsData);
        await ratings.save();
        res.status(201).json({ message: "rating details added successfully", success: true });
    } catch (error) {
        res.status(400).json({ message: "Error inserting rating details", error });
    }
};

//api for agent to view his own ratings
const getAgentRatingsByAgentId = async (req, res) =>{
    try {
const agentId= req.user.user.userId;
//console.log(userId)
const ratings = await agentRatingModel.find({ agentId: agentId });
if (ratings.length === 0) {
    return res.status(404).json({ message: 'No ratings found' });
  }

  res.status(200).json(ratings);
} catch (error) {
  res.status(500).json({ message: error.message });
}
}

//api for displaying ratings of an agent, agentId is sent through path params
const getAgentRatings = async (req, res) => {
  try {
    const agentId = req.params; // Extract agentId from the token
const ratings = await agentRatingModel.find({ agentId: agentId });
if (ratings.length === 0) {
    return res.status(404).json({ message: 'No ratings found' });
  }

  res.status(200).json(ratings);
} catch (error) {
  res.status(500).json({ message: error.message });
}   
};



//api for buyer and seller to view a particular agent ratings
// const getAgentRatingsByAgentId = async (req, res) =>{
//     try {
// const agentId= req.user.user.userId;
// //console.log(userId)
// const ratings = await agentRatingModel.find({ agentId: agentId });
// if (ratings.length === 0) {
//     return res.status(404).json({ message: 'No ratings found' });
//   }

//   res.status(200).json(ratings);
// } catch (error) {
//   res.status(500).json({ message: error.message });
// }
// }

//get agents by location


  
  //get agents by location
  // const getAgentsbyloc = async (req, res) => {
  // //const role = parseInt(req.params.role, 10);
  // try {
  // let {location} = req.params;
  // const userId=req.user.user.userId;
  // const buyerRole=3;
  // const role=1;  
  // location= location.charAt(0).toUpperCase()+location.slice(1).toLowerCase();
  // if (!location) {
  // return res.status(400).json({ message: 'Location not found in token' });
  // }

  // const fields= 'profilePicture firstName lastName pinCode city email phoneNumber';
  
  // // Query users with role 1 (agents) and the specified location
  // const users = await userModel.find({ role: role, city: location },fields);
  // // console.log(users);
  // if (users.length === 0) {
  // return res.status(404).json({ message: 'No agents found for this location' });
  // }
  

  // res.status(200).json(users);
  // } catch (error) {
  // console.error('Error fetching agents:', error);
  // res.status(500).json({ message: 'Internal Server Error', error: error.message });
  // }
  // };
  const getAgentsbyloc = async (req, res) => {
    try {
      let { location } = req.params;
      const userId = req.user.user.userId; // Get userId from the token
      const buyerRole = 3; // Define buyer role
      const role = 1; // Role 1 is for agents
  
      // Format the location string (capitalize first letter)
      location = location.charAt(0).toUpperCase() + location.slice(1).toLowerCase();
  
      if (!location) {
        return res.status(400).json({ message: 'Location not found in token' });
      }
  
      const fields = 'profilePicture firstName lastName pinCode city email phoneNumber';
  
      // Find agents with the specified role and location
      const users = await userModel.find({ role, city: location }, fields);
  
      if (users.length === 0) {
        return res.status(404).json({ message: 'No agents found for this location' });
      }
  
      // Iterate over users and check the booking status for each agent
      const usersWithStatus = await Promise.all(
        users.map(async (user) => {
          // Check if the current agent has any bookings by the user with the given buyerRole and userId
          const booking = await bookingModel.findOne({
            user_id: userId,
            agent_id: user._id, // The current agent's user ID
            role: buyerRole, // Buyer role
          });
  
          // Add booking status to the user object
          const status = booking ? booking.status : 9; // If booking exists, use its status; otherwise, default to 0
  
          // Return the user object with the added status field
          return {
            ...user.toObject(), // Convert the Mongoose document to a plain object
            status, // Add the status field
          };
        })
      );
  
      // Return the modified users with their booking status
      res.status(200).json(usersWithStatus);
    } catch (error) {
      console.error('Error fetching agents:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  };
  

module.exports = {
 insertAgentRatings,getAgentRatingsByAgentId,getAgentRatings, getAgentsbyloc
};