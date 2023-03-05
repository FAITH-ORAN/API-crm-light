const ErrorResponse = require("../utils/errorResponse")
const User = require("../models/Users")

// desc: get all users ->GET /api/v1/auth/users-> permission: Admin
exports.getUsers = async(req,res,next) =>{
  try {
    res.status(200).json(res.result)
  } catch (error) {
    next(error)
  }
}

// desc: get one user ->GET /api/v1/auth/users/:id-> permission: Admin
exports.getOneUser = async(req,res,next) =>{
  try {
    const user = await User.findById(req.params.id)
    if (!user){
      return next(new ErrorResponse(`utilisateur n'existe pas avec l'id ${req.params.id}`,404))
    }

    res.status(200).json({succes:true,data:user})
  } catch (error) {
    next(error)
  }
}

// desc: update user ->PUT /api/v1/auth/users/:id-> permission: Admin
exports.updateUser = async(req,res,next) =>{
  try {
    const user = await User.findByIdAndUpdate(req.params.id,req.body,{
      new: true,
      runValidators: true
    })
    res.status(200).json({succes:true,data:user})
  } catch (error) {
    next(error)
  }
}

// desc: delete user ->DELETE /api/v1/auth/users/:id-> permission: Admin
exports.deleteUser = async(req,res,next) =>{
  try {
    await User.findByIdAndDelete(req.params.id,req.body)
    res.status(200).json({succes:true,data:{}})
  } catch (error) {
    next(error)
  }
}