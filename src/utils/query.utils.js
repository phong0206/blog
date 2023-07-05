exports.parseSortQuery = (sortQuery) => {
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

exports.parseFindQueryBlog = (req) => {
  const { title, content } = req.query;
  const query = {};
  if (title) {
    query.title = new RegExp(title, "i");
  }
  if (content) {
    query.content = new RegExp(content, "i");
  }
  return query;
};

exports.parseFindQueryUser = (req) => {
  const { name, age, username } = req.query;
  const query = {};

  if (name) {
    query.name = new RegExp(name, "i");
  }

  if (age) {
    query.age = {};
    if (req.query.age) {
      query.age = req.query.age;
    }
    if (req.query.age.lt) {
      query.age.$lt = parseInt(req.query.age.lt);
    }
    if (req.query.age.gt) {
      query.age.$gt = parseInt(req.query.age.gt);
    }
    if (req.query.age.gte) {
      query.age.$gte = parseInt(req.query.age.gte);
    }
    if (req.query.age.lte) {
      query.age.$lte = parseInt(req.query.age.lte);
    }
    if (req.query.age.ne) {
      query.age.$ne = parseInt(req.query.age.ne);
    }
  }
  if (username) {
    query.username = username;
  }
  return query;
};

