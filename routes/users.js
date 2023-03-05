const express = require("express")
const {getUsers,getOneUser,updateUser,deleteUser}= require("../controllers/users")

const Users = require("../models/Users")
const result = require("../middelware/result")

const router =express.Router()

const { protect,checkPermission} = require("../middelware/auth")

router.use(protect)
router.use(checkPermission("admin"))

router.route("/").get(result(Users),getUsers)

router.route("/:id").get(getOneUser)
  .put(updateUser)
  .delete(deleteUser)
  
module.exports = router