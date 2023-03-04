const express = require("express")
const {register,login, getMyInfo,getMyPassword} = require("../controllers/auth")

const router = express.Router()
const { protect,checkPermission } = require("../middelware/auth")

router.post("/register",protect,checkPermission("admin"),register)
router.post("/login",login)
router.get("/logged",protect,getMyInfo)
router.post("/forgotpassword",getMyPassword)

module.exports = router