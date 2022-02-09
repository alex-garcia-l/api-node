const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Name is required']
  },
  price: {
    type: Number,
    default: 0
  },
  description: {
    type: String
  },
  available: {
    type: Boolean,
    default: true
  },
  image: {
    type: String
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  created_at: {
    type: Date,
    required: [true, 'Created_at is required']
  },
  modified_at: {
    type: Date,
    required: [true, 'Modified_at is required']
  },
  deleted_at: {
    type: Date,
    default: null
  }
});

ProductSchema.methods.toJSON = function () {
  let { __v, _id, name, deleted_at, ...data } = this.toObject();

  data = { 
    uid: this._id,
    name: this.name.charAt(0).toUpperCase() + this.name.slice(1),
    ...data 
  }
  
  return data;
}

module.exports = model('Product', ProductSchema);