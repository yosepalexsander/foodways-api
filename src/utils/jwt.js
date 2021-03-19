const jwt = require("jsonwebtoken");


/**
 *  generate access token
 * @param {string} user 
 * @returns {string} access token
 */
exports.generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
};


/**
 *  generate refresh token
 * @param {string} user 
 * @returns {string} refresh token
 */
exports.generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
};

/**
 *  verify access token
 * @param {string} token access token
 * @returns {strin|object} user 
 */
exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
}