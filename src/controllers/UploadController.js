const { request, response } = require('express');
const { uploadOneFile } = require('../helpers/uploads');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

const { User, Product } = require('../models');


cloudinary.config(process.env.CLOUDINARY_URL);

const uploadOne = async (req = request, res = response) => {

  if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
    return res.status(400).send('No files were uploaded.');
  }

  try {
    const file = req.files.file;
    const response = await uploadOneFile({ file, folder: 'images' });

    res.json({
      response
    });

  } catch ({ msg, statusCode }) {
    res.status(statusCode).json({ msg });
  }
}

const uploadFileByCollection = async (req = request, res = response) => {
  const { id, collection } = req.params;

  if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
    return res.status(400).send('No files were uploaded.');
  }

  const file = req.files.file;
  let model;

  switch (collection) {
    case 'users':
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({ msg: `Id not found in ${collection}` });
      }
      break;
    case 'products':
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({ msg: `Id not found in ${collection}` });
      }
      break;
    default:
      return res.status(500).json({ msg: 'Error: Collection not processing' });
  }

  if (model.image) {
    const pathImage = path.join(__dirname, '../uploads', collection, model.image);

    if (fs.existsSync(pathImage)) {
      fs.unlinkSync(pathImage);
    }
  }

  const { name } = await uploadOneFile({ file, folder: `images/${collection}` });
  model.image = name;
  await model.save();

  res.json({
    msg: `Image upload succesfull in collection ${collection}`,
    model
  });
}

const uploadFileByCollectionCloudinary = async (req = request, res = response) => {
  const { id, collection } = req.params;

  if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
    return res.status(400).send('No files were uploaded.');
  }

  let model;

  switch (collection) {
    case 'users':
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({ msg: `Id not found in ${collection}` });
      }
      break;
    case 'products':
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({ msg: `Id not found in ${collection}` });
      }
      break;
    default:
      return res.status(500).json({ msg: 'Error: Collection not processing' });
  }

  if (model.image) {
    const nameArray = model.image.split('/');
    const name = nameArray[nameArray.length - 1];
    const [publicID] = name.split('.');

    cloudinary.uploader.destroy(`coffee/images/${collection}/${publicID}`);
  }

  const { tempFilePath } = req.files.file;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath, { folder: `coffee/images/${collection}` });

  model.image = secure_url;
  await model.save();

  res.json({
    msg: `Image upload succesfull in collection ${collection}`,
    model
  });
}

const getFile = async (req, res = response) => {
  const { id, collection } = req.params;

  switch (collection) {
    case 'users':
      model = await User.findById(id);
      break;
    case 'products':
      model = await Product.findById(id);
    default:
      return res.status(500).json({ msg: 'Error: Collection not processing' });
  }

  if (model.image) {
    const pathImage = path.join(__dirname, '../uploads', `images/${collection}`, model.image);

    if (fs.existsSync(pathImage)) {
      return res.sendFile(pathImage);
    }
  }

  const notImage = path.join(__dirname, '../assets/images/not-image.jpg');
  res.sendFile(notImage);
}

module.exports = {
  uploadOne,
  uploadFileByCollection,
  getFile,
  uploadFileByCollectionCloudinary
}
