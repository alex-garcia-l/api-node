const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const { User } = require('../models');

const validateJWT = async (req = request, res = response, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      msg: 'The request does not have a token.'
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRET_JWT);
    const user = await User.findById(uid);

    if (!user) {
      return res.status(401).json({
        msg: 'Invalid token: User not found in the database.'
      });
    }

    if (!user.status) {
      return res.status(401).json({
        msg: 'Invalid token: User not activated.'
      });
    }
    
    req.userLogged = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: 'Invalid token.'
    });
  }
}

module.exports = {
  validateJWT
}
