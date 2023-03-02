const mongoose = require ("mongoose")

mongoose.set("strictQuery", true)
const connectDB = async() =>{
  const connexion = await mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true
  })

  console.log(`mongoDb connected:${connexion.connection.host}`.cyan.underline.bold)
}


module.exports = connectDB