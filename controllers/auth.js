const ErrorResponse = require("../utils/errorResponse")
const User = require("../models/Users")
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto")

// desc: Registration of new user ->POST /api/v1/auth/register-> permission: Admin
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

    sendTokenRes(user,200,res)
  } catch (error) {
    next(error)
  }
}

// desc: logout & clear cookie ->GET /api/v1/auth/logged-> permission:self
exports.logout = async(req,res,next) =>{
  try {
    res.cookie("token","none",{
      expires: new Date(Date.now() +10 * 1000),
      httpOnly: true
    })
    res.status(200).json({
      success: true,
      data:{}
    })
   
  } catch (error) {
    next(error)
  }
}

// desc: Get current logged user ->POST /api/v1/auth/logged-> permission:self
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

// desc: Update user datils>PUT /api/v1/auth/updatedetails-> permission: self 
exports.updateDetails = async(req,res,next) =>{
  try {
    const filedsToUpdate = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
    }
    const user = await User.findByIdAndUpdate(req.user.id,filedsToUpdate,{
      new: true,
      runValidators : true
    })
    res.status(200).json({
      success: true,
      data:user
    })
  } catch (error) {
    next(error)
  }
}

// desc: Update password ->POST /api/v1/auth/updatepassword-> permission:self
exports.updatePassword = async(req,res,next) =>{
  try {
    const user = await User.findById(req.user.id).select("+password")
    //Check current password
    if (!(await user.matchPassword(req.body.currentPassword))){
      return next(new ErrorResponse("le mot de passe est incorrecte",401))
    }

    user.password = req.body.newPassword
    await user.save()
    sendTokenRes(user,200,res)
  } catch (error) {
    next(error)
  }
}

//desc: Forgot password->POST /api/v1/auth/forgotpassword
exports.getMyPasswordReset = async(req,res,next) =>{
  try {
    const user = await User.findOne({email:req.body.email})
    if (!user){
      return next(new ErrorResponse("Email introuvable",404))
    }

    //Generate token with crypto
    const resetToken = crypto.randomBytes(20).toString("hex")
    //hash token
    const hashToken = crypto .createHash("sha256").update(resetToken).digest("hex")
    //Set expire 10mn
    const expirePass = Date.now() + 10 * 60 * 1000
    //store hashToken and expire pass & email in session -> as required i don't store the token in db but in session
    req.session.hashTok = { hash: hashToken,
      expire: expirePass,
      email: user.email
    }
    // Create reset url
    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/resetpassword/${hashToken}`
    const message = `Vous recevez cette email car vous avez demander à réinitialiser le mot de passe.veuillez le modifier via ce lien ${resetUrl}`
    try {
      await sendEmail({
        email:user.email,
        subject:"réinitialiser le mot de passe",
        message
      })
      res.status(200).json({success:true, data: "Email envoyé"})
    } catch (error) {
      return next(new ErrorResponse("Email ne peut pas être envoyé ",500))
    }
    res.status(200).json({
      success: true,
      data:user
    })
  } catch (error) {
    next(error)
  }
}

//desc: Reset password ->Put/api/v1/auth/resetpassword/:resettoken-> 
exports.resetPassword = async(req,res,next) =>{
  try {
    const user = await User.findOne({ email:req.session.hashTok.email })
    //Get hashed token from url
    const resetPasswordTok = req.params.resettoken
    // Verify if the token is valid and not expired
    if (!req.session.hashTok ||req.session.hashTok.hash !== resetPasswordTok ||req.session.hashTok.expire < Date.now()){
      return next(new ErrorResponse("Token invalide ou expiré", 400))
    }
   
    // Set the new password
    user.password = req.body.password
    req.session.hashToken = undefined
    await user.save()
    sendTokenRes(user,200,res)
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