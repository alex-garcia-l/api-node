const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Category, Product, User, Role } = require('../models')

const allowedCollections = [
  'categories',
  'products',
  'users',
  'roles'
];

/**
 * Search method
 */
const search = (req, res = response) => {
  const { limit = 15, from = 0 } = req.query;
  const { collection, term } = req.params;

  if (!allowedCollections.includes(collection)) {
    return res.status(400).json({
      mag: `Only allowed collections: ${allowedCollections}`
    });
  }

  switch (collection) {
    case 'categories':
      searchCategories(term, Number(limit), Number(from), res);
      break;
    case 'products':
      searchProducts(term, Number(limit), Number(from), res);
      break;
    case 'users':
      searchUsers(term, Number(limit), Number(from), res);
      break;

    default:
      res.json({
        msg: 'Not procesing search.'
      });
  }
}

/**
 * Search users
 */
const searchUsers = async (term, limit, from, res) => {
  const isMongoID = ObjectId.isValid(term);

  if (isMongoID) {
    const user = await User.findById(term);

    const totals = (user) ? 1 : 0;
    const data = (user) ? [user] : [];
    const totalData = (user) ? 1 : 0;

    return responseJSON(res, totals, data, totalData, limit, from);
  }

  const regExp = RegExp(term, 'i');
  const query = {
    $or: [{ name: regExp }, { email: regExp }],
    $and: [{ deleted_at: null }],
  }

  const [totals, totalData, data] = await Promise.all([
    User.countDocuments({ deleted_at: null }),
    User.countDocuments(query),
    User.find(query)
      .skip(from)
      .limit(limit)
  ]);

  responseJSON(res, totals, data, totalData, limit, from);
}

/**
 * Search categories
 */
const searchCategories = async (term, limit, from, res) => {
  const isMongoID = ObjectId.isValid(term);

  if (isMongoID) {
    const category = await Category.findById(term)
      .populate('user', ['name', '_id']);

    const totals = (category) ? 1 : 0;
    const data = (category) ? [category] : [];
    const totalData = (category) ? 1 : 0;

    return responseJSON(res, totals, data, totalData, limit, from);
  }

  const regExp = RegExp(term, 'i');
  const query = { name: regExp, deleted_at: null }

  const [totals, totalCategories, data] = await Promise.all([
    Category.countDocuments({ deleted_at: null }),
    Category.countDocuments(query),
    Category.find(query)
      .populate('user', ['name', '_id'])
      .skip(from)
      .limit(limit)
  ]);

  responseJSON(res, totals, data, totalCategories, limit, from);
}

/**
 * Search products
 */
const searchProducts = async (term, limit, from, res) => {
  const isMongoID = ObjectId.isValid(term);

  if (isMongoID) {
    const product = await Product.findById(term)
      .populate('category', ['name', '_id'])
      .populate('user', ['name', '_id']);

    const totals = (product) ? 1 : 0;
    const data = (product) ? [product] : [];
    const totalData = (product) ? 1 : 0;

    return responseJSON(res, totals, data, totalData, limit, from);
  }

  const regExp = RegExp(term, 'i');
  const query = {
    $or: [{ name: regExp }, { description: regExp }],
    $and: [{ deleted_at: null }],
  }

  const [totals, totalProducts, data] = await Promise.all([
    Product.countDocuments({ deleted_at: null }),
    Product.countDocuments(query),
    Product.find(query)
      .populate('category', ['name', '_id'])
      .populate('user', ['name', '_id'])
      .skip(from)
      .limit(limit)
  ]);

  responseJSON(res, totals, data, totalProducts, limit, from);
}

/**
 * Response data
 */
const responseJSON = (res, totals, data, totalData, limit, from) => {
  res.json({
    totals,
    results: {
      data,
      total: totalData,
      paginate: {
        limit,
        from
      }
    }
  });
}

module.exports = {
  search
}
