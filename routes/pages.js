const express = require("express")
const {getPages,
  getPage,
  createPage,
  updatePage,
  deletePage 
}= require("../controllers/pages")

const Pages = require("../models/Pages")
const result = require("../middelware/result")

const router =express.Router()

const { protect,checkPermission} = require("../middelware/auth")

router.route("/")
  .get(result(Pages),getPages)
  .post(protect,checkPermission("admin","manager"),createPage)

router.route("/:id")
  .get(getPage)
  .put(protect,updatePage)
  .delete(protect,checkPermission("admin","manager"),deletePage)



module.exports = router