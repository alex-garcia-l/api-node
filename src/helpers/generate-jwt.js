const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (uid = '') => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    jwt.sign(payload, process.env.SECRET_JWT, { expiresIn: '4h' }, (error, token) => {
      if (error) {
        console.log(error);
        reject('Token not generated');
      } else {
        resolve(token);
      }
    });
  });
}

const helperValidateJWT = async (authorization) => {
  const token = authorization && authorization.split(' ')[1];

  try {
    const { uid } = jwt.verify(token, process.env.SECRET_JWT);  
    const user = await User.findById(uid);
  
    if (!user && !user.status) {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateToken,
  helperValidateJWT
}
