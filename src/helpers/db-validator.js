const { User, Category, Role, Product } = require('../models');

const isRoleValid = async (role = '') => {
  const roleDB = await Role.findOne({ name: role })
  if (!roleDB) {
    throw new Error(`The role is not registered.`)
  }
}

const existEmail = async (email = '') => {
  const existEmail = await User.findOne({ email });
  if (existEmail) {
    throw new Error(`The email already exists`);
  }
}

const existUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error(`This id of user is not registed.`);
  }
}

const existCategoryById = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new Error(`This id of category is not registed.`);
  }
}

const existProductById = async (id) => {
  const product = await Product.findById(id);  
  if (!product) {
    throw new Error(`This id of product is not registed.`);
  }
}

const allowedCollections = (collection = '', collections = []) => {
  const isAllowed = collections.includes(collection);  
  if (!isAllowed) {
    throw new Error(`This ${collection} collection not supported (${collections}).`);
  }
  return true;
}

module.exports = {
  isRoleValid,
  existEmail,
  existUserById,
  existCategoryById,
  existProductById,
  allowedCollections
}
