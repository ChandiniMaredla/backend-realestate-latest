const bookingModel = require("../models/bookingModel");
const userModel = require("../models/userModel");
const mongoose = require("mongoose");
//api for a buyer/ seller to book appointment
const createBooking = async (req, res) => {
  try {
    const {
      userId,
      role,
      firstName,
      lastName,
      email,
      phoneNumber,
      profilePicture,
    } = req.user.user;
    const details = {
      userId,
      role,
      firstName,
      lastName,
      email,
      phoneNumber,
      profilePicture,
      ...req.body,
    };
    const booking = new bookingModel(details);
    await booking.save();
    res.status(200).send({ message: "Booked Successfully", success: true });
  } catch (error) {
    console.error("Error Details:", error);
    res
      .status(400)
      .send({ message: "Error in booking", error: error.message || error });
  }
};

//api for an agent to book appointment
const createAgentBooking = async (req, res) => {
  try {
    const { role, firstName, lastName, email, phoneNumber, profilePicture } =
      req.user.user;
    const agentId = req.user.user.userId;
    console.log(agentId);
    const details = {
      agentId,
      role,
      firstName,
      lastName,
      email,
      phoneNumber,
      profilePicture,
      ...req.body,
    };
    const booking = new bookingModel(details);
    await booking.save();
    res.status(200).send({ message: "Booked Successfully", success: true });
  } catch (error) {
    console.error("Error Details:", error);
    res
      .status(400)
      .send({ message: "Error in booking", error: error.message || error });
  }
};

