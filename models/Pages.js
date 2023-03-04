const mongoose = require("mongoose")
const slugify = require("slugify")
const casual = require("casual")


const PageSchema = new mongoose.Schema({
  title:{
    type: String,
    unique: true,
    trim: true,
    maxlength: [100, "le titre ne peux pas dépasser 70 caractères"]
  },
  content :{
    type: String,
    minlength: [200, "le contenu de votre page ne peut pas être inférrieur à 200 caractères"],
  },
  slug: {
    type: String,
    unique: true,
  },
  modifiedBy: [{
    type: mongoose.Schema.ObjectId,
    ref: "Users"
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String, 
    enum: ["published","draft"]
  },
  creator:{
    type: mongoose.Schema.ObjectId,
    ref: "Users",
    required:true                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
  }
})
// create page slug from title and use casual to field title and content
PageSchema.pre("save",function(next){
  this.title = casual.title
  this.content =casual.text
  this.slug = slugify(this.title,{lower:true})
  next()
})

module.exports = mongoose.model("Pages",PageSchema)