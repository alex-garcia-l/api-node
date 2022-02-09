const jwt = require('jsonwebtoken');

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

module.exports = {
  generateToken
}
