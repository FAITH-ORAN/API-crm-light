const express = require("express")
const {getMenu,getOneMenu,addMenu,updateMenu,deleteMenu }= require("../controllers/navigationMenu")

const Menu= require("../models/NavigationMenu")
const result = require("../middelware/result")
const router = express.Router()

router.route("/").get(result(Menu,
  {path: "pages",
    select :"title",
    match: { status: "published" }}),getMenu)
  .post(addMenu)

router.route("/:id").get(getOneMenu).put(updateMenu).delete(deleteMenu)
module.exports = router