//get details of buyer/seller who booked appointement with agent
const getUserBookings = async (req, res) => {
  try {
    const agentId = req.user.user.userId; // Extract agentId from the token
    const { role } = req.params; //role of buyer or seller
    //  console.log(propertyId);
    const bookings = await bookingModel.find({ role: role, agentId: agentId });
    if (bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get user bookings based on status(accepted(1),rejected(-1), booked(2), pending(0))
//get details of buyer/seller who booked appointement with agent
const getUserBookingsByStatus = async (req, res) => {
  try {
    const agentId = req.user.user.userId; // Extract agentId from the token
    const { role, status } = req.params; // role of buyer or seller
    //  if status is 3, all bookings will be displayed irrespective of status
    let bookings;
    if (parseInt(status) === 3) {
      bookings = await bookingModel.find({ role: role, agentId: agentId });
    } else {
      bookings = await bookingModel.find({
        role: role,
        agentId: agentId,
        status: status,
      });
    }
    if (bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get userbookings based on name
//get details of buyer/seller who booked appointement with agent
const getBookingByName = async (req, res) => {
  try {
    const agentId = req.user.user.userId; // Extract agentId from the token
    const { role, name } = req.params; //role of buyer or seller
    const words = name.split(" ");
    const firstName = words[0];
    const lastName = words[1];
    console.log(firstName);
    console.log(lastName);
    const bookings = await bookingModel.find({
      role: role,
      agentId: agentId,
      firstName,
      lastName,
    });
    if (bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "This user did not book any appointment" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get details of agents who booked appointments with that user
const getAgentBookings = async (req, res) => {
  try {
    const userId = req.user.user.userId; // Extract agentId from the token
    const role = 1; //role 1
    const bookings = await bookingModel.find({ role: role, userId: userId });
    if (bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const bookingId = req.params.bookingid; // Get bookingId from request parameters
    const status = req.params.status; // Get status from request body
    console.log(bookingId);
    console.log(status);
    // Ensure status is either 0 or 1
    //   if (![-1, 1].includes(status)) {
    //     return res.status(400).json({ message: 'Invalid status value. It should be either -1 or 1.' });
    //   }

    // Update the booking status
    const updatedBooking = await bookingModel.findByIdAndUpdate(
      bookingId,
      { status: status },
      { new: true }
    );

    // If no booking found with the given id
    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const resultData = {
      _id: updatedBooking._id,
      status: updatedBooking.status,
    };
    console.log(resultData);
    // Return the updated booking
    res
      .status(200)
      .json({ message: "Booking status updated successfully", resultData });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: "Error updating booking status", error });
  }
};

//update status of apntmnt to 0 if it is 2 -----> only for backend use to clear db collection
const updateStatus = async (req, res) => {
  try {
    // Update all bookings where the status is 2 to 0
    const updatedBookings = await bookingModel.updateMany(
      { status: 2 }, // Condition to find bookings with status 2
      { $set: { status: 0 } } // Update status to 0
    );

    // If no bookings found with the given status
    if (updatedBookings.matchedCount === 0) {
      return res
        .status(404)
        .json({ message: "No bookings with status 2 found" });
    }

    // Return the result of the update operation
    res.status(200).json({
      message: "Booking statuses updated successfully",
      updatedCount: updatedBookings.modifiedCount,
    });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: "Error updating booking statuses", error });
  }
};

//get booking details of agent- accepting and rebooking with a user
const getBookingByUserAndAgent = async (req, res) => {
  try {
    const { userId, agentId } = req.params; // Extract userId and agentId from path parameters

    // Query to find booking where userId, agentId match and role = 1
    const booking = await bookingModel.findOne({
      userId: userId,
      agentId: agentId,
      role: 1, // Ensure role is 1
    });

    // If no booking found, return 404
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Return the found booking
    res.status(200).json({ message: "Booking found", booking });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Error fetching booking", error });
  }
};

//get booking details of buyer- accepting and rebooking with an agent
const rebookingWithAgent = async (req, res) => {
  try {
    const { userId, agentId } = req.params; // Extract userId and agentId from path parameters

    // Query to find booking where userId, agentId match and role = 1
    const booking = await bookingModel.findOne({
      userId: userId,
      agentId: agentId,
      role: 3, // Ensure role is 3
    });

    // If no booking found, return 404
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Return the found booking
    res.status(200).json({ message: "Booking found", booking });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Error fetching booking", error });
  }
};
//update status of apntmnt to 0 if it is 2
const deleteappointment = async (req, res) => {
  try {
    const deleted = await bookingModel.deleteMany({ role: 1 });
    // Return the result of the update operation
    res.status(200).json({
      message: "Booking statuses updated successfully",
      updatedCount: deleted.modifiedCount,
    });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: "Error updating booking statuses", error });
  }
};

//get bookings by filters--- for agent login
// const getByFilters = async (req, res) => {
//   try {
//     const agentId = req.user.user.userId; // Extract agentId from the token
//     const { role, location, status } = req.params; // role of buyer or seller
//     //  if status is 3, all bookings will be displayed irrespective of status
//     let bookings;
//     if (location === "@") {
//       if (parseInt(status) === 3) {
//         bookings = await bookingModel.find({ role: role, agentId: agentId });
//       } else {
//         bookings = await bookingModel.find({
//           role: role,
//           agentId: agentId,
//           status: status,
//         });
//       }
//     } else {
//       if (parseInt(status) === 3) {
//         bookings = await bookingModel.find({
//           role: role,
//           agentId: agentId,
//           location:location
//         });
//       } else {
//         bookings = await bookingModel.find({
//           role: role,
//           agentId: agentId,
//           status: status,
//           location:location
//         });
//       }
//     }
//     if (bookings.length === 0) {
//       return res.status(404).json({ message: "No bookings found" });
//     }

//     res.status(200).json(bookings);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
const getByFilters = async (req, res) => {
  try {
    const agentId = req.user.user.userId; // Extract agentId from the token
    const { role, location, status } = req.params; // Role of buyer or seller

    let query = {
      role: role,
      agentId: agentId,
    };

    if (parseInt(status) !== 3) {
      query.status = status;
    }

    if (location !== "@") {
      query.location = new RegExp(location, "i"); // Case-insensitive search
    }

    const bookings = await bookingModel.find(query);

    if (bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get bookings by filters--- for buyer login
const getBookingByFilters = async (req, res) => {
  try {
    const userId = req.user.user.userId; // Extract userId from the token
    const { name, status } = req.params;
    //  if status is 3, all bookings will be displayed irrespective of status
    let bookings;
    if (name === "@") {
      if (parseInt(status) === 3) {
        bookings = await bookingModel.find({ role: 1, userId: userId });
      } else {
        bookings = await bookingModel.find({
          role: 1,
          userId: userId,
          status: status,
        });
      }
    } else {
      const words = name.split(" ");
      let firstName = words[0];
      let lastName = words[1];
      console.log(firstName);
      console.log(lastName);
      if (parseInt(status) === 3) {
        bookings = await bookingModel.find({
          role: 1,
          userId: userId,
          firstName,
          lastName,
        });
      } else {
        bookings = await bookingModel.find({
          role: 1,
          userId: userId,
          status: status,
          firstName,
          lastName,
        });
      }
    }
    if (bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//buyer requested agents
const getBuyerBookings = async (req, res) => {
  try {
    const userId = req.user.user.userId; // Extract userId from the token
    const role = 3; // Role for buyer
    const fields = "agentId date timing location status";

    // Fetch the bookings for the given user and role
    const bookings = await bookingModel
      .find({ role: role, userId: userId })
      .select(fields);

    if (bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    const fields2 = "firstName lastName phoneNumber email profilePicture role";

    // Use Promise.all to process each booking
    const updatedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const agentId = booking.agentId;

        // Check if agentId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(agentId)) {
          // If invalid, return booking without agentDetails
          return {
            ...booking._doc, // Spread the original booking data
            agentDetails: null, // Set agentDetails to null for invalid agentId
          };
        }

        // Fetch agent details using valid ObjectId
        const agentDetails = await userModel
          .findOne({ _id: agentId })
          .select(fields2);

        // Attach the agent details to the booking
        return {
          ...booking._doc, // Handle Mongoose document format
          firstName: agentDetails.firstName,
          lastName: agentDetails.lastName,
          phoneNumber: agentDetails.phoneNumber,
          email: agentDetails.email,
          profilePicture: agentDetails.profilePicture,
        };
      })
    );

    // Send the updated bookings with agent details attached
    res.status(200).json(updatedBookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  createAgentBooking,
  getBookingByName,
  getByFilters,
  getUserBookings,
  getAgentBookings,
  getUserBookingsByStatus,
  updateBookingStatus,
  updateStatus,
  getBookingByUserAndAgent,
  deleteappointment,
  rebookingWithAgent,
  getBookingByFilters,
  getBuyerBookings,
}; // Export as an object
