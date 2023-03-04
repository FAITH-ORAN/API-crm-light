const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const casual = require("casual")
const jwt = require("jsonwebtoken")


const UserSchema = new mongoose.Schema({
  firstName:{
    type:String,
    trim:true,
    required:[true,"Veuillez écrire un prénom"]
  },
  lastName:{
    type:String,
    trim:true,
    required:[true,"Veuillez écrire un nom"]
  },
  email:{
    type:String,
    unique:true,
    trim:true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Veuillez mettre une adresse mail valide"],
    required:[true,"Veuillez écrire un email"]
  },
  role:{
    type:String,
    enum:["manager","editor"],
    default: "editor"
  },
  password:{
    type:String,
    select:false,
    required:[true,"Veuillez ajouter un mot de passe"],
    match:[/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,"minimum 8 caractères, une majuscule,un chiffre et un caractère spéciale"]
  },
  resPassToke:String,
  resetPassExpire:String,
  createdAt:{
    type:Date,
    default: Date.now
  }
})

//Encrypte password
UserSchema.pre("save",async function(next){
  if (!this.isModified("password")){
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password,salt)
  next()
})

//Fake data
UserSchema.pre("save",function(next){
  this.firstName= casual.first_name
  this.lastName =casual.last_name
  this.email = casual.email
  next()
})

//JWT 
UserSchema.methods.getSignedJwtToken =function(){
  return jwt.sign({id:this._id },process.env.JWT_SEC,{
    expiresIn: process.env.JWT_EXPIRE
  })
}

//Verify the password entered bu user and hashed one in db
UserSchema.methods.matchPassword = async function(logedPassword){
  return await  bcrypt.compare(logedPassword,this.password)
}



module.exports = mongoose.model("Users",UserSchema)