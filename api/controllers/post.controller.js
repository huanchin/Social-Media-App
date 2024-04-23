import pool from "../database.js";
import moment from "moment";

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

export const createPost = async (req, res, next) => {
  const { desc, img } = req.body;
  try {
    const userId = req.session.userId;
    const query =
      "INSERT INTO `social`.`posts` ( `user_id`, `desc`, `img`, `createdAt`) VALUES ( ?, ?, ?, ?);";
    const newPost = [
      userId,
      desc,
      img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    ];
    await pool.query(query, newPost);
    res.status(201).json("post has been created");
  } catch (err) {
    next(err);
  }
};
