const ErrorResponse = require("../utils/errorResponse")
const Pages = require("../models/Pages")

// desc: Get all pages ->Get /api/v1/pages -> permission: All(published),logged(published+draft)
exports.getPages = async(req,res,next) =>{
  try {
    res.status(200).json(res.result)
  } catch (error) {
    next(error)
  }
}

// desc: Get single page ->Get /api/v1/pages/:id -> permission: All(published),Logged(published+draft)
exports.getPage = async(req,res,next) =>{
  try {
    const page = await Pages.findById(req.params.id)
    if (!page){
      return next(new ErrorResponse(`page n'existe pas avec l'id  ${req.params.id}`,404))
    }

    res.status(200).json({succes:true,data:page})
  } catch (error) {
    next(error)
  }
}

// desc: Create new page ->POST /api/v1/pages -> permission: Admin, Manager
exports.createPage = async(req,res,next) =>{
  try {
    // Add user to req.body
    req.body.creator =  req.user.id
    const page = await Pages.create(req.body)
    res.status(201).json({
      success: true,
      data: page
    })
  } catch (error) {
    next(error)
  }
}

// desc: Update new page ->PUT /api/v1/pages/:id -> permission: Logged
exports.updatePage =async (req,res,next) =>{
  try {
    // Add user to req.body
    req.body.modifiedBy = req.user.id
    const page = await Pages.findByIdAndUpdate(req.params.id,req.body,{
      new :true,
      runValidators: true
    })
    if (!page){
      return next(new ErrorResponse(`page n'existe pas avec l'id  ${req.params.id}`,404))
    }

    res.status(200).json({success:true,data:page})
  } catch (error) {
    next(error)
  }
}

// desc: Delete new page ->PUT /api/v1/pages/:id -> permission: Admin, Manager
exports.deletePage = async(req,res,next) =>{
  try {
    const page = await Pages.findByIdAndDelete(req.params.id)
    if (!page){
      return next(new ErrorResponse(`page n'existe pas avec l'id  ${req.params.id}`,404))
    }

    res.status(200).json({success:true,data:{}})
  } catch (error) {
    next(error)
  }
}