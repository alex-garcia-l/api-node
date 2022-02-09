const { response } = require('express');
const bcrypt = require('bcryptjs');

const { User } = require('../models');
const { generateToken } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response) => {

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        msg: `Password or email is incorrect - email.`
      });
    }

    if (!user.status) {
      return res.status(500).json({
        msg: `User blocked.`
      });
    }

    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(500).json({
        msg: `Password or email is incorrect - password.`
      });
    }

    const token = await generateToken(user.id);

    res.json({
      user,
      tokenType: 'bearer',
      accessToken: token,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Report to administrator'
    });
  }
}

const loginGoogle = async (req, res) => {
  
  const { idToken } = req.body;

  try {
    const { name, image, email } = await googleVerify(idToken);
    
    let user = await User.findOne({ email });

    if (!user) {
      const data = {
        name,
        email,
        password: ':p',
        role: 'USER',
        image,
        createWithGoogle: true
      }

      user = new User(data);
      await user.save();
    }

    if (!user.status) {
      return res.status(500).json({
        msg: `User blocked.`
      });
    }

    const token = await generateToken(user.id);
    
    res.json({
      user,
      tokenType: 'bearer',
      accessToken: token,
    });
  } catch (error) {
    res.status(400).json({
      msg: 'The token is not valid.'
    });
  }
}

module.exports = {
  login,
  loginGoogle
}
