import pool from "../database.js";

export const getPosts = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const query =
      "SELECT p.*, u.id AS userId, username, profile FROM posts AS p INNER JOIN users AS u ON (u.id = p.user_id) LEFT JOIN relationships AS r ON p.user_id = r.followed_user_id WHERE r.follower_user_id = ? OR p.user_id = ? ORDER BY p.createdAt DESC";
    const [posts] = await pool.query(query, [userId, userId]);
    // console.log(posts);
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};
