

const result = (model, populate) => async (req,res,next) =>{
  let query
  const reqQ = {...req.query}
    
  const excludeFields = ["select", "sort","page","limit"]
  excludeFields.forEach(param =>delete reqQ[param])
  
  // Only show pages with status 'published' to non-logged in users
  // Show pages with status 'published' and 'draft' to logged in users
  //const statusFilter = !req.user ? "published": ["published", "draft"]
  //console.log(reqQ)
  // if (!reqQ.status) {
  
  //eqQ.status = statusFilter
  //} else if (Array.isArray(reqQ.status)) {
  //reqQ.status = reqQ.status.filter((status) =>
  // statusFilter.includes(status)
  //)
  //} else if (!statusFilter.includes(reqQ.status)) {
  //reqQ.status = []
  //}



  //@ dd -> filtering with one or many arg
  let queryString = JSON.stringify(reqQ)

  query = model.find(JSON.parse(queryString))

  
  // @add -> select
  if (req.query.select){
    const field = req.query.select.split(",").join(" ")
    query = query.select(field)
  }

  //@add -> sort
  if (req.query.sort){
    const sorted = req.query.sort.split(",").join(" ")
    query =  query.sort(sorted)
  } else {
    query = query.sort("createdAt")
  }

  // @add pagination
  const thePage= parseInt(req.query.page,10)|| 1
  const limit = parseInt(req.query.limit,10) || 20
  const pageStart = (thePage - 1) * limit
  const pageEnd = thePage * limit
  const total = await model.countDocuments()

  query = query.skip().limit(limit)

  if (populate){
    query = query.populate(populate)
  }

  const results= await query

  //pagination result
   
  const pagination = {}
  if (pageEnd<total){
    pagination.next = {
      thePage: thePage + 1,
      limit
    }
  }

  if (pageStart > 0){
    pagination.prev = {
      thePage: thePage - 1,
      limit
    }
  }

  res.result = {
    success:true,
    count: results.length,
    pagination,
    data: results
  }
  next()




}

module.exports = result