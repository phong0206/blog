const parseSortQuery = (sortQuery) => {
  const sort = {};
  if (sortQuery) {
    const sortKeys = Array.isArray(sortQuery) ? sortQuery : [sortQuery];
    sortKeys.forEach((key) => {
      const [field, order] = key.split(":");
      sort[field] = order || 1;
    });
  }
  return sort;
};

const getQueryFilter = (req) => {
  let filter = {};
  if (req.query.title) {
    filter.title = new RegExp(req.query.title, "i");
  }
  if (req.query.content) {
    filter.content = new RegExp(req.query.content, "i");
  }
  if (req.query.name) {
    filter.name = new RegExp(req.query.name, "i");
  }
  if (req.query.age) {
    filter.age = {};
    if (typeof req.query.age === "object") {
      if (req.query.age.lt) {
        filter.age.$lt = parseInt(req.query.age.lt);
      }
      if (req.query.age.gt) {
        filter.age.$gt = parseInt(req.query.age.gt);
      }
      if (req.query.age.gte) {
        filter.age.$gte = parseInt(req.query.age.gte);
      }
      if (req.query.age.lte) {
        filter.age.$lte = parseInt(req.query.age.lte);
      }
      if (req.query.age.ne) {
        filter.age.$ne = parseInt(req.query.age.ne);
      }
    } else {
      if (req.query.age && typeof req.query.age) {
        filter.age = req.query.age;
      }
    }
  }
  if (req.query.email) {
    filter.email = req.query.email;
  }
  return filter;
};

const getAllData = async (req, res, service) => {
  try {
    const limit = req.query.limit > 0 ? req.query.limit : 20;
    const sort = parseSortQuery(req.query.sort);
    const filtered = getQueryFilter(req);
    const totalCount = await service.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);
    let currentPage =
      req.query.currentPage > 0 && req.query.currentPage <= totalPages
        ? req.query.currentPage
        : 1;
    const skip = limit * (currentPage - 1);
    const data = await service.findAll(filtered, sort, skip, limit);
    return {
      currentPage: currentPage,
      data: data,
      limit: limit,
      totalPages: totalPages,
    };
  } catch (e) {
    console.error(e);
    return res.send(e.message);
  }
};
module.exports = {
  getAllData,
};
