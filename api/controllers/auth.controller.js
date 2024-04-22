import bcrypt from "bcryptjs";
import pool from "../database.js";
import errorHandler from "../utils/error.js";

export const register = async (req, res, next) => {
  try {
    const { username, email, password, name } = req.body;
    // check if user already exist
    let query = "SELECT * FROM users WHERE email = ?";
    const [users] = await pool.query(query, [email]);
    if (users.length) return next(errorHandler(401, "user already exist"));
    // if not, create new user
    // hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);
    query =
      "INSERT INTO users (`username`, `email`, `password`, `name`) VALUES (?, ?, ?, ?)";
    await pool.query(query, [username, email, hashedPassword, name]);
    res.status(201).json({
      success: true,
      message: "user create successfully",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // check if user exist
    const query = "SELECT * FROM users WHERE email = ?";
    const [users] = await pool.query(query, [email]);
    if (!users.length) return next(errorHandler(404, "user does not exist"));
    // check if password correct
    const checkPassword = bcrypt.compareSync(password, users[0].password);
    if (!checkPassword)
      return next(errorHandler(401, "email or password incorrect"));
    req.session.user = users[0].email;

    const { password: pass, ...rest } = users[0];

    res.status(200).json(rest);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    // req.session.destroy(() => {
    //   console.log("session destroyed");
    // });
    await new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(errorHandler(500, "fail to logout"));
        } else {
          resolve();
        }
      });
    });
    console.log("Session destroyed");
    res.clearCookie("connect.sid");
    res.status(200).json("User has been logged out");
  } catch (err) {
    next(err);
  }
};
