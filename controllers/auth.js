
const ErrorResponse = require("../utils/errorResponse")
const User = require("../models/Users")
const crypto = require("crypto")

// desc: Registration of new user ->POST /api/v1/auth/register-> permission: Admin
exports.register = async(req,res,next) =>{
  try {
    // Vérify if user is admin to allow creation of new users
    //if (!req.user ||req.user.role !== "admin") {
    // return next(new ErrorResponse("Seul l'administrateur peut créer un nouvel utilisateur", 403))
    //}

    const {firstName,lastName,email,password,role} = req.body
    
    //Create user
    const user = await User.create({
      firstName,lastName,
      email,
      password,
      role
    })

    //call the methode sendTokenRes
    sendTokenRes(user,200,res)
   
  } catch (error) {
    next(error)
  }
}


// desc: Login user->POST /api/v1/auth/login 
exports.login = async(req,res,next) =>{
  try {
    const {email,password} = req.body


    //Verify if the user put an email and password
    if (!email || !password){
      return next(new ErrorResponse("Veuillez mettre un email et un mot de passe",400))
    }

    //Verify if the email existe in the db
    const user = await User.findOne({email}).select("+password")

    if (!user){
      return next(new ErrorResponse("Email ou mot de passe incorrecte",401))
    }

    //Verify if password match
    const isPass = await user.matchPassword(password)

    if (!isPass){
      return next(new ErrorResponse("Email ou mot de passe incorrecte",401))
    }

    //call the methode sendTokenRes
    sendTokenRes(user,200,res)
  } catch (error) {
    next(error)
  }
}



// desc: Get current logged user ->POST /api/v1/auth/logged-> 
exports.getMyInfo = async(req,res,next) =>{
  try {
    const user = await User.findById(req.user.id)
    res.status(200).json({
      success: true,
      data:user
    })
   
  } catch (error) {
    next(error)
  }
}

//desc: GForgot password->POST /api/v1/auth/forgotpassword-> 
exports.getMyPassword = async(req,res,next) =>{
  try {
    const user = await User.findOne({email:req.body.email})

    if (!user){
      return next(new ErrorResponse("Email introuvable",404))
    }

    //Get reset Token 
    //Generate token
    const resetToken = crypto.randomBytes(20).toString("hex")
    

    //hash token
    const hashToken = crypto .createHash("sha256").update(resetToken).digest("hex")

    //Set expire
    const ExpirePass = Date.now() + 10 * 60 * 1000
     
 
    res.status(200).json({
      success: true,
      data:user
    })
   
  } catch (error) {
    next(error)
  }
}



//get token from model,create cookie and send response
const sendTokenRes = (user,statusCode,res)=>{
  //Create Token 
  const token = user.getSignedJwtToken()

  const options ={
    expires: new Date(Date.now()+process.env.COOKIE_EXPIRE * 24* 60*60*1000),
    httpOnly:true
  }

  if (process.env.NODE_ENV ==="production"){
    options.secure = true
  }

  res
    .status(statusCode)
    .cookie("token",token,options)
    .json({
      success:true,
      token
    })
}