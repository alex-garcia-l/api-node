const { response } = require("express")

const isAdminRole = (req, res = response, next) => {

  if (!req.userLogged) {
    return res.status(500).json({
      msg: 'First validate token.'
    });
  }

  const { role, name } = req.userLogged;

  if (role !== 'ADMIN') {
    return res.status(401).json({
      msg: `${name} not is administrator.`
    });
  }

  next();
}

const hasRole = (...roles) => {  // hasRole('ROLE_1', 'ROLE_2', 'ROLE_3' ... 'ROLE_N')
  return (req, res = response, next) => {

    if (!req.userLogged) {
      return res.status(500).json({
        msg: 'First validate token.'
      });
    }

    const { role, name } = req.userLogged;
    
    if (!roles.includes(role)) {
      return res.status(401).json({
        msg: `${name} needs one of these roles: ${roles}.`
      });
    }

    next();
  }
}

module.exports = {
  isAdminRole,
  hasRole
}
