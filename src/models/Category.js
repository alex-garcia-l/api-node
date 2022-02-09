const { Schema, model } = require('mongoose');

const CategorySchema = Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Name is required']
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

CategorySchema.methods.toJSON = function () {
  let { __v, _id, name, deleted_at, ...data } = this.toObject();

  data = { 
    uid: this._id,
    name: this.name.charAt(0).toUpperCase() + this.name.slice(1),
    ...data 
  }

  return data;
}

module.exports = model('Category', CategorySchema);
