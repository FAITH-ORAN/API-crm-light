const express = require("express")
const session = require("express-session")
const dotenv = require("dotenv")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const mongoSanitize = require("express-mongo-sanitize")
const helmet = require("helmet")
const xss = require("xss-clean")
const hpp = require("hpp")
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
const users = require("./routes/users")

const app = express()

//Body parser
app.use(express.json())

//Coockie parser
app.use(cookieParser())

//Session express
app.use(session({
  secret: process.env.SESSION_SECRET, 
  resave: false, 
  saveUninitialized: false 
}))

// logging middelware
if (process.env.NODE_ENV==="development"){
  app.use(morgan("dev"))
}

//Sanitize data 
app.use(mongoSanitize())

// Security headers 
app.use(helmet())

//Prevent Xss attack
app.use(xss())

//Prevent  HTTP Parameter Pollution 
app.use(hpp())

//routers
app.use("/api/v1/pages",pages)
app.use("/api/v1/menu",menu)
app.use("/api/v1/auth",auth)
app.use("/api/v1/users",users)

//use errorHandler
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server= app.listen(PORT)

//handle rejection
process.on("unhandeldRejection",(err,promise)=>{
  // close server 
  server.close(()=>process.exit(1))
})