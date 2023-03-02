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
router.route("/")
  .get(result(Pages),getPages)
  .post(createPage)

router.route("/:id")
  .get(getPage)
  .put(updatePage)
  .delete(deletePage)



module.exports = router