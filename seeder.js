const fs = require("fs")
const mongoose = require("mongoose")
const colors = require("colors")
const dotenv = require("dotenv")

//env vars
dotenv.config({path: "./config/config.env"})

//models
const Page =  require("./models/Pages")
const Menu =  require("./models/NavigationMenu")


mongoose.set("strictQuery", true)
//connect to db 
mongoose.connect(process.env.MONGO_URI,{
  useNewUrlParser:true
})

//json parser
const pages = JSON.parse(fs.readFileSync(`${__dirname}/data/pages.json`,"utf-8"))
const menu = JSON.parse(fs.readFileSync(`${__dirname}/data/navigationMenu.json`,"utf-8"))

// import file into db
const importIntoDb = async()=>{
  try {
    await Page.create(pages)
    await Menu.create(menu)
    console.log("data imported...".green.inverse)
    process.exit()
  } catch (error) {
    console.error(error)
  }
}


//delete data

const deleteFromDb = async()=>{
  try {
    await Page.deleteMany()
    await Menu.deleteMany()
    console.log("data deleted...".red.inverse)
    process.exit()
  } catch (error) {
    console.error(error)
  }
}


if (process.argv[2]==="-i"){
  importIntoDb()
} else if (process.argv[2]==="-d"){
  deleteFromDb()
}