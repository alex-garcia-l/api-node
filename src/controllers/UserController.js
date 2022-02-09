const bcrypt = require('bcryptjs');
const { User } = require('../models');

const index = async (req, res) => {

  const { limit = 15, from = 0 } = req.query;
  const query = { status: true };

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query)
      .skip(Number(from))
      .limit(Number(limit))
  ])

  res.json({
    total,
    users
  });
}

const store = async (req, res) => {

  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password, role });

  const salt = bcrypt.genSaltSync();
  user.password = bcrypt.hashSync(password, salt);

  await user.save();

  res.json({
    msq: "User created successfully.",
    user
  });
}

const show = (req, res) => {

  const { id } = req.params;

  res.json({
    msq: "SHOW desde user con controllador.",
    id
  });
}

const update = async (req, res) => {
  const { id } = req.params;
  const { _id, password, createWithGoogle, ...userReq } = req.body;

  // TODO: validate database
  if (password) {
    const salt = bcrypt.genSaltSync();
    userReq.password = bcrypt.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(id, userReq);

  res.json({
    msg: 'User updated successfully.',
    user
  });
}


const destroy = async (req, res) => {
  const { id } = req.params;

  // const user = await User.findOneAndDelete(id);
  const user = await User.findOneAndUpdate(id, { status: false });

  res.json({
    user
  });
}

module.exports = {
  index,
  store,
  show,
  update,
  destroy
}
