const bcrypt = require("bcrypt");
const SALT_ROUND = 10;

/**
   *  hashing password 
   * @param {string} password string
   * @returns {Promise<string>} hashed password
   */
exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(SALT_ROUND);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

/**
 *  compare password from request and from database
 * @param {string} passwordEntered original password submitted by user
 * @param {string} hashedPassword hashed password from database
 * @returns {Promise<boolean>} compare result
 */
exports.comparePassword = async (passwordEntered, hashedPassword) => {
  const match = bcrypt.compare(passwordEntered, hashedPassword);
  return match
}