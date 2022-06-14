require("dotenv").config();
const DB_URI = process.env.DB_URI;
const SECRET = process.env.SECRET;
const REFRESH_TOKENS = process.env.REFRESH_TOKENS;

module.exports = {
  DB_URI,
  SECRET,
  REFRESH_TOKENS,
};
