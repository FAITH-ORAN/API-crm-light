const ErrorResponse = require("../utils/errorResponse")
const Menu = require("../models/NavigationMenu")

// desc: Get menu ->Get /api/v1/menu -> permission: All
exports.getMenu  = async(req,res,next) =>{
  try {
    let query
    query = Menu.find()
    await query
    res.status(200).json(
      res.result
    )
  }
  catch (error){
    next(error)
  }
}

// desc: Get one menu ->Get /api/v1/menu /:id-> permission: All
exports.getOneMenu  = async(req,res,next) =>{
  try {
    const menu =await Menu.findById(req.params.id).populate({
      path: "pages",
      select :"title",
      match: { status: "published" }
    })
    if (!menu){
      return next(new ErrorResponse(`pas de menu avec l'id ${req.params.id}`),404)
    }

    res.status(200).json({
      success:true,
      data: menu
    })
  }
  catch (error){
    next(error)
  }
}

// desc: add menu ->Post  /api/v1/menu-> permission: Admin+ Manager
exports.addMenu  = async(req,res,next) =>{
  try {
    const menu = await Menu.create(req.body)
    res.status(200).json({
      success:true,
      data: menu
    })
  }
  catch (error){
    next(error)
  }
}

// desc: Update menu ->put /api/v1/menu/:id-> permission: Admin+ Manager
exports.updateMenu  = async(req,res,next) =>{
  try {
    let menu = await Menu.findById(req.params.id)
    if (!menu){
      return next(new ErrorResponse(`Pas de menu avec l'id ${req.params.id}`),400)
    }

    menu = await Menu.findByIdAndUpdate(req.params.id,req.body,{
      new:true,
      runValidators : true
    })
    res.status(200).json({
      success:true,
      data: menu
    })
  }
  catch (error){
    next(error)
  }
}

// desc: Delete menu ->delete /api/v1/menu/:id-> permission: Admin+ Manager
exports.deleteMenu  = async(req,res,next) =>{
  try {
    const  menu = await Menu.findById(req.params.id)
    if (!menu){
      return next(new ErrorResponse(`Pas de menu avec l'id ${req.params.id}`),400)
    }

    await menu.remove()
    res.status(200).json({
      success:true,
      data: {}
    })
  }
  catch (error){
    next(error)
  }
}