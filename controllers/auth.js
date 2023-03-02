const ErrorResponse = require("../utils/errorResponse")
const User = require("../models/Users")

// desc: Registration of new user ->Get /api/v1/auth/register-> permission: Admin
exports.register = async(req,res,next) =>{
  try {
    const {firstName,lastName,email,password,role} = req.body

    //Create user
    const user = await User.create({
      firstName,lastName,
      email,
      password,
      role
    })
    res.status(200).json({success:true})
   
  } catch (error) {
    next(error)
  }
}