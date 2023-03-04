const express = require("express")
const {getMenu,getOneMenu,addMenu,updateMenu,deleteMenu }= require("../controllers/navigationMenu")

const Menu= require("../models/NavigationMenu")
const result = require("../middelware/result")
const router = express.Router()

const { protect,checkPermission } = require("../middelware/auth")

router.route("/").get(result(Menu,
  {path: "pages",
    select :"title",
    match: { status: "published" }}),getMenu)
  .post(protect,checkPermission("admin","manager"),addMenu)

router.route("/:id").get(getOneMenu).put(protect,checkPermission("admin","manager"),updateMenu).delete(protect,checkPermission("admin","manager"),deleteMenu)
module.exports = router