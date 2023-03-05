const express = require("express")
const {register,login, getMyInfo,getMyPasswordReset,resetPassword,updateDetails,updatePassword,logout} = require("../controllers/auth")

const router = express.Router()
const { protect,checkPermission } = require("../middelware/auth")

router.post("/register",protect,checkPermission("admin"),register)
router.post("/login",login)
router.get("/logout",logout)
router.get("/logged",protect,getMyInfo)
router.put("/updatedetails",protect,updateDetails)
router.put("/updatepassword",protect,updatePassword)
router.post("/forgotpassword",getMyPasswordReset)
router.put("/resetpassword/:resettoken",resetPassword)

module.exports = router