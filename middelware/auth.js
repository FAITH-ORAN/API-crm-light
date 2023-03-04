const jwt = require("jsonwebtoken")
const ErrorResponse = require("../utils/errorResponse")
const Page = require("../models/Pages")
const Menu = require("../models/NavigationMenu")
const User = require("../models/Users")


//Protection of route
exports.protect  = async(req,res,next) =>{
  try {
    
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
      token = req.headers.authorization.split(" ")[1]
    }
    //else if (req.cookies.token){
    //token = req.cookies.token
    //}

    // validate if the token exist
    if (!token){
      return next(new ErrorResponse("accés refusé",401))
    }

    //Verify  token 
    const decrypted = jwt.verify(token,process.env.JWT_SEC)
    req.user = await User.findById(decrypted.id)
    next()
  }
  catch (error){
    next(error)
  }
}

// give permission for some roles 
exports.checkPermission =(...roles)=>{
  return (req,res,next)=>{
    if (!roles.includes(req.user.role)){
      return next(new ErrorResponse(`le role ${req.user.role} n'est pas autorisé pour effectuer cette opération`,403))
    }

    next()
  }
}


// Only show pages with status 'published' to non-logged in users
// Show pages with status 'published' and 'draft' to logged in users
exports.readAllOrNot=async(req,res,next) =>{
  const statusFilter = !req.user ? "published" : ["published", "draft"]
  if (req.query.status) {
    if (Array.isArray(req.query.status)) {
      req.query.status = req.query.status.filter((status) =>
        statusFilter.includes(status)
      )
    } else if (!statusFilter.includes(req.query.status)) {
      req.query.status = statusFilter
    }
  } else {
    req.query.status = statusFilter
  }

  next()
}