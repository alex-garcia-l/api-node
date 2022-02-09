const { Product } = require('../models');

const index = async (req, res) => {
  const { limit = 15, from = 0 } = req.query;
  const query = { deleted_at: null };

  const [total, products] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .populate('category', ['name', '_id'])
      .populate('user', ['name', '_id'])
      .skip(Number(from))
      .limit(Number(limit))
  ]);

  res.json({
    total,
    products
  });
}

const store = async (req, res) => {
  const { name, price = 0, description = '', category_id } = req.body;
  const query = { name };

  const productDB = await Product.findOne(query);

  if (productDB && productDB.name.toLowerCase() === name.toLowerCase()) {
    return res.status(400).json({
      msg: `The product ${name} already exists.`
    });
  }

  const date = new Date();
  const data = {
    name,
    price,
    description,
    category: category_id,
    user: req.userLogged._id,
    created_at: date,
    modified_at: date
  }

  try {
    const product = new Product(data);
    await product.save();

    res.status(201).json({
      msg: 'Product created successfully.',
      product
    });
  } catch (error) {
    res.status(500).json({
      msg: 'Error creating product.'
    });
  }
}

const show = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id)
    .populate('category', ['name', '_id'])
    .populate('user', ['name', '_id']);

  res.json({
    product,
  });
}

const update = async (req, res) => {
  const { id } = req.params;
  const { available, user, created_at, modified_at, deleted_at, ...body } = req.body;

  if (body.name) {
    const query = { name: body.name };
    const productDB = await Product.findOne(query);

    if (productDB
      && productDB._id.toString() !== id
      && productDB.name.toLowerCase() === body.name.toLowerCase()
    ) {
      return res.status(400).json({
        msg: `The product ${body.name} already exists.`
      });
    }
  }

  body.user = req.userLogged._id;
  body.modified_at = new Date();

  if (body.category_id) {
    body.category = body.category_id;
    delete body.category_id;
  }

  const product = await Product.findByIdAndUpdate(id, body, { new: true });

  res.json({
    msg: 'Peoduct updated successfully.',
    product
  });
}


const destroy = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findOneAndUpdate(id, { deleted_at: new Date() }, { new: true });

  res.json({
    msg: 'Product deleted successfully.',
    product
  });
}

module.exports = {
  index,
  store,
  show,
  update,
  destroy
}
