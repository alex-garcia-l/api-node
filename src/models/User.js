const { Schema, model } = require('mongoose');

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  role: {
    type: String,
    required: true,
    emun: ['ADMIN', 'USER']
  },
  image: {
    type: String
  },
  status: {
    type: Boolean,
    default: true
  },
  createWithGoogle: {
    type: Boolean,
    default: false
  }
});

UserSchema.methods.toJSON = function () {
  let { __v, password, _id, ...data } = this.toObject();

  data = {
    uid: _id,
    ...data
  }

  return data;
}

module.exports = model('User', UserSchema);
