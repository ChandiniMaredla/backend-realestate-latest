require('dotenv').config(); 
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const bcrypt=require('bcrypt');
const secret_key = process.env.SECRET_KEY;
// Controller function for user login
const userLoginController = async (req, res) => {
    try {
        console.log(req.body);
        let { email, password } = req.body;

        // Find the user in the database by email and password
        let user = await userModel.findOne({ email});
      console.log(user.profilePicture);
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign(
                { user: {userId:user._id, email:user.email,firstName:user.firstName,lastName:user.lastName,phoneNumber:user.phoneNumber,role:user.role,profilePicture:user.profilePicture} },
                secret_key,
                { expiresIn: '1d' }
            );
            
const name= user.firstName+" "+user.lastName;
 // Send response with success status and token
       res.send({ success: true, token , role: user.role, name:name });
            return { token, message: 'Login successful' };
        } else {
             // Send response with failure status if credentials are invalid
          res.status(400).send({ message: "Invalid credentials", success: false });
            throw new Error('Invalid password or email');
        }
    } catch (err) {
        console.error('Error during login:', err.message);
             // Send response with server error status
   res.status(500).send(err);
        throw new Error('Error during login: ' + err.message);
    
    }









    // const userLoginController = async (req, res) => {
    //     try {
    //     console.log(req.body);
    //     let { email, password } = req.body;
    //     // Find the user in the database by email and password
    //     let user = await userModel.findOne({ email});
    //     console.log("user:",user)
    //     console.log("password",user.phoneNumber);
    //     console.log("password",user.password);
    //     const isMatch = await bcrypt.compare(password, user.password);
    //     console.log("match:",isMatch)
    //     if (isMatch) {
    //     const token = jwt.sign(
    //     { user: {userId:user._id, email:user.email,firstName:user.firstName,lastName:user.lastName,phoneNumber:user.phoneNumber,role:user.role} },
    //     secret_key,
    //     { expiresIn: '1d' }
    //     );
        
    //     // Send response with success status and token
    //     res.send({ success: true, token , role: user.role });
    //     return { token, message: 'Login successful' };
    //     } else {
    //     // Send response with failure status if credentials are invalid
    //     res.status(400).send({ message: "Invalid credentials", success: false });
    //     throw new Error('Invalid password or email');
    //     }
    //     } catch (err) {
    //     console.error('Error during login:', err.message);
    //     // Send response with server error status
    //     res.status(500).send(err);
    //     throw new Error('Error during login: ' + err.message);
        
    //     }
    //     console.log(data);

    //     if (data != null) {
    //         // Destructure necessary fields from user data
    //         let { email, password, firstName, lastName, phoneNumber, pinCode, city, role, _id: userId } = data;
            
    //         // Generate a JWT token with user information
    //         const token = jsonwebtoken.sign({ email,  password, firstName, lastName, phoneNumber, pinCode, city, role, userId, firstName }, "secretKey");
            
    //         // Send response with success status and token
    //         res.send({ success: true, token });
    //     } else {
    //         // Send response with failure status if credentials are invalid
    //         res.status(400).send({ message: "Invalid credentials", success: false });
    //     }
    // } catch (error) {
    //     console.log(error);
    //     // Send response with server error status
    //     res.status(500).send(error);
    // }
};

module.exports = { userLoginController };
