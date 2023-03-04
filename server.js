const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")
const colors = require("colors")
const cookieParser = require("cookie-parser")
const errorHandler = require("./middelware/error")
const connectDB = require("./config/db")


// Load env vars
dotenv.config({path: "./config/config.env"})

// Connect to db
connectDB()

//Route files
const pages = require("./routes/pages")
const menu = require("./routes/navigationMenu")
const auth = require("./routes/auth")

const app = express()

//Body parser
app.use(express.json())

//Coockie parser
app.use(cookieParser())


// logging middelware
if (process.env.NODE_ENV==="development"){
  app.use(morgan("dev"))
}


//routers
app.use("/api/v1/pages",pages)
app.use("/api/v1/menu",menu)
app.use("/api/v1/auth",auth)

//use errorHandler
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server= app.listen(PORT,console.log(`Server runing on ${process.env.NODE_ENV} made on port ${PORT}`.yellow.bold))


//handle rejection
process.on("unhandeldRejection",(err,promise)=>{
  console.log(`error:${err.message}`.red)
  // close server 
  server.close(()=>process.exit(1))
})