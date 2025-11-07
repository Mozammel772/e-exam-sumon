const jwt = require("jsonwebtoken");

const generateJWT = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  return token;
};

module.exports = generateJWT;
