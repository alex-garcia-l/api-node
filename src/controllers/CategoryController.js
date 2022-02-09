const { Category } = require('../models');

const index = async (req, res) => {
  const { limit = 15, from = 0 } = req.query;
  const query = { deleted_at: null };

  const [total, categories] = await Promise.all([
    Category.countDocuments(query),
    Category.find(query)
      .populate('user', ['name', '_id'])
      .skip(Number(from))
      .limit(Number(limit))
  ]);

  res.json({
    total,
    categories
  });
}

const store = async (req, res) => {
  const name = req.body.name.toUpperCase();
  const query = { name };
  const categoryDB = await Category.findOne(query);

  if (categoryDB) {
    return res.status(400).json({
      msg: `The category ${name} already exists.`
    });
  }

  const date = new Date();
  const data = {
    name,
    user: req.userLogged._id,
    created_at: date,
    modified_at: date
  }

  try {
    const category = new Category(data);
    await category.save();

    res.status(201).json({
      msg: 'Category created successfully.',
      category
    });
  } catch (error) {
    res.status(500).json({
      msg: 'Error creating category.'
    });
  }
}

const show = async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id)
    .populate('user', ['name', '_id']);

  res.json({
    category,
  });
}

const update = async (req, res) => {
  const { id } = req.params;
  const name = req.body.name.toUpperCase();
  const query = { name };
  const categoryDB = await Category.findOne(query);

  if (categoryDB) {
    return res.status(400).json({
      msg: `The category ${name} already exists.`
    });
  }

  const data = {
    name,
    user: req.userLogged._id,
    modified_at: new Date()
  }

  const category = await Category.findByIdAndUpdate(id, data, { new: true });

  res.json({
    msg: 'Category updated successfully.',
    category
  });
}


const destroy = async (req, res) => {
  const { id } = req.params;

  const category = await Category.findOneAndUpdate(id, { deleted_at: new Date() });

  res.json({
    msg: 'Category deleted successfully.',
    category
  });
}

module.exports = {
  index,
  store,
  show,
  update,
  destroy
}
