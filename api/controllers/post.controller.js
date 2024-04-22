import pool from "../database.js";

export const getPosts = async (req, res, next) => {
  try {
    console.log("👋");
    const query =
      "SELECT p.*, u.id AS userId, username, profile FROM posts AS p INNER JOIN users AS u ON (u.id = p.user_id)";
    const [posts] = await pool.query(query);
    console.log("🔥");
    console.log(posts);
    res.status(200).json(posts[0]);
  } catch (err) {
    next(err);
  }
};
